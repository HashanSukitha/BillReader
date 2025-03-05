const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let videoStream = null;

// Function to start the camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
        });

        videoStream = document.createElement('video');
        videoStream.srcObject = stream;
        videoStream.play();

        videoStream.onloadedmetadata = () => {
            canvas.width = videoStream.videoWidth;
            canvas.height = videoStream.videoHeight;
            updateCanvas();
        };
    } catch (error) {
        alert("Error accessing camera: " + error.message);
        console.error("Camera error:", error);
    }
}

// Function to continuously draw the live video feed onto the canvas
function updateCanvas() {
    ctx.drawImage(videoStream, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(updateCanvas); // Keep updating the canvas
}

// Start camera on page load
startCamera();
