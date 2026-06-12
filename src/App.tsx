import './App.css'

function App() {
  

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