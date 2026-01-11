const display = document.getElementById("display");
let current = "";
let operator = null;
let previous = null;

function press(value) {
  if (value === '%') {
    showDateTime();
    return;
  }

  if (value === '=') {
    calculate();
    return;
  }

  if (['+', '-', '*', '/'].includes(value)) {
    if (current === "" && previous === null) return;
    if (operator) calculate(); // cadena de operaciones
    operator = value;
    previous = current || previous;
    current = "";
    return;
  }

  current += value;
  updateDisplay(current);
}

function updateDisplay(text) {
  display.innerText = text;
}

function calculate() {
  if (!operator || previous === null) return;
  try {
    const result = eval(`${previous}${operator}${current}`);
    current = result.toString();
    operator = null;
    previous = null;
    updateDisplay(current);
  } catch {
    updateDisplay("Error");
    current = "";
    operator = null;
    previous = null;
  }
}

function showDateTime() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth()+1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  const h = String(now.getHours()).padStart(2,'0');
  const min = String(now.getMinutes()).padStart(2,'0');
  const sec = String(now.getSeconds()).padStart(2,'0');

  // ejemplo: 202611195 → formato exacto que quieras
  updateDisplay(`${y}${m}${d}${h}${min}${sec}`);
  current = "";
  operator = null;
  previous = null;
}
