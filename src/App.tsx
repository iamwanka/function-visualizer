import {useRef, useState, useEffect} from 'react'
import './App.css'
import InputCard from './assets/components/InputCard';

// Math evaluation - using Function constructor for simplicity, but consider using a library like math.js for more complex expressions and security
const evaluateFunction = (expr: string, x: number, variables: Record<string, number>) =>{
  const fn = new Function('x', ...Object.keys(variables), `return ${expr}`);
  return fn(x, ...Object.values(variables));
};

function App() {
  // Is the same effect as getContext('2d') but with type safety
  // How to change the type of button
  // Every new inputcard will have its own state 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exp, setExp] = useState<string>('a * Math.sin(x)');
  const [listFunctions, setListFunctions] = useState<Record<number, string>>({0: 'Math.sin(x) + Math.cos(x)', 1: 'Math.cos(x)'});
  const [a, setA] = useState<number>(1);
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
    const xMin = -5, xMax = 5;
    const yMin = -5, yMax = 5;

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    
    
    ctx.clearRect(0, 0, width, height);
    // Draw lines
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), 0); ctx.lineTo(toCanvasX(0), height);// <Y-axis>
    ctx.moveTo(0, toCanvasY(0)); ctx.lineTo(width, toCanvasY(0));// <X-axis>
    ctx.stroke();

    // ctx.restore();

    // Plot function
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= width; px++) {
      const x = xMin + (px / width) * (xMax - xMin);
      let y;
      try {
        y = evaluateFunction(exp, x, {a});
      }
      catch {
        first = true;
        continue;
      }
      if (!isFinite(y)) {first = true; continue;}
      const py = toCanvasY(y);
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  };

  //Handler to update  specific function in the list
  const updateFunctionValue = (id: number, newValue: string) => {
    setListFunctions(prev => ({
      ...prev,
      [id] : newValue // Updates only the modified key, keeping the rest intact
    }))
  }

  // Redraw whenever the expression or variable changes
  useEffect(() => {
    drawGraph();
  }, [exp, a]);

  return (
    <div className="App">
      <canvas id="function-visualizer" ref={canvasRef} ></canvas>
      <section id="controls">
        <label htmlFor="function-input">Enter a function of x:</label>
        <input value={exp} onChange={e => setExp(e.target.value)} type="text" id="function-input" placeholder="e.g. sin(x) + cos(2x)" />
        <label>a = </label>
        <input value={a} onChange={e => setA(parseFloat(e.target.value))} type="number" id="a-input" step="0.1" />
        <span>{a.toFixed(2)}</span>
          {Object.entries(listFunctions).map(([id, value]) => (
            <InputCard 
              key={id} 
              idFunction={Number(id)} // Object keys become strings in entries, convert back to number
              useFunction={value} 
              onSave={updateFunctionValue}
            />
          ))}
          {/* <InputCard /> */}
      </section>
    </div>
  )
}

export default App