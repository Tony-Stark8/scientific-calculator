// TypeScript for Scientific Calculator

type Operator = '+' | '-' | '*' | '/' | '%' | null;

// Retrieve the display element and define it as "display". If not found, null.
// Retrieve all buttons and define as a list nodes.
const display = document.getElementById('display') as HTMLElement | null;
const buttons = document.querySelectorAll('.btn') as NodeListOf<HTMLButtonElement>;

let currentInput: string = '0';
let operator: Operator = null;
let previousInput: string | null = null;

// Parameters: None
// This function checks if the display element is not Null.
// If not Null, the display is updated to display the current input.
function updateDisplay(): void {
    if (display) {
        display.textContent = currentInput;
    }
}

// Parameters: HTMLevent
// This function serves as an event handler for button clicks.
// The action/event type is determined by comparing the action variable to all possible action types.
// Appropriate functions are called based on action type.
function handleButtonClick(event: MouseEvent): void {
    const target = event.target as HTMLButtonElement;
    const action = target.dataset.action;
    const value = target.textContent;

    if (!action) {
        // Number button clicked.
        currentInput = currentInput === '0' ? value! : currentInput + value!;
    } else if (action === 'clear') {
        // Clear button clicked.
        currentInput = '0';
        operator = null;
        previousInput = null;
    } else if (action === 'delete') {
        // Delete button clicked.
        currentInput = currentInput.slice(0, -1) || '0';
    } else if (action === '.') {
        // Decimal button clicked
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    } else if (action === 'sqrt') {
        // Square root button clicked.
        currentInput = Math.sqrt(parseFloat(currentInput)).toString();
    } else if (action === '=') {
        // Equals button clicked.
        if (operator && previousInput !== null) {
            currentInput = calculate(parseFloat(previousInput), parseFloat(currentInput), operator).toString();
            operator = null;
            previousInput = null;
        }
    } else {
        // Operator button clicked (+, -, *, /, %).
        if (operator && previousInput !== null) {
            currentInput = calculate(parseFloat(previousInput), parseFloat(currentInput), operator).toString();
        }
        operator = action as Operator;
        previousInput = currentInput;
        currentInput = '0';
    }

    // Finally, update the display.
    updateDisplay();
}

// Parameters: a, b : number; operator: Operator.
// This function applies the parsed operator to the two input numbers.
function calculate(a: number, b: number, operator: Operator): number | string {
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

// Add event listeners to buttons.
buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

// Initialize the display.
updateDisplay();
