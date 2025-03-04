const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const output = document.getElementById('output');
const tableBody = document.getElementById('tableBody');
const beepSound = document.getElementById('beepSound');

// Function to start the camera and display it in the video element
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.srcObject = stream;

        // Wait for the video to load before setting canvas size
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            updateCanvas(); // Start continuously updating the canvas
        };
    } catch (error) {
        alert("Error accessing camera: " + error.message);
        console.error("Camera error:", error);
    }
}

// Function to continuously draw the video feed onto the canvas
function updateCanvas() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw a red guide line in the middle
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    requestAnimationFrame(updateCanvas); // Keep updating canvas in real-time
}

// Function to scan text when button is clicked
async function scanText() {
    const sliceHeight = 50; // Capture a small horizontal section
    const imageData = ctx.getImageData(0, canvas.height / 2 - sliceHeight / 2, canvas.width, sliceHeight);

    // Convert image data to base64
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = sliceHeight;
    tempCanvas.getContext("2d").putImageData(imageData, 0, 0);
    const imageBase64 = tempCanvas.toDataURL('image/png');

    // Process with Tesseract
    Tesseract.recognize(imageBase64, 'eng', { logger: m => console.log(m) })
        .then(({ data: { text } }) => {
            text = text.trim();
            if (text) {
                output.innerText = "Scanned Text: " + text;
                addToTable(text);
                beepSound.play();
            }
        })
        .catch(err => console.error(err));
}

// Function to add scanned text to the table
function addToTable(text) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
    tableBody.appendChild(row);
}

// Start camera on page load
startCamera();
