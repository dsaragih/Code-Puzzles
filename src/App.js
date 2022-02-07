import React, {Component, useRef, useState} from "react";
import { Stage, Layer, Rect, Line, Text, Group } from "react-konva";
import Konva from 'konva';
import {start, solution} from './data';
import { TextInput } from "./EditableText";


const grid = 68;
const gridWidth = window.innerWidth;
const linesA = [];
const linesB = [];

for (let i = 0; i < gridWidth / grid; i++) {
  linesA.push(
    <Line
      strokeWidth={2}
      stroke={"black"}
      points={[i * grid, 0, i * grid, gridWidth]}
    />
  );

  linesB.push(
    <Line
      strokeWidth={2}
      stroke={"black"}
      points={[0, i * grid / 2, gridWidth, i * grid/2]}
    />
  );
}

function Blocks (props) {

  const res = [];

  // Implement the on change function here that will update the blocks state
  // in App (specifically how to reference the Blocks function from App to access
  // the properties of Rect and Text).

  // Implement the editable text input

  for (let i = 0; i < props.item.length; i++) {
    const line = props.item[i];
    for (let j = 0; j < line["tokens"].length; j++) {

      const text = line["tokens"][j]["text"];
      res.push(
        <Group
          draggable
          onDragEnd={(e) => {
            const height = grid / 2;
            e.target.to({
              x: Math.round(e.target.x() / grid) * grid,
              y: Math.round(e.target.y() / height) * height
            });
          }}
        >
        <Rect
          width={grid}
          height={grid/2}
          x={grid * (line["indentations"] + j)}
          y={(grid/2) * i}
          fill="#fff0db"
        />
          {text == "{input}" ?
          <Text
          text={text}
          x={grid * (line["indentations"] + j)}
          y={(grid/2) * i}
          fontSize={20}
          /> :
          <Text
            text={text}
            x={grid * (line["indentations"] + j)}
            y={(grid/2) * i}
            fontSize={20}
          />
        }      
          
        </Group>
      )
    }
  }

  return res;

}

function App () {

  const [blocks, setBlocks] = useState(start["lines"])
  console.log(blocks)

  const blockRef = useRef(null);

  // Implement the JSON checker that will compare the current state to the solution
  // state.

  // Implement a prompt box that will display the puzzle prompt to the user

  function onChange () {
    const lines = [];
    const rects = blockRef.current.getChildren(node => node.getClassName() === "Rect")
    const texts = blockRef.current.getChildren(node => node.getClassName() === "Text")
    for (let i = 0; i < blocks.length; i++) {
      const tmp = {};
      const lst = [];
      const min = Infinity;
      for (let j = 0; j < rects.length; j++) {
        const pos = rects[i].pos();
        if (pos['y'] == (grid / 2) * i) {
          lst.push(texts[j].text);
          min = Math.min(min, pos['x']);
        }
      }
      tmp["tokens"] = lst;
      tmp["indentations"] = Math.round(min / grid);

      lines.push(tmp);
    }

    setBlocks(lines);
    console.log(lines)
  }

  return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {linesA}
          {linesB}
        </Layer>
  
        <Layer>
          <Blocks ref={blockRef} item={blocks} onChange={onChange}/>
        </Layer>
      </Stage>
  );
}

export default App;