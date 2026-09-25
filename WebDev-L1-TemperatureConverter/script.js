const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const convertButton = document.getElementById("convertBtn");
const result = document.getElementById("result");
const error = document.getElementById("error");

convertButton.addEventListener("click", function () {

    const temperature = parseFloat(temperatureInput.value);
    const unit = unitSelect.value;

    error.textContent = "";

    // Check if input is empty or invalid
    if (isNaN(temperature)) {
        error.textContent = "Please enter a valid temperature.";
        result.textContent = "Your converted temperature will appear here.";
        return;
    }

    // Absolute zero validation
    if (unit === "celsius" && temperature < -273.15) {
        error.textContent = "Temperature cannot be below absolute zero.";
        return;
    }

    if (unit === "fahrenheit" && temperature < -459.67) {
        error.textContent = "Temperature cannot be below absolute zero.";
        return;
    }

    if (unit === "kelvin" && temperature < 0) {
        error.textContent = "Kelvin temperature cannot be below 0 K.";
        return;
    }

    let celsius;
    let fahrenheit;
    let kelvin;

    // Convert to Celsius first
    if (unit === "celsius") {
        celsius = temperature;
    } else if (unit === "fahrenheit") {
        celsius = (temperature - 32) * 5 / 9;
    } else if (unit === "kelvin") {
        celsius = temperature - 273.15;
    }

    // Convert Celsius to other units
    fahrenheit = (celsius * 9 / 5) + 32;
    kelvin = celsius + 273.15;

    result.innerHTML = `
        Celsius: ${celsius.toFixed(2)} °C<br>
        Fahrenheit: ${fahrenheit.toFixed(2)} °F<br>
        Kelvin: ${kelvin.toFixed(2)} K
    `;
});