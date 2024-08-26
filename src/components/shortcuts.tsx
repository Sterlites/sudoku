import React from 'react';

const Shortcuts: React.FC = () => {
  return (
    <div className="shortcuts">
      <h3>Keyboard Shortcuts</h3>
      <ul>
        <li><strong>Arrow keys:</strong> Navigate cells</li>
        <li><strong>Numbers 1-9:</strong> Input number</li>
        <li><strong>Backspace/Delete:</strong> Clear cell</li>
        <li><strong>Ctrl + N:</strong> New game</li>
        <li><strong>Ctrl + C:</strong> Check solution</li>
        <li><strong>Ctrl + S:</strong> Solve puzzle</li>
      </ul>
    </div>
  );
};

export default Shortcuts;
