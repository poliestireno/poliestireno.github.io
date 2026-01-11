const display = document.getElementById("display");
let current = ""; // Aquí guardamos toda la operación como string

function press(value) {
  if (value === 'C') {
    current = "";
    updateDisplay("0");
    return;
  }

  if (value === 'DEL') {
    current = current.slice(0, -1);
    updateDisplay(current || "0");
    return;
  }

  if (value === '%') {
    showDateTime();
    return;
  }

  if (value === '=') {
    calculate();
    return;
  }

  if (value === '^') {
    current += "**";
    updateDisplay(current.replace(/\*\*/g,'^'));
    return;
  }

  // Añadir número, punto o operador
  current += value;
  updateDisplay(current.replace(/\*\*/g,'^')); // mostrar ^ en lugar de **
}

function calculate() {
  if (current === "") return;

  try {
    // Evalúa la expresión completa
    let evalStr = current;
    evalStr = evalStr.replace(/\^/g, "**"); // Si quedó algún ^, lo convierte
    let result = eval(evalStr);
    current = result.toString();
    updateDisplay(current);
  } catch {
    updateDisplay("Error");
    current = "";
  }
}

function updateDisplay(text) {
  display.innerText = text;
}

// Fecha/hora como número con puntos
function showDateTime() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  const h = String(now.getHours()).padStart(2,'0');
  const min = String(now.getMinutes()).padStart(2,'0');

  let numStr = `${y}${m}${d}${h}${min}`;
  let formatted = '';
  let count = 0;
  for (let i = numStr.length - 1; i >= 0; i--) {
    formatted = numStr[i] + formatted;
    count++;
    if (count % 3 === 0 && i !== 0) {
      formatted = '.' + formatted;
    }
  }

  updateDisplay(formatted);
  current = "";
}
