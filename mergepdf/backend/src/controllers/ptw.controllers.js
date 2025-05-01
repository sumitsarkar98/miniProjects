import multer from "multer";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { Document, Packer, Paragraph } from "docx";

// Main controller function
const ptwConverter = (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const upload = multer({ storage }).single("pdfFile");

  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload error", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const pdfPath = req.file.path;
      const dataBuffer = fs.readFileSync(pdfPath);
      const parsed = await pdfParse(dataBuffer);
      const extractedText = parsed.text;

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: extractedText
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line) => new Paragraph(line)),
          },
        ],
      });

      const docxBuffer = await Packer.toBuffer(doc);

      const convertedDir = "converted";
      if (!fs.existsSync(convertedDir)) {
        fs.mkdirSync(convertedDir);
      }

      const outputFileName = path.basename(pdfPath, ".pdf") + ".docx";
      const outputPath = path.join(convertedDir, outputFileName);

      fs.writeFileSync(outputPath, docxBuffer);

      res.download(outputPath, outputFileName, (err) => {
        fs.unlink(pdfPath, () => {});
        fs.unlink(outputPath, () => {});

        if (err) {
          console.error("Download error:", err);
          return res.status(500).send("Error sending the converted file.");
        }
      });
    } catch (error) {
      console.error("Conversion failed:", error);
      res.status(500).json({
        message: "PDF to Word conversion failed",
        error: error.message,
      });
    }
  });
};

export { ptwConverter };
