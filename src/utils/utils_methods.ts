import { Config as cfg } from '../config';
import * as Functions from './utils_functions';

function updateSchedule(
  hex: string,
  setHex: React.Dispatch<React.SetStateAction<string>>
) {
  for (let i = 0; i < cfg.sha1.rounds; ++i) {
    // continue should execute on the 1st 16 of 80 rounds
    let currFunction = cfg.sha1.msgFunctions[i];
    if (currFunction === "NONE") { continue; }
    
    // This ordering should ensure no out of bounds errors
    const context: Functions.EvaluationContext = { 
      T: parseInt(hex.substring(8*(i-3), 8*(i-2)), 16),
      E: parseInt(hex.substring(8*(i-8), 8*(i-7)), 16),
      F: parseInt(hex.substring(8*(i-14), 8*(i-13)), 16),
      S: parseInt(hex.substring(8*(i-16), 8*(i-15)), 16)
    };
    console.log("Lowest index is", 8*(i-16));

    let result_string = Functions.evaluate(
      Functions.parse(Functions.toTokens(currFunction)), context
    );
    let result = (result_string >>> 0).toString(16).toUpperCase();

    const newHex = 
      hex.substring(0, 8*i) + 
      result + 
      hex.substring(8*(i + 1));

    setHex(newHex);
  }
}

export { updateSchedule }