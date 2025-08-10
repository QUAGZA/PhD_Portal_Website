const express = require("express");
const DocumentController = require("../Controller/DocumentController");
const { uploadRegistrationDocuments } = require("../middlewares/upload");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const router = express.Router();

router.use(isLoggedIn);
router.post(
  "/registration-upload",
  uploadRegistrationDocuments,
  DocumentController.uploadRegistrationDocuments,
);
router.get("/my-documents", DocumentController.getUserDocuments);
router.get("/download/:filename", DocumentController.downloadDocument);
router.delete("/:filename", DocumentController.deleteDocument);

// Admin route: Get documents by roll number
// Add admin check middleware if needed
router.get("/user/:rollNumber", DocumentController.getDocumentsByRollNumber);

module.exports = router;
