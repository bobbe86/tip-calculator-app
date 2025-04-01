const inputField = document.getElementById("amount");

inputField.addEventListener("input", function () {
  let value = this.value;

  // Allow the user to type freely but ensure only numbers and a decimal point are entered
  if (!/^\d*\.?\d*$/.test(value)) {
    this.value = value.slice(0, -1); // Remove the last invalid character
  }
});

inputField.addEventListener("blur", function () {
  let value = parseFloat(this.value);

  // Format as currency when user leaves the input field
  if (!isNaN(value) && isFinite(value)) {
    this.value = value.toFixed(2);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const billInput = document.getElementById("amount");
  const peopleInput = document.getElementById("diners");
  const customTipInput = document.getElementById("custom-tip");
  const tipButtons = document.querySelectorAll(".tip-btn");
  const tipAmountDisplay = document.querySelector(
    ".summaryTable tr:nth-child(1) .gross"
  );
  const totalAmountDisplay = document.querySelector(
    ".summaryTable tr:nth-child(2) .gross"
  );
  const resetButton = document.getElementById("reset");

  tipButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      tipButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to the clicked button
      this.classList.add("active");

      // Clear the custom tip input when a preset button is selected
      customTipInput.value = "";
    });
  });
  customTipInput.addEventListener("input", function () {
    tipButtons.forEach((btn) => btn.classList.remove("active"));
  });

  let bill = 0,
    tipPercentage = 0,
    people = 1;

  function calculateTip() {
    if (bill > 0 && people > 0) {
      let tipAmount = (bill * tipPercentage) / 100;
      let totalAmount = bill + tipAmount;

      tipAmountDisplay.textContent = `$${(tipAmount / people).toFixed(2)}`;
      totalAmountDisplay.textContent = `$${(totalAmount / people).toFixed(2)}`;
    } else {
      tipAmountDisplay.textContent = `$0.00`;
      totalAmountDisplay.textContent = `$0.00`;
    }
  }

  billInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (value.length > 2) {
      value = value.replace(/^0+/, ""); // Remove leading zeros
      let dollars = value.slice(0, -2); // Extract dollar amount
      let cents = value.slice(-2); // Extract cents
      e.target.value = `${dollars}.${cents}`; // Format as currency
    } else {
      e.target.value = `0.${value.padStart(2, "0")}`; // Ensure at least 2 decimal places
    }

    bill = parseFloat(e.target.value) || 0;
    calculateTip();
  });

  peopleInput.addEventListener("input", (e) => {
    people = parseInt(e.target.value) || 1;
    calculateTip();
  });

  tipButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tipPercentage = parseFloat(button.dataset.tip);
      customTipInput.value = "";
      calculateTip();
    });
  });

  customTipInput.addEventListener("input", (e) => {
    tipPercentage = parseFloat(e.target.value) || 0;
    calculateTip();
  });

  resetButton.addEventListener("click", () => {
    billInput.value = "";
    peopleInput.value = "";
    customTipInput.value = "";
    tipAmountDisplay.textContent = "$0.00";
    totalAmountDisplay.textContent = "$0.00";
    bill = 0;
    people = 1;
    tipPercentage = 0;
  });
});
