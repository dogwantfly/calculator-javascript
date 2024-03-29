const outputContent = document.querySelector('.output-content');
const inputContainer = document.querySelector('.input-container');
const resetBtn = document.querySelector('.reset');
const deleteBtn = document.querySelector('.del');
const operatorIcon = document.querySelector('.operator-icon');
const enterBtn = document.querySelector('.enter');
const operators = document.querySelectorAll('.operator');
const messageContent = document.querySelector('.message-content');

const initialValue = 0;
let outputStr = '';
let operatorBtn = '';
let calculateArr = [];
let calculateResult = '';
const outputMaxLength = 10;

outputContent.textContent = initialValue;

function handleClickNumber(e) {
  const numberRegex = /^[0-9]$/;
  if (numberRegex.test(+e.target.textContent)) {
    if (outputStr == initialValue) {
      outputStr = e.target.textContent;
    } else if (outputStr.toString().length < outputMaxLength) {
      outputStr += e.target.textContent;
    }

    outputContent.textContent = outputStr;
  }
}

function handleClickOperator(e) {
  const operatorRegex = /^[+\-*/]$/;

  if (operatorRegex.test(e.target.textContent)) {
    if (!operatorBtn) {
      operatorBtn = e.target.textContent;
      [...operators].forEach((item) => {
        if (item.textContent !== operatorBtn) {
          item.classList.add('disabled');
        }
      });
    }

    if (operatorBtn && e.target.textContent !== operatorBtn) return;

    calculateArr.push(Number(outputStr));
    outputStr = initialValue;
    outputContent.textContent = outputStr;
    operatorIcon.textContent = operatorBtn;
  }
}

inputContainer.addEventListener('click', (e) => {
  handleClickNumber(e);
  handleClickOperator(e);
});

function resetOperaterBtn() {
  operatorBtn = '';
  operatorIcon.textContent = operatorBtn;
  [...operators].forEach((item) => {
    item.classList.remove('disabled');
  });
}

function handleClickReset() {
  outputStr = initialValue;
  outputContent.textContent = outputStr;
  messageContent.textContent = '';
  calculateArr = [];
  calculateResult = 0;
  resetOperaterBtn();
}

resetBtn.addEventListener('click', handleClickReset);

function handleDelete() {
  const numberRegex = /^[0-9]$/;

  const delOutput = outputStr
    .toString()
    .slice(0, outputStr.toString().length - 1);

  outputStr = numberRegex.test(delOutput[delOutput.length - 1])
    ? delOutput
    : delOutput.slice(0, delOutput.length - 1);

  if (outputStr.length) {
    outputContent.textContent = outputStr;
  } else {
    outputContent.textContent = initialValue;
  }
  messageContent.textContent = '';
}

deleteBtn.addEventListener('click', handleDelete);

function handleCalculate(arr) {
  return eval(arr.join(operatorBtn)).toFixed(10);
}

function formatResult(number) {
  let numStr = number.toString();

  let parts = numStr.split('.');
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? parts[1] : '';

  let sign = '';
  if (integerPart.startsWith('-')) {
    sign = '-';
    integerPart = integerPart.substring(1);
  }

  let nonDotLength = integerPart.length + decimalPart.length;

  if (nonDotLength <= outputMaxLength) {
    return number;
  } else {
    let remainDigits = outputMaxLength - integerPart.length;

    if (
      integerPart.length >= outputMaxLength ||
      decimalPart.substring(0, remainDigits) == 0
    ) {
      if (integerPart.length > outputMaxLength) {
        messageContent.textContent = '錯誤：數值已超過 10 位數';
      }

      return Number(sign + integerPart.substring(0, outputMaxLength));
    }

    return Number(
      sign + integerPart + '.' + decimalPart.substring(0, remainDigits)
    )
      .toFixed(remainDigits)
      .replace(/(\.\d*?[1-9])0+$/, '$1')
      .replace(/\.$/, '');
  }
}

function handleClickEnter() {
  if (!calculateArr.length || !operatorBtn) return;

  if (outputStr) {
    calculateArr.push(Number(outputStr));
    outputStr = 0;
  }

  if (operatorBtn === '/' && calculateArr.includes(0)) {
    messageContent.textContent = '錯誤：除數不能為 0，請點擊 Reset 重新計算';
    resetOperaterBtn();
    return;
  }

  calculateResult = handleCalculate(calculateArr);
  outputStr = formatResult(calculateResult).toString();

  outputContent.textContent = outputStr;

  resetOperaterBtn();
  calculateArr = [];
}

enterBtn.addEventListener('click', handleClickEnter);
