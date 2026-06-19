import { useRef, useState, useEffect } from 'react'
import './App.css'
import InputCard from './assets/components/InputCard';


function App() {
  // Is the same effect as getContext('2d') but with type safety
  // How to change the type of button
  // Every new inputcard will have its own state 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [listFunctions, setListFunctions] = useState<Record<number, string>>({ 0: 'Math.sin(x) + Math.cos(x)', 1: 'Math.cos(x)' });
  const [zoom, setZoom] = useState<number>(1);
  // const [idfunction, setIdFunction] = useState<number>(0);

  // Drawing function (same logic as Vanilla)
  const drawGraph = () => {
    /*
    We need this every time due to resizing and to ensure we have the correct dimensions for the canvas.
     */
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    console.log(canvas.width, canvas.height); // Debugging: Check if canvas dimensions are set correctly
    console.log(canvas.clientWidth, canvas.clientHeight);

    const width = canvas.width, height = canvas.height;
    const xMin = -5 * zoom, xMax = 5* zoom;
    const yMin = -5 * zoom, yMax = 5* zoom;

    console.log("the axis x has this limits, xMin: ", xMin, ", xMax: ", xMax);
    console.log("the axis y has this limits, yMin: ", yMin, ", yMax: ", yMax);

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    ctx.clearRect(0, 0, width, height);
    // Draw lines
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), 0); ctx.lineTo(toCanvasX(0), height);// <Y-axis>
    ctx.moveTo(0, toCanvasY(0)); ctx.lineTo(width, toCanvasY(0));// <X-axis>
    ctx.stroke();

    // ctx.restore();

    Object.entries(listFunctions).forEach(([id, func]) => {
      // Plot function
      ctx.beginPath();
      let first = true;
      for (let px = 0; px <= width; px++) {
        const x = xMin + (px / width) * (xMax - xMin);
        let y;

        try {
          const evalFun = new Function('x', `return ${func}`);
          y = evalFun(x);
        }
        catch (error) {
          console.error(`Error occurred while evaluating function with id ${id}:`, error);
          return;
        }

        if (!isFinite(y)) { first = true; continue; }
        const py = toCanvasY(y);
        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    })

  };

  //Handler to update  specific function in the list
  const updateFunctionValue = (id: number, newValue: string) => {
    setListFunctions(prev => ({
      ...prev,
      [id]: newValue // Updates only the modified key, keeping the rest intact
    }))
  }

  const deleteFunctionValue = (id: number) => {
    setListFunctions(prev => Object.fromEntries(Object.entries(prev).filter(([key]) => Number(key) !== id)));
  }

  const zoomIn = () => {
    setZoom(Math.max(1, zoom - 5));
    console.log("zoom at this moment",zoom);
  }

  const zoomOut = () => {
    setZoom(zoom + 5);
    console.log("zoom at this moment", zoom);
  }

  // Redraw whenever the expression or variable changes
  useEffect(() => {
    drawGraph();
  }, [listFunctions, zoom]);

  return (
    <div className="App">
      <button id="button-plus" onClick={zoomIn}>+</button>
      <button id="button-minus" onClick={zoomOut}>-</button>
      <canvas id="function-visualizer" ref={canvasRef} ></canvas>
      <section id="controls">
        {Object.entries(listFunctions).map(([id, value]) => (
          <InputCard
            key={id}
            idFunction={Number(id)} // Object keys become strings in entries, convert back to number
            useFunction={value}
            onSave={updateFunctionValue}
            onDelete={deleteFunctionValue}
          />
        ))}
        {/* <InputCard /> */}
        <button onClick={() => setListFunctions(prev => ({ ...prev, [Object.keys(prev).length]: 'Math.sin(x)' }))}>
          Add Function
        </button>
      </section>
    </div>
  )
}

export default App