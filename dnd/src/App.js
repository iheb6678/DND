// src/App.js
import React, { useState } from 'react';
import './App.css';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'BOX';

const Box = ({ name }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`box ${isDragging ? 'dragging' : ''}`}
    >
      {name}
    </div>
  );
};

const Target = ({ onDrop, children }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => onDrop(item),
  });

  return (
    <div ref={drop} className="target">
      {children}
    </div>
  );
};

function App() {
  const [boxes, setBoxes] = useState([]);

  const handleDrop = (item) => {
    setBoxes([...boxes, item]);
  };

  return (
    <div className="App">
      <h1>Drag and Drop Example</h1>
      <div className="container">
        <div className="source-container">
          <Box name="Item 1" />
          <Box name="Item 2" />
          <Box name="Item 3" />
        </div>
        <div className="target-container">
          <Target onDrop={handleDrop}>
            {boxes.map((box, index) => (
              <Box key={index} name={box.name} />
            ))}
          </Target>
        </div>
      </div>
    </div>
  );
}

export default App;
