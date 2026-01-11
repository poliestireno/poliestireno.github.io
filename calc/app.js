const display = document.getElementById("display");
let current = "";   // Valor que se está escribiendo
let previous = "";  // Valor previo (para operaciones)
let operator = null; // Operador actual

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

  // Si es operador + - * /
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

  // Añadir número o punto
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

function showDateTime() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth()+1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  const h = String(now.getHours()).padStart(2,'0');
  const min = String(now.getMinutes()).padStart(2,'0');
  const sec = String(now.getSeconds()).padStart(2,'0');

  updateDisplay(`${y}${m}${d}${h}${min}${sec}`);
  current = "";
  previous = "";
  operator = null;
}
