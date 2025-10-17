import Calculator from './calculator.js';

export function initUI() {
  const display = document.getElementById('display');
  const keys = document.querySelector('.calculator__keys');
  const colorToggle = document.getElementById('color-toggle');
  const colorMenu = document.getElementById('color-menu');

  // color inputs
  const textColorPicker = document.getElementById('text-color');
  const operatorColorPicker = document.getElementById('operator-color');
  const functionColorPicker = document.getElementById('function-color');
  const mainColorPicker = document.getElementById('main-color'); // NEW
  const bgColorPicker = document.getElementById('bg-color');

  const calc = new Calculator(display);

  const applyBtn = document.getElementById('apply-colors');

  applyBtn.addEventListener('click', () => {
    // Просто скрываем меню после подтверждения
    colorMenu.classList.remove('show');
  });


  // === Calculator button handling ===
  keys.addEventListener('click', (e) => {
    const key = e.target;
    if (!key.classList.contains('calculator__key')) return;

    const action = key.dataset.action;
    const num = key.dataset.num;
    const op = key.dataset.op;

    if (num !== undefined) calc.appendNumber(num);
    if (op !== undefined) calc.chooseOperator(op);
    if (action === 'clear') calc.reset();
    if (action === 'sign') calc.sign();
    if (action === 'percent') calc.percent();
    if (action === 'equals') calc.compute();
  });

  // === Menu open/position ===
  colorToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = colorToggle.getBoundingClientRect();
    colorMenu.style.position = 'absolute';
    colorMenu.style.top = `${rect.bottom + window.scrollY + 8}px`;
    colorMenu.style.left = `${rect.left + window.scrollX}px`;
    colorMenu.classList.toggle('show');
    colorMenu.setAttribute('aria-hidden', colorMenu.classList.contains('show') ? 'false' : 'true');
  });

  document.addEventListener('click', (e) => {
    if (!colorMenu.contains(e.target) && e.target !== colorToggle) {
      colorMenu.classList.remove('show');
      colorMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // === 1) Text color ===
  textColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    // apply color to display and all keys text
    document.querySelectorAll('.calculator__display, .calculator__key, .calculator__header, .calculator').forEach((el) => {
      el.style.color = color;
    });
  });

  // === 2) Operator buttons color ===
  operatorColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    document.querySelectorAll('.calculator__key--operator').forEach((btn) => {
      btn.style.backgroundColor = color;
    });
  });

  // === 3) Function buttons color (AC, ±, %) ===
  functionColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    document.querySelectorAll('.calculator__key--function').forEach((btn) => {
      btn.style.backgroundColor = color;
    });
  });

  // === 4) MAIN buttons color (1-9,0,.) - NEW ===
  mainColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    // select keys that are NOT operator and NOT function
    document.querySelectorAll('.calculator__key').forEach((btn) => {
      if (!btn.classList.contains('calculator__key--operator') && !btn.classList.contains('calculator__key--function')) {
        btn.style.backgroundColor = color;
      }
    });
  });

  // === 5) Background color (calculator, header, display) ===
  bgColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    document.querySelectorAll('.calculator, .calculator__header, .calculator__display').forEach((el) => {
      el.style.backgroundColor = color;
    });
  });

  // === Keyboard support ===
  document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!isNaN(key)) calc.appendNumber(key);
    if (key === '.') calc.appendNumber('.');
    if (['+', '-', '*', '/'].includes(key)) calc.chooseOperator(key);
    if (key === 'Enter' || key === '=') calc.compute();
    if (key === 'Escape') calc.reset();
    if (key === '%') calc.percent();
    if (key === 'Backspace') calc.backspace();
  });
}
