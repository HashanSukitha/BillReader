const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let video = document.createElement('video');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
        });

        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            requestAnimationFrame(updateCanvas);
        };
    } catch (error) {
        alert("Error accessing camera: " + error.message);
        console.error("Camera error:", error);
    }
}

function updateCanvas() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(updateCanvas); // Continuously update the canvas
}

// Start camera on page load
startCamera();
