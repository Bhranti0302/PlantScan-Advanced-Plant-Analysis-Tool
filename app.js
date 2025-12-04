require("dotenv").config();
const express = require("express");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5000;

// -------------------- MULTER MEMORY STORAGE --------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ======================= ANALYZE ROUTE =======================
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Use buffer directly
    const imageData = req.file.buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      "Analyze this plant image and provide detailed analysis of its species, health, and care recommendations, its characteristics, care instructions, and any interesting facts. Please provide the response in plain text without using any markdown formatting.",
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageData,
        },
      },
    ]);

    const plantInfo = result.response.text();

    res.json({
      result: plantInfo,
      image: `data:${req.file.mimetype};base64,${imageData}`,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res
      .status(500)
      .json({ error: "An error occurred while analyzing the image" });
  }
});

// ======================= DOWNLOAD PDF ROUTE =======================
app.post("/download", express.json(), async (req, res) => {
  const { result, image } = req.body;

  try {
    const reportsDir = path.join(__dirname, "reports");
    await fsPromises.mkdir(reportsDir, { recursive: true });

    const filename = `plant_analysis_report_${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, filename);

    const writeStream = fs.createWriteStream(filePath);

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, left: 50, right: 50, bottom: 50 },
    });

    doc.pipe(writeStream);

    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // ========== HEADER ==========
    doc
      .fontSize(22)
      .fillColor("#2e7d32")
      .text("Plant Analysis Report", { align: "center" });

    doc
      .moveDown(0.5)
      .fontSize(12)
      .fillColor("black")
      .text(`Generated on: ${new Date().toDateString()}`, { align: "center" });

    // Divider
    doc.moveDown(1);
    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke("#aaaaaa");

    doc.moveDown(1.5);

    // ========== IMAGE ==========
    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const imageWidth = 250;
      const imageHeight = 250;
      const imageX = (doc.page.width - imageWidth) / 2;
      const startY = doc.y;

      doc.image(buffer, imageX, startY, {
        width: imageWidth,
        height: imageHeight,
        align: "center",
      });

      doc.y = startY + imageHeight + 30; // Move cursor below image
    }

    // ========== FORMAT TEXT ==========
    const formattedResult = result
      .replace(/\r\n/g, "\n")
      .replace(/\n{2,}/g, "\n\n")
      .trim();

    const paragraphs = formattedResult.split("\n\n");

    // ========== TEXT HEADING ==========
    doc
      .fontSize(16)
      .fillColor("#2e7d32")
      .text("Plant Analysis", { underline: true });

    doc.moveDown(1);

    // ========== TEXT CONTENT ==========
    doc.fontSize(12).fillColor("black");

    paragraphs.forEach((para) => {
      doc.text(para, {
        width: pageWidth,
        align: "left",
        lineGap: 4,
      });
      doc.moveDown(0.8);
    });

    // Footer removed as requested

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    res.download(filePath, (err) => {
      if (err) {
        res.status(500).json({ error: "Error downloading the PDF report" });
      }
      fsPromises.unlink(filePath); // Cleanup PDF after download
    });
  } catch (error) {
    console.error("Error generating PDF report:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the PDF report" });
  }
});

// ======================= SERVER =======================
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
