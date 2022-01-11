const input = document.querySelector('.calculator__input');
const output = document.querySelector('.calculate__output');
const form = document.querySelector('.calculator__form');
let values = [];

document.addEventListener('DOMContentLoaded', app);

function app() {

  form.addEventListener('submit', event => {
    event.preventDefault();
    const action = event.submitter.dataset.action;
    const value = event.submitter.dataset.value;
    const hasFieldValue = value !== undefined;
    const hasFieldAction = (action !== undefined && action !== 'calculate' && action !== 'clear');

    (action === 'calculate') && calculate();
    (action === 'clear') && clearInput();

    if(hasFieldValue) {
      values.push({value, isAction: hasFieldAction});
      setInput(values.map(({value}) => value ).join(" "));
    } 
  });

}

const clearInput = () => input.innerHTML = '';
const clearAllField = () => input.innerHTML = '';
const calculate = () => {
  const action = values.find( ({isAction}) => isAction).value;
  const [firstNumber, secondNumber] = getComponenets();

  switch(action) {
    case '+': setOutput(`= ${firstNumber + secondNumber}`); break;
    case '-': setOutput(`${values.map(({value}) => value ).join(" ")} = ${firstNumber - secondNumber}`); break;
    case '*': setOutput(`${values.map(({value}) => value ).join(" ")} = ${firstNumber * secondNumber}`); break;
    case '/': setOutput(`${values.map(({value}) => value ).join(" ")} = ${firstNumber / secondNumber}`); break;
  }
};
const setInput = value => input.innerHTML = value;
const setOutput = value => output.innerHTML = value;
const resetInput = () => input.innerHTML = '';

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
