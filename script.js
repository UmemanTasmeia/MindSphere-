// Handle Login Page
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // In a real-world app, validate the username/password here
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('facial-recognition-page').style.display = 'block';
});

// Start facial recognition on button click
async function startFacialRecognition() {
    const video = document.getElementById('videoElement');
    const emotionDisplay = document.getElementById('emotion-display');

    // Load face-api.js models
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');

    // Start webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;

    // Detect faces and emotions
    video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);

        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceExpressions();
            canvas.clear();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas?.render(resizedDetections);

            if (detections.length > 0) {
                const expressions = detections[0].expressions;
                let maxExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
                emotionDisplay.innerHTML = `<p>Detected Emotion: <strong>${maxExpression}</strong></p>`;
                // After facial expression detection, proceed to main menu
                document.getElementById('facial-recognition-page').style.display = 'none';
                document.getElementById('main-menu').style.display = 'block';
            }
        }, 100);
    });
}

// Function to show the links based on the selected option
function showLinks(category) {
    let linksContent = document.getElementById('links-content');
    let links = '';

    if (category === 'music') {
        links = '<ul><li><a href="#">Relaxing Playlist</a></li><li><a href="#">Focus Music</a></li><li><a href="#">Sleep Sounds</a></li></ul>';
    } else if (category === 'motivation') {
        links = '<ul><li><a href="#">Motivational Quotes</a></li><li><a href="#">Daily Affirmations</a></li><li><a href="#">Ted Talks</a></li></ul>';
    } else if (category === 'books') {
        links = '<ul><li><a href="#">Mindfulness Books</a></li><li><a href="#">Self-Help Books</a></li><li><a href="#">Psychology Books</a></li></ul>';
    } else if (category === 'games') {
        links = '<ul><li><a href="#">Puzzle Games</a></li><li><a href="#">Riddles</a></li><li><a href="#">Quizzes</a></li></ul>';
    }

    linksContent.innerHTML = links;
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('links-page').style.display = 'block';
}

// Function to go back to the main menu
function backToMenu() {
    document.getElementById('links-page').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

// Start facial recognition immediately after login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('login-page').style.display = 'none';
    startFacialRecognition();  // Start facial recognition immediately after login
});
