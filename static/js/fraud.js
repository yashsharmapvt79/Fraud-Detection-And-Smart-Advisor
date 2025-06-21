document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fraudForm");
  const resultBox = document.getElementById("fraudResult");

  if (!form || !resultBox) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultBox.innerHTML = `<p class="loading">🧠 Analyzing claim...</p>`;

    const formData = new FormData(form);
    const jsonData = {};

    for (const [key, value] of formData.entries()) {
      jsonData[key] = Number(value);
    }

    try {
      const response = await fetch("/predict_fraud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("Prediction API failed.");
      }

      const result = await response.json();
      renderResult(result);
    } catch (error) {
      resultBox.innerHTML = `
        <div class="result-box error">
          <h3>❌ Prediction Failed</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  });

  function renderResult(result) {
    if (result.error) {
      resultBox.innerHTML = `
        <div class="result-box error">
          <h3>⚠️ Error</h3>
          <p>${result.error}</p>
        </div>
      `;
      return;
    }

    const { fraud_prediction, confidence } = result;
    const color = fraud_prediction === "Fraudulent" ? "#dc3545" : "#198754";

    resultBox.innerHTML = `
      <div class="result-box" style="border-left: 5px solid ${color}">
        <h3>Fraud Detection Result:</h3>
        <p>🔍 Status: <strong>${fraud_prediction}</strong></p>
        <p>📈 Confidence: ${confidence}%</p>
      </div>
    `;
  }
});
