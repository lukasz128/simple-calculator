const output = document.querySelector('.calculator__output');
const form = document.querySelector('.calculator__form');
let values = [];

document.addEventListener('DOMContentLoaded', app);

function app() {
  
  form.addEventListener('submit', event =>  {
    event.preventDefault();
    const action = event.submitter.dataset.action;
    const value = event.submitter.dataset.value;
    const hasFieldValue = value !== undefined;
    const hasFieldAction = (action !== undefined && action !== 'calculate' && action !== 'clear');
    let signIndex;
    
    if(action === 'calculate') {
      calculate();
      return;
    }
    
    values.push({value, isAction: hasFieldAction});
    if(action === 'clear') {
      setOutput('');
      values = [];
    };

    console.log(values);

    if(hasFieldAction) {
      signIndex = values.length-1;
    }
    
    if(signIndex) {
      setOutput(values.slice(signIndex));
    } else {
      setOutput(values);
    }
  });

}

const clearInput = () => input.innerHTML = '';
const clearAllField = () => input.innerHTML = '';
const calculate = () => {
  const action = values.find( ({isAction}) => isAction).value;
  const [firstNumber, secondNumber] = getComponenets();

  switch(action) {
    case '+': setOutput(`${firstNumber + secondNumber}`); break;
    case '-': setOutput(`${firstNumber - secondNumber}`); break;
    case '*': setOutput(`${firstNumber * secondNumber}`); break;
    case '/': setOutput(`${firstNumber / secondNumber}`); break;
  }
};
const setOutput = values =>
  output.textContent = Array.isArray(values) ? values.filter( ({isAction}) => !isAction).map( ({value}) => value).join('') : values;

function buildOperations(operations) {
  [... operations].forEach(console.log);
}


const getComponenets = () => {
  let index = 0;

  return values.reduce( (components, {value, isAction})  => {
    isAction ? ++index : (components[index] += value);
    return components;
  }, ['', '']).map( component => Number.parseFloat(component));
}
