import { SHA1 } from '../configs/configs_sha1';
import * as Functions from './utils_functions';


// Instantiate the config object
const sha1 = new SHA1();

/* f-function is:
 * OR(AND(B, C), AND(NOT(C), D)) - rounds 0-19,
 * XOR(B, C, D) - rounds 20-39,
 * XOR(AND(B, C), AND(B, D), AND(C, D)) - rounds 30-59,
 * XOR(B, C, D) - rounds 60-79.
 *
 * Where B, C, D represent words 2, 3 and 4 respectively
*/
function fFunction(runningTotal: string, roundNumber: number) : string {
  let currFunction = sha1.fFunctions[roundNumber];
  
  // Set words 2, 3, 4
  const context: Functions.EvaluationContext = { 
    B: parseInt(runningTotal.substring(8, 16), 16),
    C: parseInt(runningTotal.substring(16, 24), 16),
    D: parseInt(runningTotal.substring(24, 32), 16),
  };

  let result = Functions.evaluate(
    Functions.parse(Functions.toTokens(currFunction)), context
  );
  return (result >>> 0).toString(16).padStart(8, '0');
}

/* To calculate word 1, start by calculating the f-function (uses words 2, 3, 4).
 * The output of that is added with word 5, then with word 1 left-shifted 5 bits,
 * then with the message schedule, then with the round constant.
 * 
 * All additions are mod 2^32 (32 bits or 4 hex characters).
*/
function getWordOne(userInput: string, runningTotal: string, roundNumber: number) : string {
  let additionWords = [
    fFunction(runningTotal, roundNumber),
    runningTotal.substring(32, 40),
    word1BitShift(runningTotal.substring(0, 8)),
    userInput, // Message schedule
    sha1.roundConstants[roundNumber]
  ];

  // for (let i = 0; i < additionWords.length; ++i) {
  //   console.log(additionWords[i]);
  // }
  
  let addTotal = additionWords[0];
  for (let i = 1; i < additionWords.length; ++i) {
    // Addition mod 2^32
    let currFunction = sha1.otherFunctions[2];

    const context: Functions.EvaluationContext = { 
      W1: parseInt(addTotal, 16),
      W2: parseInt(additionWords[i], 16),
    };

    let result = Functions.evaluate(
      Functions.parse(Functions.toTokens(currFunction)), context
    );
    addTotal = (result >>> 0).toString(16).padStart(8, '0');
  }

  return addTotal;
}

// Word 3 is simply word 2 left-shifted 30 bits
function getWordThree(wordTwo: string) {
  let currFunction = sha1.otherFunctions[1];
  const context: Functions.EvaluationContext = { 
    W2: parseInt(wordTwo, 16)
  };

  let result = Functions.evaluate(
    Functions.parse(Functions.toTokens(currFunction)), context
  );
  return (result >>> 0).toString(16).padStart(8, '0');
}

function updateSchedule(userInput: string, roundNumber: number) : string {  
  // continue should execute on the 1st 16 of 80 rounds
  let currFunction = sha1.msgFunctions[roundNumber];
  if (currFunction === "NONE") { return userInput; }
  
  // This ordering should ensure no out of bounds errors
  // This function is ROTL(XOR(T, E, F, S), 1)
  const context: Functions.EvaluationContext = { 
    T: parseInt(userInput.substring(8*(roundNumber-3), 8*(roundNumber-2)), 16),
    E: parseInt(userInput.substring(8*(roundNumber-8), 8*(roundNumber-7)), 16),
    F: parseInt(userInput.substring(8*(roundNumber-14), 8*(roundNumber-13)), 16),
    S: parseInt(userInput.substring(8*(roundNumber-16), 8*(roundNumber-15)), 16)
  };

  let result = Functions.evaluate(
    Functions.parse(Functions.toTokens(currFunction)), context
  );
  return userInput.substring(0, 8*roundNumber) +
         (result >>> 0).toString(16).padStart(8, '0') +
         userInput.substring(8*(roundNumber + 1));
}

// Left-shift word 1 by 5 bits
function word1BitShift(wordOne: string) {
  let currFunction = sha1.otherFunctions[0];
  const context: Functions.EvaluationContext = { 
    W1: parseInt(wordOne, 16)
  };

  let result = Functions.evaluate(
    Functions.parse(Functions.toTokens(currFunction)), context
  );
  return (result >>> 0).toString(16).padStart(8, '0');
}

export { getWordOne, getWordThree, updateSchedule }