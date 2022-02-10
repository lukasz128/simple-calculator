const output = document.querySelector('.calculator__output');
const form = document.querySelector('.calculator__form');
let values = [];
let signIndex;
let hasBeenCalculated = false;

const domEventRef = document.addEventListener('DOMContentLoaded', app);

function app() {
  const submitEventRef = form.addEventListener('submit', event => {
    event.preventDefault();
    const action = event.submitter.dataset.action;
    const value = event.submitter.dataset.value;
    const hasFieldAction = (action !== undefined && action !== 'calculate' && action !== 'clear');

    calculatorHandler({action, value, hasFieldAction});
  });

  const keyUpEventRef = window.addEventListener('keyup', ({key: value}) => {
    const action = /[+-]|[//]|[/*]|[/%]|Backspace/.test(value);
    const hasCorrectValue = /[+-]|[//]|[/*]|[/%]|[0-9.,]+/.test(value);
    const hasFieldAction = /[+-]|[//]|[/*]|[/%]{1}/.test(value);

    calculatorHandler({action, value, hasFieldAction, hasCorrectValue})
  })

  document.removeEventListener('submit', submitEventRef);
  document.removeEventListener('keyup', keyUpEventRef);
}

const calculatorHandler = ({action, value, hasFieldAction, hasCorrectValue = true}) => {
  const hasntDuplicateAction = ((!signIndex && hasFieldAction) || !action);

  if(action === 'calculate' || value === 'Enter') {
    calculate();
    return;
  }

  resetValues(hasFieldAction);
  (action === 'clear' || value === 'Backspace') && clearField();

  if(hasCorrectValue) {
    hasntDuplicateAction ? values.push({value, isAction: hasFieldAction}) : changeAction(value);
    setSignIndex(hasFieldAction);
    signIndex ? setOutput(values.slice(signIndex)) : setOutput(values);  
  }
  console.log(values);
}

const calculate = () => {
  try {
    const action = values.find( ({isAction}) => isAction)?.value;
    const [firstNumber, secondNumber] = getComponenets();
    let answer;
    
    switch(action) {
      case '+': answer = firstNumber + secondNumber; break;
      case '-': answer = firstNumber - secondNumber; break;
      case '*': answer = firstNumber * secondNumber; break;
      case '/': {
        if(secondNumber == 0) throw Error('cant devide by zero');
        answer = firstNumber / secondNumber;
      } break;
      case '%': answer = firstNumber % secondNumber; break;
      default: answer = firstNumber;
    }
    setOutput(answer.toFixed(2));
    hasBeenCalculated = true;
    resetVariables();
    [... answer.toString()].forEach(value => values.push({value, isAction: false}));
  } catch(errorMessage) {
    console.error(errorMessage);
    setOutput('Error');
    resetVariables();
  }
};

const setOutput = values =>
  output.textContent = Array.isArray(values) ? values.filter( ({isAction}) => !isAction).map( ({value}) => value).join('') : values;

const getComponenets = () => {
  let index = 0; 

  return values.reduce( (components, {value, isAction})  => {
    isAction ? ++index : (components[index] += value);
    return components;
  }, ['', '']).map( component => component ? Number.parseFloat(component) : 0);
}

const resetVariables = () => {
  signIndex = null;
  values = [];
}

const setSignIndex = isExistSign => {
  isExistSign && (signIndex = values.length-1);
}

const clearField = () => {
  setOutput('');
  resetVariables();
}

const resetValues = actionField => {
  if(hasBeenCalculated && !actionField) 
    values = [];
  hasBeenCalculated = false;
}

const changeAction = newAction =>
  values[values.length-1] = {value: newAction, isAction: true};

document.removeEventListener('DOMContentLoaded', domEventRef);