import React, { useState } from 'react';
import { SHA1 } from './configs/configs_sha1';
import * as Methods from './utils/utils_methods';
export default App;

function App() {
  // Instantiate the config object
  const sha1 = new SHA1();

  // The 1st fifth (8*16=128) is the raw input, the rest is the message schedule
  const [userInput, setUserInput] = useState(() => '0'.repeat(8 * 80));

  // The output is always 8*5=40 hex characters
  const [runningTotal, setRunningTotal] = useState(sha1.startValue);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;

      // Prevent normal events
      e.preventDefault();

    if (e.key.length === 1) {
      // Reject non-hex input
      if (/^[0-9a-fA-F]$/.test(e.key)) {
        const globalBoxStart = index * 8;
        
        // If cursor is at the end of the box (position 8), lock it to overwrite the 8th character
        const overwriteIndex = cursorPosition === 8 ? globalBoxStart + 7 : globalBoxStart + cursorPosition;

        // Replace just this character in our master state string
        const newHex = 
          userInput.substring(0, overwriteIndex) + 
          e.key + 
          userInput.substring(overwriteIndex + 1);

        setUserInput(newHex);

        // Move the cursor forward exactly 1 space manually
        setTimeout(() => {
          const nextCursorPos = cursorPosition === 8 ? 8 : cursorPosition + 1;
          input.setSelectionRange(nextCursorPos, nextCursorPos);
        }, 0);
      }
    }

    // Backspace or delete
    else if (e.key === 'Backspace' || e.key === 'Delete') {
      if (cursorPosition > 0) {
        const globalBoxStart = index * 8;
        const targetGlobalIndex = globalBoxStart + cursorPosition - 1;

        setUserInput(
          userInput.substring(0, targetGlobalIndex + (e.key === 'Delete' ? 1 : 0)) + 
          '0' + 
          userInput.substring(targetGlobalIndex + (e.key === 'Delete' ? 2 : 1))
        );

        // Move the cursor back exactly 1 space manually
        setTimeout(() => {
          input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        }, 0);
      }
    }

    for (let i = 0; i < sha1.rounds; ++i) {
      // Track the new output
      let newTotal = "";

      // Update the message schedule
      Methods.updateSchedule(userInput, setUserInput);
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
            value={userInput.substring(index * 8, (index * 8) + 8)}
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