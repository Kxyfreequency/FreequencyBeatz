const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Add a timestamp to the filename
  },
});

// File filter to accept only .zip and .rar files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/zip', 'application/x-rar-compressed', 'application/x-zip-compressed'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only .zip and .rar files are allowed!'), false); // Reject the file
  }
};

const upload = multer({ storage, fileFilter });

// Serve static files (your HTML, CSS, etc.)
app.use(express.static('public'));

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded or invalid file type.');
  }
  res.send('File uploaded successfully!');
});

// Error handling for file upload
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send(err.message); // Handle multer errors
  } else if (err) {
    res.status(400).send(err.message); // Handle other errors
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});