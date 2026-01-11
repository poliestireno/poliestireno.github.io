const display = document.getElementById("display");

let current = "";       
let memoryValue = null;

/* ---------- AJUSTAR ALTURA REAL PWA ---------- */
function setAppHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}
setAppHeight();
window.addEventListener('resize', setAppHeight);

/* ---------- UTIL ---------- */
function formatWithDots(value) {
  // Solo formatear números puros
  if (!value || isNaN(Number(value.replace(/\./g, '')))) return value;
  return value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateDisplay(text) {
  display.innerText = formatWithDots(text);
}

/* ---------- BOTONES ---------- */
function press(value) {
  if (value === 'C') {  // AC
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
    // para mostrar exponente como ^ pero almacenar **
    current += "**";
    updateDisplay(current.replace(/\*\*/g, '^'));
    return;
  }

  if (value === '±') {
    if (!current) return;
    // Intentar cambiar signo del último número
    const match = current.match(/([+-]?\d+\.?\d*)$/);
    if (match) {
      const num = match[0];
      const neg = num.startsWith('-') ? num.slice(1) : '-' + num;
      current = current.slice(0, -num.length) + neg;
      updateDisplay(current.replace(/\*\*/g, '^'));
    }
    return;
  }

  current += value;
  updateDisplay(current.replace(/\*\*/g, '^'));
}

/* ---------- CALCULAR ---------- */
function calculate() {
  if (!current) return;

  try {
    // eval para operaciones básicas
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
