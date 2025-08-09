const User = require("../Model/User");
const path = require("path");
const fs = require("fs");

class DocumentController {
  static async uploadRegistrationDocuments(req, res) {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedDocuments = Object.keys(req.files).map((documentType) => {
        const file = req.files[documentType][0];
        return {
          type: documentType,
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
        };
      });

      res.json({
        message: `${uploadedDocuments.length} documents uploaded successfully!`,
        rollNumber: rollNumber,
        uploadedDocuments: uploadedDocuments,
        totalUploaded: uploadedDocuments.length,
      });
    } catch (error) {
      console.error("Upload registration documents error:", error);
      res.status(500).json({
        message: "Server error during document upload",
        error: error.message,
      });
    }
  }
  // Get user's documents from their folder
  static async getUserDocuments(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const rollNumber = user.profile?.enrollmentId || user._id.toString();
      const userDir = path.join(__dirname, "../uploads/documents", rollNumber);

      if (!fs.existsSync(userDir)) {
        return res.json({ documents: [] });
      }

      // Get all files from user's folder
      const files = fs.readdirSync(userDir);

      const documents = files.map((filename) => {
        const parts = filename.split("_");
        const documentType = parts[0]; // documentType_timestamp.ext
        const filePath = path.join(userDir, filename);
        const stats = fs.statSync(filePath);

        return {
          type: documentType,
          filename: filename,
          size: stats.size,
          uploadedAt: stats.mtime,
        };
      });

      res.json({
        rollNumber,
        documents,
      });
    } catch (error) {
      console.error("Get user documents error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Download/serve a specific document
  static async downloadDocument(req, res) {
    try {
      const { filename } = req.params;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const rollNumber = user.profile?.enrollmentId || user._id.toString();
      const filePath = path.join(
        __dirname,
        "../uploads/documents",
        rollNumber,
        filename,
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Send file
      res.download(filePath);
    } catch (error) {
      console.error("Download document error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Delete a specific document
  static async deleteDocument(req, res) {
    try {
      const { filename } = req.params;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const rollNumber = user.profile?.enrollmentId || user._id.toString();
      const filePath = path.join(
        __dirname,
        "../uploads/documents",
        rollNumber,
        filename,
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ message: "Document deleted successfully" });
      } else {
        res.status(404).json({ message: "File not found" });
      }
    } catch (error) {
      console.error("Delete document error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Get documents for a specific user (admin function)
  static async getDocumentsByRollNumber(req, res) {
    try {
      const { rollNumber } = req.params;
      const userDir = path.join(__dirname, "../uploads/documents", rollNumber);

      if (!fs.existsSync(userDir)) {
        return res
          .status(404)
          .json({ message: "No documents found for this roll number" });
      }

      const files = fs.readdirSync(userDir);
      const documents = files.map((filename) => ({
        filename,
        type: filename.split("_")[0],
      }));

      res.json({ rollNumber, documents });
    } catch (error) {
      console.error("Get documents by roll number error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = DocumentController;
