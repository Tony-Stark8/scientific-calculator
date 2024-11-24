// TypeScript for Scientific Calculator
var display = document.getElementById('display');
var buttons = document.querySelectorAll('.btn');
var currentInput = '0';
var operator = null;
var previousInput = null;
// Function to update the display
function updateDisplay() {
    if (display) { // Ensure display is not null before updating textContent
        display.textContent = currentInput;
    }
}
// Function to handle button clicks
function handleButtonClick(event) {
    var target = event.target;
    var action = target.dataset.action;
    var value = target.textContent;
    if (!action) {
        // Number button clicked
        currentInput = currentInput === '0' ? value : currentInput + value;
    }
    else if (action === 'clear') {
        // Clear button clicked
        currentInput = '0';
        operator = null;
        previousInput = null;
    }
    else if (action === 'delete') {
        // Delete button clicked
        currentInput = currentInput.slice(0, -1) || '0';
    }
    else if (action === '.') {
        // Decimal button clicked
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    }
    else if (action === 'sqrt') {
        // Square root button clicked
        currentInput = Math.sqrt(parseFloat(currentInput)).toString();
    }
    else if (action === '=') {
        // Equals button clicked
        if (operator && previousInput !== null) {
            currentInput = calculate(parseFloat(previousInput), parseFloat(currentInput), operator).toString();
            operator = null;
            previousInput = null;
        }
    }
    else {
        // Operator button clicked (+, -, *, /, %)
        if (operator && previousInput !== null) {
            currentInput = calculate(parseFloat(previousInput), parseFloat(currentInput), operator).toString();
        }
        operator = action;
        previousInput = currentInput;
        currentInput = '0';
    }
    updateDisplay();
}
// Function to perform calculations
function calculate(a, b, operator) {
    switch (operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return b !== 0 ? a / b : 'Error';
        case '%':
            return a % b;
        default:
            return b;
    }
}
// Add event listeners to buttons
buttons.forEach(function (button) {
    button.addEventListener('click', handleButtonClick);
});
// Initialize the display
updateDisplay();
