import {useRef, useState, useEffect} from 'react'
import './App.css'

// Math evaluation - using Function constructor for simplicity, but consider using a library like math.js for more complex expressions and security
const evaluateFunction = (expr: string, x: number, variables: Record<string, number>) =>{
  const fn = new Function('x', ...Object.keys(variables), `return ${expr}`);
  return fn(x, ...Object.values(variables));
};

function App() {
  // Is the same effect as getContext('2d') but with type safety
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exp, setExp] = useState<string>('a * Math.sin(x)');
  const [a, setA] = useState<number>(1);

  // Drawing function (same logic as Vanilla)
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      </section>
    </div>
  )
}

export default App