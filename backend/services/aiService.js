const Threat = require("../models/Threat");

const simulateAI = () => {
  const predictions = ["Normal", "DoS Attack", "Port Scan", "Brute Force"];
  const prediction =
    predictions[Math.floor(Math.random() * predictions.length)];
  const probability = parseFloat(Math.random().toFixed(2));

  return { prediction, probability };
};

const agentDecision = async (prediction, probability, userId) => {
  let severity = "LOW";
  let recommendation = "Log Only";

  if (prediction === "Normal") {
    return { severity: "LOW", recommendation: "No Action Required" };
  }

  // Base severity from probability
  if (probability > 0.5) {
    severity = "MEDIUM";
    recommendation = "Monitor Traffic";
  }

  if (probability > 0.7) {
    severity = "HIGH";
    recommendation = "Block Source IP";
  }

  if (probability > 0.85) {
    severity = "CRITICAL";
    recommendation = "Isolate Host Immediately";
  }

  // 🔥 TIME-WINDOW ESCALATION (Last 10 Minutes)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const recentCount = await Threat.countDocuments({
    userId,
    prediction,
    createdAt: { $gte: tenMinutesAgo }
  });

  // Adaptive escalation based on frequency in window
  if (recentCount >= 3 && severity === "MEDIUM") {
    severity = "HIGH";
    recommendation = "Escalated: Repeated Attack Detected – Block Source";
  }

  if (recentCount >= 5) {
    severity = "CRITICAL";
    recommendation =
      "Escalated: High Frequency Attack – Immediate Containment Required";
  }

  return { severity, recommendation };
};

module.exports = { simulateAI, agentDecision };