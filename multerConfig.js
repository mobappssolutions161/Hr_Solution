const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {    
        cb(null, uploadDir); // Save to "uploads" folder
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Get file extension
        const baseName = path.basename(file.originalname, ext); // Get filename without extension
        const safeFileName = baseName.replace(/\s+/g, "_").replace(/[()]/g, ""); // Remove spaces & special chars
        cb(null, `${safeFileName}_${Date.now()}${ext}`);
    },
});

// File filter to allow only .docx files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        cb(null, true);
    } else {
        cb(new Error("Only .docx files are allowed!"), false);
    }
};

// Create a Multer instance
const upload2 = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload2;  // Export only the Multer instance
