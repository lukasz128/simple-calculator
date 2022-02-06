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
    
    if(action === 'calculate') {
      calculate();
      return;
    }

    resetValues(hasFieldAction);
    if((!signIndex && hasFieldAction) || !action) 
      values.push({value, isAction: hasFieldAction});
    else
      values[values.length-1] = {value, isAction: hasFieldAction};
    (action === 'clear') && clearField();
    console.log(values);
    setSignIndex(hasFieldAction);
    signIndex ? setOutput(values.slice(signIndex)) : setOutput(values);  
  });

  const keyUpEventRef = window.addEventListener('keyup', ({key, isTrusted}) => {
    const action = /[+-]|[//]|[/*]|[/%]|Backspace/.test(key);
    const value = /[+-]|[//]|[/*]|[/%]|[0-9.,]+/.test(key);
    const hasFieldAction = /[+-]|[//]|[/*]|[/%]{1}/.test(key);
    if(isTrusted) {
      if(key === 'Enter') {
        calculate();
        return;
      }

      resetValues(hasFieldAction);
      (key === 'Backspace') && clearField();
      if(value) {
        if((!signIndex && hasFieldAction) || !action)
          values.push({value: key, isAction: hasFieldAction});
        else 
          values[values.length-1] = {value: key, isAction: HashChangeEvent};
        setSignIndex(hasFieldAction);
        signIndex ? setOutput(values.slice(signIndex)) : setOutput(values);  
      }
      console.log(values, key);
    }
  })

  document.removeEventListener('submit', submitEventRef);
  document.removeEventListener('keyup', keyUpEventRef);
}

const calculate = () => {
  try {
    const action = values.find( ({isAction}) => isAction).value;
    const [firstNumber, secondNumber] = getComponenets();
    let answer;
    // TODO exception when is only one number without action
    switch(action) {
      case '+': answer = firstNumber + secondNumber; break;
      case '-': answer = firstNumber - secondNumber; break;
      case '*': answer = firstNumber * secondNumber; break;
      case '/': {
        if(secondNumber == 0) throw Error('cant devide by zero');
        answer = firstNumber / secondNumber;
      } break;
      case '%': answer = firstNumber % secondNumber; break;
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
  }, ['', '']).map( component => Number.parseFloat(component));
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


document.removeEventListener('DOMContentLoaded', domEventRef);