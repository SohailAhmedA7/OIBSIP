const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const convertButton = document.getElementById("convertBtn");
const result = document.getElementById("result");

convertButton.addEventListener("click", function () {

    const temperature = parseFloat(temperatureInput.value);
    const unit = unitSelect.value;

    // Check for empty or invalid input
    if (isNaN(temperature)) {
        result.textContent = "Please enter a valid temperature.";
        return;
    }

    // Check for temperatures below absolute zero
    if (unit === "celsius" && temperature < -273.15) {
        result.textContent = "Temperature cannot be below -273.15 °C.";
        return;
    }

    if (unit === "fahrenheit" && temperature < -459.67) {
        result.textContent = "Temperature cannot be below -459.67 °F.";
        return;
    }

    if (unit === "kelvin" && temperature < 0) {
        result.textContent = "Temperature cannot be below 0 K.";
        return;
    }

    let celsius;
    let fahrenheit;
    let kelvin;

    // Convert the input temperature to all three units
    if (unit === "celsius") {

        celsius = temperature;
        fahrenheit = (temperature * 9 / 5) + 32;
        kelvin = temperature + 273.15;

    } else if (unit === "fahrenheit") {

        fahrenheit = temperature;
        celsius = (temperature - 32) * 5 / 9;
        kelvin = celsius + 273.15;

    } else if (unit === "kelvin") {

        kelvin = temperature;
        celsius = temperature - 273.15;
        fahrenheit = (celsius * 9 / 5) + 32;
    }

    result.innerHTML = `
        Celsius: ${celsius.toFixed(2)} °C<br>
        Fahrenheit: ${fahrenheit.toFixed(2)} °F<br>
        Kelvin: ${kelvin.toFixed(2)} K
    `;
});