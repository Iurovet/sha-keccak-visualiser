import React, { useState, useEffect, useRef } from 'react';
import { SHA1 } from './configs/configs_sha1';
import * as MethodsSHA1 from './utils/utils_methods_sha1';

function shiftCursor(input: HTMLInputElement, index : number) {
  setTimeout(() => {
    input.setSelectionRange(index, index);
  }, 0);
}

function App() {
  // The 1st fifth (8*16=128) is the raw input, the rest is the message schedule
  // const [userInput, setUserInput] = useState(() => '0'.repeat(8 * 80));
  const [userInput, setUserInput] = useState(
   "4f3aef8ee41fa2ffefba75a0bd27cf7c5ba17c0fcaa78e08be3d777c6206d6118139b083ab75ce7b6e3487910d29930c8ed4e5deb5763294178364a3013d1130"+
   "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"+
   "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"+
   "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"+
   "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  );

  // SHA0 is just SHA1 but XOR(X-3, X-8, X-14, X-16) is not rotated left by 1 bit
  const [sha0Mode, setSHA0Mode] = useState(false);

  // Truncate input to a chosen number of bits
  const [numBits, setNumBits] = useState(512);

  // Make sure strict mode doesn't double execute useEffect
  const doubleExecution = useRef(false);

  // Instantiate the config object
  const sha1 = new SHA1();

  // Hashing
  useEffect(() => {
    // Once again, prevent double execution
    if (doubleExecution.current) { return; }
    doubleExecution.current = true;

    // Track the message schedule and running total
    let currTotal = sha1.startValue;
    let newUserInput = userInput;

    // 80 rounds
    for (let roundNumber = 0; roundNumber < sha1.rounds; ++roundNumber) {
      // Get the message schedule
      newUserInput = MethodsSHA1.updateSchedule(newUserInput, roundNumber);
      
      // Track the new output
      let wordOne = MethodsSHA1.getWordOne(
        newUserInput.substring(8*roundNumber, 8*(roundNumber + 1)),
        currTotal,
        roundNumber
      );
      let wordTwo = currTotal.substring(0, 8);
      let wordThree = MethodsSHA1.getWordThree(currTotal.substring(8, 16));
      let wordFour = currTotal.substring(16, 24);
      let wordFive = currTotal.substring(24, 32);
      
      // Update the output
      currTotal = wordOne + wordTwo + wordThree + wordFour + wordFive;
      console.log("R" + roundNumber, currTotal);

      // Re-enable execution straight away
      setTimeout(() => {
        doubleExecution.current = false;
      }, 0);
    }
  }, [userInput]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;

    // Find where the cursor is
    const overwriteIndex = (index * 8) + cursorPosition;

    // Prevent normal events
    e.preventDefault();

    if (e.key.length === 1) {
      // Reject non-hex input
      if (/^[0-9a-fA-F]$/.test(e.key)) {        
        // In the input string, replace at the required position.
        setUserInput(userInput.substring(0, overwriteIndex) + e.key + 
                     userInput.substring(overwriteIndex + 1));

        // Right-shift the if possible
        if (cursorPosition <= 6) {
          shiftCursor(e.currentTarget, cursorPosition + 1);
        };
      }
    }

    // Other keys
    else {
      switch (e.key) {
        // Backspace by changing the current character to a 0
        case 'Backspace':
          // In the input string, replace at the required position.
          setUserInput(userInput.substring(0, overwriteIndex - 1) + "0" + 
                       userInput.substring(overwriteIndex));

          // Left-shift the cursor if possible
          if (cursorPosition > 0) {
            shiftCursor(e.currentTarget, cursorPosition - 1);
          }
          break;
        
        // Backspace by changing the next character to a 0
        case 'Delete':
          // In the input string, replace at the required position.
          setUserInput(userInput.substring(0, overwriteIndex) + "0" + 
                       userInput.substring(overwriteIndex + 1));

          // Do nothing to shift the cursor
          shiftCursor(e.currentTarget, cursorPosition);
          break;
        case 'ArrowLeft':
          // In this example and the next, no key was pressed
          // Left-shift the cursor if possible
          if (cursorPosition > 0) {
            shiftCursor(e.currentTarget, cursorPosition - 1);
          }
          break;
        case 'ArrowRight':
          // Right-shift the cursor if possible
          if (cursorPosition <= 7) {
            shiftCursor(e.currentTarget, cursorPosition + 1);
          }
          break;
        default:
          break;
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      gap: '14px 12px',
      padding: '20px',
      maxWidth: '100%'
    }}>
      {Array.from({ length: 16 }, (_, index) => {
        return (
          <input key={index} type="text" placeholder="00000000"
            value={userInput.substring(index * 8, (index + 1) * 8)}
            onKeyDown={(e) => handleKeyDown(index, e)} onChange={() => {}}
            style = {{
              textAlign: 'center',
              letterSpacing: '15.2px',
              fontFamily: 'monospace',
              fontSize: '16px',
              border: '1px solid #bbb',
              borderRadius: '6px',
              backgroundColor: '#fff'
            }}
          />
        );
      })}
    </div>
  );
}

export default App;