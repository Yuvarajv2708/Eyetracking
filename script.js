// Initialize WebGazer
webgazer.setGazeListener(function(data, elapsedTime) {
    // Update the gaze point position
    if (data.x !== null && data.y !== null) {
        var x = data.x * window.innerWidth;
        var y = data.y * window.innerHeight;
        var gazePoint = document.getElementById('gaze-point');
        gazePoint.style.left = x + 'px';
        gazePoint.style.top = y + 'px';
    }
});

// Calibration variables
var circles = [];
var collectedPoints = 0;

// Show the message box and start calibration
function startCalibration() {
    document.getElementById('message-box').style.display = 'block';
    webgazer.showFaceOverlay(true);
    webgazer.showFaceFeedbackBox(true);
    webgazer.showPredictionPoints(true);
    webgazer.showVideo(true);
    webgazer.beginCalibration();
}

function stopCalibration() {
    // Stop calibration
    webgazer.stopCalibration();
    webgazer.showFaceOverlay(false);
    webgazer.showFaceFeedbackBox(false);
    webgazer.showPredictionPoints(false);
    webgazer.showVideo(false);
    document.getElementById('message-box').style.display = 'none';

    // Display the image and timer
    var image = document.getElementById('image');
    var timer = document.getElementById('timer');
    image.src = 'wp1846480-black-wallpapers.jpg';
    image.style.display = 'block';
    timer.style.display = 'block';

    // Display the timer
    var interval = setInterval(function() {
        var time = timer.textContent.split(':');
        var m = parseInt(time[0], 10);
        var s = parseInt(time[1], 10);
        if (s === 0) {
            if (m === 0) {
                clearInterval(interval);
                // Remove the image and timer
                image.style.display = 'none';
                timer.style.display = 'none';
                // Display the gaze data as a heatmap
                displayHeatmap();
                // Navigate to the study page
                window.location.href = 'studypage.html';
            } else {
                m--;
                s = 59;
            }
        } else {
            s--;
        }
        timer.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    }, 1000);
}

// Start button click event
document.getElementById('start-button').addEventListener('click', function() {
    startCalibration();
});

// Stop button click event
document.getElementById('stop-button').addEventListener('click', function() {
    stopCalibration();
});

// WebGazer calibration event
webgazer.showFaceFeedbackBox(true);
webgazer.showPredictionPoints(true);
webgazer.showVideo(true);
webgazer.setRegression('ridge')
    .setGazeListener(function(data, elapsedTime) 
        {if (collectedPoints < 90) {
            if (circles[Math.floor(collectedPoints / 2)] === undefined) {
                circles[Math.floor(collectedPoints / 2)] = [];
            }
            circles[Math.floor(collectedPoints / 2)].push({
                x: data.x,
                y: data.y
            });
            collectedPoints++;
            if (collectedPoints === 90) {
                // Calibration completed
                document.getElementById('message-box').innerHTML = 'Calibration completed!';
                document.getElementById('message-box').style.backgroundColor = 'green';
                setTimeout(function() {
                    window.location.href = 'studypage.html';
                }, 2000);
            }}
        } )

    .begin();