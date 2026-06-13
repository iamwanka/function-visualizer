import {useRef, useState} from 'react'
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
  };

  return (
    <div className="App">
      <canvas id="function-visualizer"></canvas>
      <section id="controls">
        <label htmlFor="function-input">Enter a function of x:</label>
        <input type="text" id="function-input" placeholder="e.g. sin(x) + cos(2x)" />
        <button id="plot-button">Plot Function</button>
      </section>
    </div>
  )
}

export default App