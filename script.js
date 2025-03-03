const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const tableBody = document.getElementById('tableBody');
const beepSound = document.getElementById('beepSound');

let scanning = false;
let lastExtractedText = ""; // Store last detected text to avoid duplicates

// Start Camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
    } catch (error) {
        alert("Camera access denied. Please allow camera permission.");
        console.error(error);
    }
}

// Capture Frame & Extract Text from Middle Line
async function scanText() {
    if (!scanning) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw red line in the middle
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Capture only the middle slice (where red line is)
    const sliceHeight = 50; // Adjust slice height for better results
    const imageData = ctx.getImageData(0, canvas.height / 2 - sliceHeight / 2, canvas.width, sliceHeight);

    // Convert slice to base64 image
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = sliceHeight;
    tempCanvas.getContext("2d").putImageData(imageData, 0, 0);
    const imageBase64 = tempCanvas.toDataURL('image/png');

    // Process with Tesseract
    Tesseract.recognize(
        imageBase64,
        'eng',
        {
            logger: m => console.log(m) // Logs progress
        }
    ).then(({ data: { text } }) => {
        text = text.trim();
        if (text && text !== lastExtractedText) {
            lastExtractedText = text; // Update last scanned text to prevent duplicates
            output.innerText = "Scanned Text: " + text;
            addToTable(text);
            beepSound.play(); // Play beep sound when text is captured
        }
        setTimeout(scanText, 2000); // Scan every 2 seconds
    }).catch(err => console.error(err));
}

// Start Scanning Button
function startScanning() {
    scanning = true;
    scanText();
}

// Add scanned text to table
function addToTable(text) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
    tableBody.appendChild(row);
}

// Start camera on page load
startCamera();
