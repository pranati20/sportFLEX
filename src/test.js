const fs = require("fs");

// Read the image file
const image = fs.readFileSync(
  "C:\\Users\\Pranati Sattarapu\\Desktop\\sportFLEX\\public\\images\\2.png"
);

// Convert the binary data to base64
const base64Image = image.toString("base64");

console.log(base64Image);
