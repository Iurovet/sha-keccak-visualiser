import React, { useState } from 'react';
import { Config as cfg } from './config';
import * as Utils from './utils';
export default App;

  function App() {
  const [hex, setHex] = useState(() => '0'.repeat(128));

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;

    if (e.key.length === 1) {
      // Prevent normal browser behaviour
      e.preventDefault();

      let currFunction = cfg.sha1.function["0"]
      const context: Utils.EvaluationContext = { 
        B: parseInt(hex.substring(8, 16), 16), 
        C: parseInt(hex.substring(16, 24), 16), 
        D: parseInt(hex.substring(24, 32), 16) 
      }; 
      let result = Utils.evaluate(Utils.parse(Utils.toTokens(currFunction)), context);
      console.log((result >>> 0).toString(16).toUpperCase()); // Logging for testing only

      // Reject non-hex input
      if (/^[0-9a-fA-F]$/.test(e.key)) {
        const globalBoxStart = index * 8;
        
        // If cursor is at the end of the box (position 8), lock it to overwrite the 8th character
        const overwriteIndex = cursorPosition === 8 ? globalBoxStart + 7 : globalBoxStart + cursorPosition;

        // Replace exactly ONE character in our master state string
        const newHex = 
          hex.substring(0, overwriteIndex) + 
          e.key + 
          hex.substring(overwriteIndex + 1);

        setHex(newHex);

        // Move the cursor forward exactly 1 space manually
        setTimeout(() => {
          const nextCursorPos = cursorPosition === 8 ? 8 : cursorPosition + 1;
          input.setSelectionRange(nextCursorPos, nextCursorPos);
        }, 0);
      }
    }

    // Backspace or delete
    else if (e.key === 'Backspace' || e.key === 'Delete') {
      // Prevent normal events
      e.preventDefault();

      if (cursorPosition > 0) {
        const globalBoxStart = index * 8;
        const targetGlobalIndex = globalBoxStart + cursorPosition - 1;

        setHex(
          hex.substring(0, targetGlobalIndex + (e.key === 'Delete' ? 1 : 0)) + 
          '0' + 
          hex.substring(targetGlobalIndex + (e.key === 'Delete' ? 2 : 1))
        );

        // Move the cursor back exactly 1 space manually
        setTimeout(() => {
          input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        }, 0);
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
            value={hex.substring(index * 8, (index * 8) + 8)}
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