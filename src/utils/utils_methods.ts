import { SHA1 } from '../configs/configs_sha1';
import * as Functions from './utils_functions';

function updateSchedule(
  userInput: string,
  setUserInput: React.Dispatch<React.SetStateAction<string>>
) {
  // Instantiate the config object
  const sha1 = new SHA1();
  
  for (let i = 0; i < sha1.rounds; ++i) {
    // continue should execute on the 1st 16 of 80 rounds
    let currFunction = sha1.msgFunctions[i];
    if (currFunction === "NONE") { continue; }
    
    // This ordering should ensure no out of bounds errors
    const context: Functions.EvaluationContext = { 
      T: parseInt(userInput.substring(8*(i-3), 8*(i-2)), 16),
      E: parseInt(userInput.substring(8*(i-8), 8*(i-7)), 16),
      F: parseInt(userInput.substring(8*(i-14), 8*(i-13)), 16),
      S: parseInt(userInput.substring(8*(i-16), 8*(i-15)), 16)
    };

    let result_string = Functions.evaluate(
      Functions.parse(Functions.toTokens(currFunction)), context
    );
    let result = (result_string >>> 0).toString(16).toUpperCase();

    const newuserInput = 
      userInput.substring(0, 8*i) + 
      result + 
      userInput.substring(8*(i + 1));

    setUserInput(newuserInput);
  }
}

export { updateSchedule }