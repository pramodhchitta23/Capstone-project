const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Multer Upload Configuration (up to 200MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 },
});

exports.uploadMiddleware = upload.single("file");

// Simulation logic mapping
const ATTACK_TYPES = [
  "Port Scan",
  "DDoS Attack",
  "Brute Force",
  "SQL Injection",
  "Cross-Site Scripting (XSS)",
  "Botnet Activity",
  "Data Exfiltration",
  "Ransomware Indicator",
];

const SEVERITY_LEVELS = ["Critical", "High", "Medium", "Low"];

const generateSimulatedThreat = (row, index) => {
  // Simulate AI/ML logic: randomly assign attack type based on heuristic weights
  const attackType = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];

  // Base probability depending on the attack type to map realism
  let baseProb = 0.3;
  if (["DDoS Attack", "Data Exfiltration", "Ransomware Indicator"].includes(attackType)) {
    baseProb = 0.7;
  } else if (["SQL Injection", "Brute Force"].includes(attackType)) {
    baseProb = 0.5;
  }

  // Calculate final probability score between 0 and 1
  const probability = Math.min(0.99, baseProb + (Math.random() * 0.4));

  // Determine severity based on probability threshold
  let severity = "Low";
  if (probability > 0.85) severity = "Critical";
  else if (probability > 0.65) severity = "High";
  else if (probability > 0.45) severity = "Medium";

  // Simulate source IP and Target Asset
  const sourceIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  const targetAsset = `Server-0${Math.floor(Math.random() * 9) + 1}`;

  return {
    id: `THR-${Date.now()}-${index}`,
    attackType,
    severity,
    probability: (probability * 100).toFixed(1) + "%",
    sourceIp,
    targetAsset,
    timestamp: new Date().toISOString(),
    recommendation: getRecommendation(severity, attackType)
  };
};

const getRecommendation = (severity, attackType) => {
  if (severity === "Critical") return "Isolate asset immediately and block source IP.";
  if (severity === "High") return "Investigate logs and apply WAF rules.";
  if (severity === "Medium") return "Monitor traffic for recurring patterns.";
  return "Log activity, no immediate action required.";
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Please strictly provide a CSV." });
    }

    const stats = { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
    const detailedThreats = [];

    // Aggregation maps for charts
    const attackMap = {};

    let rowIndex = 0;

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        rowIndex++;
        stats.total++;

        const threat = generateSimulatedThreat(row, rowIndex);

        if (threat.severity === "Critical") stats.critical++;
        else if (threat.severity === "High") stats.high++;
        else if (threat.severity === "Medium") stats.medium++;
        else stats.low++;

        // Keep top 150 threats for detailed table
        if (detailedThreats.length < 150) {
          detailedThreats.push(threat);
        }

        // Aggregate Attack Types
        if (!attackMap[threat.attackType]) attackMap[threat.attackType] = 0;
        attackMap[threat.attackType] += 1;
      })
      .on("end", () => {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        const severityWeight = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 };
        detailedThreats.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);

        const summaryInsights = `Processed ${stats.total} network events. Detected ${stats.critical} critical anomalies requiring immediate SOC intervention. Overall network risk posture is ${stats.critical > 5 ? 'ELEVATED' : 'STABLE'}.`;

        // Format chart data arrays
        const attackDistribution = Object.entries(attackMap)
          .map(([type, count]) => ({ name: type, count }));

        res.json({
          stats,
          detailedThreats,
          summaryInsights,
          charts: {
            attackDistribution
          }
        });
      })
      .on("error", (error) => {
        console.error("CSV Parsing Error:", error);
        res.status(500).json({ message: "Failed to parse CSV file." });
      });

  } catch (err) {
    console.error("UPLOAD CONTROLLER ERROR:", err);
    res.status(500).json({ message: "Internal server error during upload." });
  }
};