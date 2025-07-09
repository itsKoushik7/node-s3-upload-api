require("dotenv").config();
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  const fileContent = fs.readFileSync(file.path);

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: file.originalname,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  s3.upload(params, (err, data) => {
    fs.unlinkSync(file.path); // delete local file
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "File uploaded successfully", url: data.Location });
  });
});

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://localhost:3000");
});
