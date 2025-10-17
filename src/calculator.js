export default class Calculator {
  constructor(displayElement) {
    this.displayElement = displayElement;
    this.MAX_DIGITS = 12;
    this.reset();
  }

  reset() {
    this.current = '0';
    this.previous = '';
    this.operator = undefined;
    this.lastOperation = null;
    this.lastOperand = null;
    this.isError = false;
    this.updateDisplay();
  }

  countDigits(str) {
    const match = String(str).match(/\d/g);
    return match ? match.length : 0;
  }

  appendNumber(char) {
    if (this.isError) return;

    if (char === '.') {
      if (this.current.includes('.')) return;
      this.current += '.';
      this.updateDisplay();
      return;
    }

    if (!/^[0-9]$/.test(char)) return;

    const digitsNow = this.countDigits(this.current);
    if (digitsNow >= this.MAX_DIGITS) return;

    if (this.current === '0') {
      this.current = char;
    } else {
      this.current += char;
    }

    this.updateDisplay();
  }

  chooseOperator(op) {
    if (this.isError) return;
    if (this.operator && this.previous !== '' && this.current !== '') {
      this.compute();
    }
    this.operator = op;
    this.previous = this.current;
    this.current = '';
  }

  sign() {
    if (this.isError) return;
    if (!this.current || this.current === '0') return;
    if (this.current.startsWith('-')) {
      this.current = this.current.slice(1);
    } else {
      this.current = '-' + this.current;
    }
    this.updateDisplay();
  }

  percent() {
    if (this.isError) return;
    const v = parseFloat(this.current);
    if (isNaN(v)) return;
    this.current = (v / 100).toString();
    this.updateDisplay();
  }

  compute() {
    if (this.isError) return;

    let a, b, op;

    if (!this.operator && this.lastOperation && this.lastOperand !== null) {
      a = parseFloat(this.current);
      b = parseFloat(this.lastOperand);
      op = this.lastOperation;
    } else {
      a = parseFloat(this.previous);
      b = parseFloat(this.current);
      op = this.operator;
      if (op && !isNaN(b)) {
        this.lastOperation = op;
        this.lastOperand = b;
      }
    }

    if (isNaN(a) || isNaN(b) || !op) return;

    let result;
    switch (op) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '*':
        result = a * b;
        break;
      case '/':
        if (b === 0) {
          this.current = 'Error';
          this.isError = true;
          this.updateDisplay();
          return;
        }
        result = a / b;
        break;
      default:
        return;
    }

    if (typeof result === 'number' && isFinite(result)) {
      const rounded = Number(result.toFixed(10));
      const roundedStr = rounded.toString();
      const digitsCount = this.countDigits(roundedStr.replace('-', ''));
      if (digitsCount > this.MAX_DIGITS) {
        this.current = rounded.toString();
        this.displayElement.textContent = rounded.toExponential(6);
      } else {
        this.current = rounded.toString();
      }
    } else {
      this.current = String(result);
    }

    this.operator = undefined;
    this.previous = '';
    this.updateDisplay();
  }

  backspace() {
    if (this.isError) return;
    if (!this.current || this.current === '0') {
      this.current = '0';
    } else {
      this.current = this.current.slice(0, -1) || '0';
    }
    this.updateDisplay();
  }

  updateDisplay() {
    let displayValue = this.current.toString();

    displayValue = displayValue.replace('.', ',');

    const digitsOnly = displayValue.replace(/[^0-9]/g, '');
    if (digitsOnly.length > this.MAX_DIGITS) {
      try {
        const num = parseFloat(this.current);
        if (isFinite(num)) {
          displayValue = num.toExponential(6).replace('.', ',');
        }
      } catch {
        // ignore
      }
    }

    this.displayElement.textContent = displayValue;

    const maxVisibleChars = 9;
    const len = displayValue.length;
    let scale = 1;
    if (len > maxVisibleChars) {
      scale = Math.max(0.7, maxVisibleChars / len);
    }
    this.displayElement.style.transform = `scale(${scale})`;
    this.displayElement.style.transformOrigin = 'right center';
  }
}
