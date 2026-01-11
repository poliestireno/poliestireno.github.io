const display = document.getElementById("display");
let current = "";
let previous = "";
let operator = null;

function press(value) {
  if (value === 'C') {
    current = "";
    previous = "";
    operator = null;
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
    current += "**"; // JS exponente
    updateDisplay(current.replace(/\*\*/g, '^'));
    return;
  }

  if (['+', '-', '*', '/'].includes(value)) {
    if (current === "" && previous === "") return;
    if (current !== "") {
      if (previous === "") {
        previous = current;
      } else if (operator) {
        previous = eval(previous + operator + current);
      }
      current = "";
    }
    operator = value;
    return;
  }

  current += value;
  updateDisplay(current);
}

function calculate() {
  if (operator && current !== "") {
    try {
      let expression = previous + operator + current;
      let result = eval(expression);
      current = result.toString();
      previous = "";
      operator = null;
      updateDisplay(current);
    } catch {
      updateDisplay("Error");
      current = "";
      previous = "";
      operator = null;
    }
  } else if (current.includes("**")) {
    try {
      let result = eval(current);
      current = result.toString();
      updateDisplay(current);
    } catch {
      updateDisplay("Error");
      current = "";
    }
  }
}

function updateDisplay(text) {
  display.innerText = text;
}

// Nueva versión de showDateTime con puntos cada 3 dígitos y sin segundos
function showDateTime() {
  const now = new Date();
  const y = now.getFullYear();              // 4 dígitos
  const m = String(now.getMonth() + 1).padStart(2,'0'); // 2 dígitos
  const d = String(now.getDate()).padStart(2,'0');      // 2 dígitos
  const h = String(now.getHours()).padStart(2,'0');     // 2 dígitos
  const min = String(now.getMinutes()).padStart(2,'0'); // 2 dígitos

  // Concatenamos todo como un número
  let numStr = `${y}${m}${d}${h}${min}`;

  // Insertar puntos cada 3 dígitos desde la izquierda
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
  previous = "";
  operator = null;
}
