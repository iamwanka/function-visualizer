// Get references to the HTML elements
const canvas = document.getElementById('functionCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const functionInput = document.getElementById('functionInput');
const drawButton = document.getElementById('drawButton');

// Que función voy a graficar?
const xMin = -5, xMax = 5;

function toCanvasX(xMath) {
    return ((xMath - xMin) / (xMax - xMin)) * width;
}

function toCanvasY(yMath) {
    const yMin = -5, yMax = 5;
    return height - ((yMath - yMin) / (yMax - yMin)) * height;
}

function drawGraph() {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), 0); // Start at x = 0
    ctx.lineTo(toCanvasX(0), height);
    ctx.moveTo(0, toCanvasY(0));
    ctx.lineTo(width, toCanvasY(0));
    ctx.stroke();

    const expression = functionInput.value;
    let fn;
    try {
        fn = new Function('x', 'return ' + expression);
    }
    catch (e) {
        console.error('Invalid function expression');
        return;
    }

    ctx.beginPath();
    let firstPoint = true;
    for (let canvasX = 0; canvasX <= width; canvasX++) {
        const xMath = xMin + (canvasX / width) * (xMax - xMin);
        let yMath;
        try {
            yMath = fn(xMath);
        }
        catch (e) {
            firstPoint = true;
            continue;
        }

        if (isFinite(yMath)) {
            const canvasY = toCanvasY(yMath);
            if (firstPoint) {
                ctx.moveTo(canvasX, canvasY);
                firstPoint = false;
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        } else {
            firstPoint = true;
        }
    }

    ctx.stroke();

}

// Adding interactivity
drawButton.addEventListener('click', drawGraph);
drawGraph(); // Draw the initial graph on page load

// Que es lo que falta?
// - Mejorar la UI