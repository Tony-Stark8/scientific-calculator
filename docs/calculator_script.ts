type Operator = '+' | '-' | '*' | '/' | '%' | '^' | null;

type FunctionOperator = 'sin' | 'cos' | 'tan' | 'sqrt' | 'exp' | 'log' | 'pi' | 'frac' | 'x10' | 'x_sqrt_y';

const display = document.getElementById('display') as HTMLElement | null;
const buttons = document.querySelectorAll('.btn') as NodeListOf<HTMLButtonElement>;

let currentInput: string = '0';
let operator: Operator = null;
let previousInput: string | null = null;
let isX10 = false;  // To track if x10 was pressed
let isXRootY = false; // To track if xth root of y was pressed

// Function to update the display
function updateDisplay(): void {
    if (display) {
        display.textContent = currentInput;
    }
}

// Function to handle button clicks
function handleButtonClick(event: MouseEvent): void {
    const target = event.target as HTMLButtonElement;
    const action = target.dataset.action;
    const value = target.textContent || '';

    if (!action) {
        // Number button clicked
        currentInput = currentInput === '0' ? value : currentInput + value;
    } else if (action === 'clear') {
        // Clear button clicked
        currentInput = '0';
        operator = null;
        previousInput = null;
        isX10 = false;  // Reset
        isXRootY = false; // Reset
    } else if (action === 'delete') {
        // Delete button clicked
        currentInput = currentInput.slice(0, -1) || '0';
    } else if (action === '.') {
        // Decimal button clicked
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    } else if (['sin', 'cos', 'tan', 'sqrt', 'exp', 'log', 'pi', 'frac'].some(func => func === action)) {
        // Trigonometric and special functions
        if (action === 'pi') {
            // If π is entered after another π or a number, add multiplication
            if (currentInput !== '0' && !isNaN(Number(currentInput.slice(-1))) || currentInput.slice(-1) === 'π') {
                currentInput += ' * π'; // Add multiplication symbol before π
            } else {
                currentInput = currentInput === '0' ? 'π' : currentInput + 'π';
            }
        } else {
            try {
                currentInput = applyFunction(action as FunctionOperator, currentInput).toString();
            } catch {
                currentInput = 'Error';
            }
        }
    } else if (action === '(') {
        // Open parenthesis
        if (currentInput !== '0' && !isNaN(Number(currentInput.slice(-1)))) {
            currentInput += ' * (';
        } else {
            currentInput = currentInput === '0' ? '(' : currentInput + '(';
        }
    } else if (action === ')') {
        // Close parenthesis
        if (currentInput !== '0') {
            currentInput += ')';
        }
    } else if (action === '=') {
        // Equals button clicked
        try {
            currentInput = evaluateExpression(currentInput).toString();
        } catch {
            currentInput = 'Error';
        }
        operator = null;
        previousInput = null;
    } else if (action === '^') {
        // Exponentiation button clicked
        currentInput += '^';
    } else if (action === 'x10') {
        // x10 button clicked
        currentInput = currentInput + 'e'; // Add 'e' for scientific notation
        isX10 = true;
    } else if (action === 'x_sqrt_y') {
        // xth root button clicked
        currentInput += ' root(';  // Append 'root(' to signify xth root
        isXRootY = true; // Set flag to track the root operation
    } else {
        // Operator button clicked (+, -, *, /, %, ^)
        currentInput += ` ${action} `;
    }

    updateDisplay();
}

// Function to perform calculations
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
        case '^':
            return Math.pow(a, b); // Exponentiation (power)
        default:
            return b;
    }
}

// Function to apply trigonometric or special functions
function applyFunction(func: FunctionOperator, input: string): number {
    // Replace π with Math.PI if it exists in the input
    const value = input.replace(/π/g, Math.PI.toString());

    const parsedValue = parseFloat(value);
    switch (func) {
        case 'sin':
            return Math.sin(parsedValue); // Expecting radians
        case 'cos':
            return Math.cos(parsedValue);
        case 'tan':
            return Math.tan(parsedValue);
        case 'sqrt':
            return Math.sqrt(parsedValue);
        case 'exp':
            return Math.exp(parsedValue);
        case 'log':
            return Math.log(parsedValue); // Natural logarithm
        case 'frac':
            return parsedValue % 1; // Fractional part
        case 'x10':
            return parsedValue * Math.pow(10, parsedValue); // 10^x
        case 'x_sqrt_y':
            // Handle xth root (y^(1/x))
            const numbers = input.split('root(');
            const y = parseFloat(numbers[0]); // The value of y
            const x = parseFloat(numbers[1].slice(0, -1)); // The value of x inside root()
            return Math.pow(y, 1 / x);  // Calculate y^(1/x)

            console.log(`x: ${x}, y: ${y}`);

        default:
            return parsedValue;
    }
}

// Helper function to tokenize an expression
function tokenizeExpression(expression: string): string[] {
    // Remove all spaces from the input to avoid issues
    expression = expression.replace(/\s+/g, '');

    // Updated regex to correctly handle negative numbers after operators like ^, x10, etc.
    const regex = /-?\d+(?:\.\d+)?|[()+\-*/%^πe]/g;
    const tokens = expression.match(regex) || [];

    return tokens;
}

// Function to evaluate expressions without eval
function evaluateExpression(expression: string): number {
    // Replace π with Math.PI before evaluating
    expression = expression.replace(/π/g, Math.PI.toString());

    const operators: { [key: string]: (a: number, b?: number) => number } = {
        '+': (a, b) => a + b!,
        '-': (a, b) => a - b!,
        '*': (a, b) => a * b!,
        '/': (a, b) => b !== 0 ? a / b! : NaN,
        '%': (a, b) => a % b!,
        '^': (a, b) => Math.pow(a, b!), // Exponentiation
        'e': (a, b) => a * Math.pow(10, b!), // Scientific notation handling
    };

    const outputStack: number[] = [];
    const operatorStack: string[] = [];

    // Tokenize the expression
    const tokens = tokenizeExpression(expression);

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (!isNaN(Number(token))) {
            // Push numbers to the output stack
            outputStack.push(Number(token));
        } else if (token in operators) {
            // Handle operators
            while (
                operatorStack.length > 0 &&
                precedence(operatorStack[operatorStack.length - 1]) >= precedence(token)
                ) {
                const op = operatorStack.pop()!;
                const b = outputStack.pop()!;
                const a = outputStack.pop()!;
                outputStack.push(operators[op](a, b));
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            // Resolve expressions inside parentheses
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                const op = operatorStack.pop()!;
                const b = outputStack.pop()!;
                const a = outputStack.pop()!;
                outputStack.push(operators[op](a, b));
            }
            operatorStack.pop(); // Remove '('
        }
    }

    // Resolve remaining operators
    while (operatorStack.length > 0) {
        const op = operatorStack.pop()!;
        const b = outputStack.pop()!;
        const a = outputStack.pop()!;
        outputStack.push(operators[op](a, b));
    }

    return outputStack[0];
}

// Helper function to determine operator precedence
function precedence(operator: string): number {
    switch (operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
        case '%':
            return 2;
        case '^':
            return 3; // Exponentiation has higher precedence
        default:
            return 0;
    }
}

// Add event listeners to buttons
buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

// Initialize the display
updateDisplay();
