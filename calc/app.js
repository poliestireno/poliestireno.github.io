const display = document.getElementById("display");
const decimalButton = document.getElementById("decimal-btn");

let current = "";       
let memoryValue = null;
let enJuego = false;
let esperandoSiguiente = false;
let bloqueado = false;


/* ---------- AJUSTAR ALTURA REAL PWA ---------- */
function setAppHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}
setAppHeight();
window.addEventListener('resize', setAppHeight);

/* ---------- UTIL ---------- */
function formatWithDots(value) {
  if (value === "" || value === null) return value;

  value = value.toString();

  // Separamos parte entera y decimal
  let [entera, decimal] = value.split(".");

  // Añadimos puntos SOLO a la parte entera
  entera = entera.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Si hay decimal, lo devolvemos tal cual
  return decimal !== undefined ? `${entera}.${decimal}` : entera;
}


function updateDisplay(text) {
  display.innerText = formatWithDots(text);
}

/* ---------- BOTONES ---------- */
function press(value) {

  // 🚫 Si está bloqueado, no hacemos absolutamente nada
  if (bloqueado) return;

  // 🎯 Si estamos esperando el botón tras el "+"
  if (esperandoSiguiente) {
    var currentAux = current.replace(/x/g, "*").slice(0, -1);
    
    var num  = eval(getDateNumber())-eval(currentAux);
    if (memoryValue!=null)
    {
      num  = eval(memoryValue)-eval(currentAux);
    }
    current += num;
    updateDisplay(current);

    esperandoSiguiente = false;
    bloqueado = true;

    // ⏱️ Bloqueamos todo durante 10 segundos
    setTimeout(() => {
      bloqueado = false;
    }, 10000);

    return;
  }

  if (value === 'C') {  // AC
    current = "";
    updateDisplay("0");
    return;
  }

  if (value === '+') {  // +
    if (enJuego)
    {
      current += value;
      updateDisplay(current);
      esperandoSiguiente = true; // activamos el modo especial
      return;
    }
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
    if (!current) return;
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
    current = current.replace(/x/g, "*");
    let result = eval(current);

    // 🔢 Si tiene decimales, limitar a 9
    if (!Number.isInteger(result)) {
      result = Number(result.toFixed(9)).toString();
    } else {
      result = result.toString();
    }

    current = result;
    updateDisplay(current);

  } catch {
    updateDisplay("Error");
    current = "";
  }
}


/* ---------- % PULSACIÓN CORTA ---------- */
function percentPress() {
 /* if (memoryValue !== null) {
    updateDisplay(memoryValue);
  } else {
    updateDisplay(getDateNumber());
  }*/
}

/* ---------- % PULSACIÓN LARGA % ---------- */
function percentLongPress() {
  const val = prompt("Introduce un número:");

  if (val === null || val.trim() === "") {
    memoryValue = null;
    return;
  }

  if (!isNaN(val)) {
    memoryValue = val.trim();
  }
}
/* ---------- % PULSACIÓN LARGA AC ---------- */
function ACLongPress() {
    if (!enJuego)
    {
      enJuego=true;
      decimalButton.innerText = ",";
    }
    else
    {
      enJuego=false;
      decimalButton.innerText = ".";
     
    }
    
  
}

/* ---------- FECHA DDMMYYHHmm ---------- */
function getDateNumber() {
  const now = new Date();

  const dd = now.getDate();                 // 1..31
  const mm = now.getMonth() + 1;            // 1..12
  const yy = now.getFullYear() % 100;       // últimos 2 dígitos
  const hh = now.getHours();                // 0..23
  const mi = (now.getMinutes()+1)%60;              // 0..59

  return `${dd}${mm}${yy}${hh}${mi}`;
}

