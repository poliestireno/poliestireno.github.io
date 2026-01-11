const display = document.getElementById("display");

let current = "";       
let memoryValue = null;

/* ---------- UTIL ---------- */
function formatWithDots(value) {
  return value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateDisplay(text) {
  display.innerText = formatWithDots(text);
}

/* ---------- BOTONES ---------- */
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

  if (value === '=') {
    calculate();
    return;
  }

  if (value === '^') {
    current += "**";
    updateDisplay(current.replace(/\*\*/g, '^'));
    return;
  }

  current += value;
  updateDisplay(current.replace(/\*\*/g, '^'));
}

/* ---------- CALCULAR ---------- */
function calculate() {
  if (!current) return;

  try {
    let result = eval(current);
    current = result.toString();
    updateDisplay(current);
  } catch {
    updateDisplay("Error");
    current = "";
  }
}

/* ---------- % PULSACIÓN CORTA ---------- */
function percentPress() {
  if (memoryValue !== null) {
    updateDisplay(memoryValue);
  } else {
    updateDisplay(getDateNumber());
  }
}

/* ---------- % PULSACIÓN LARGA ---------- */
function percentLongPress() {
  const val = prompt("Introduce un número:");

  // Si se pulsa cancelar o se deja vacío → borrar memoria
  if (val === null || val.trim() === "") {
    memoryValue = null;
    updateDisplay(getDateNumber());
    return;
  }

  if (!isNaN(val)) {
    memoryValue = val.trim();
    updateDisplay(memoryValue);
  }
}

/* ---------- FECHA DDMMYYHHmm ---------- */
function getDateNumber() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  return `${dd}${mm}${yy}${hh}${mi}`;
}
