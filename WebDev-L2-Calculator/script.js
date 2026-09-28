const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operation]");
const clearButton = document.querySelector("[data-action='clear']");
const deleteButton = document.querySelector("[data-action='delete']");
const equalsButton = document.querySelector("[data-action='equals']");

let currentValue = "";
let previousValue = "";
let operation = null;

function updateDisplay() {
    currentDisplay.textContent = currentValue || "0";

    if (operation && previousValue) {
        previousDisplay.textContent = `${previousValue} ${getOperationSymbol(operation)}`;
    } else {
        previousDisplay.textContent = "";
    }
}

function getOperationSymbol(operator) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator] || operator;
}

function appendNumber(number) {
    if (number === "." && currentValue.includes(".")) {
        return;
    }

    if (number === "." && currentValue === "") {
        currentValue = "0";
    }

    currentValue += number;
    updateDisplay();
}

function chooseOperation(selectedOperation) {
    if (currentValue === "" && previousValue === "") {
        return;
    }

    if (currentValue !== "" && previousValue !== "" && operation) {
        calculate();
    }

    if (currentValue !== "") {
        previousValue = currentValue;
        currentValue = "";
    }

    operation = selectedOperation;
    updateDisplay();
}

function calculate() {
    if (!operation || previousValue === "" || currentValue === "") {
        return;
    }

    const firstNumber = Number(previousValue);
    const secondNumber = Number(currentValue);
    let result;

    switch (operation) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentValue = "Error";
                previousValue = "";
                operation = null;
                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    result = Number(result.toFixed(10));

    currentValue = String(result);
    previousValue = "";
    operation = null;

    updateDisplay();
}

function clearCalculator() {
    currentValue = "";
    previousValue = "";
    operation = null;

    updateDisplay();
}

function deleteNumber() {
    currentValue = currentValue.slice(0, -1);

    updateDisplay();
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperation(button.dataset.operation);
    });
});

equalsButton.addEventListener("click", calculate);

clearButton.addEventListener("click", clearCalculator);

deleteButton.addEventListener("click", deleteNumber);

updateDisplay();