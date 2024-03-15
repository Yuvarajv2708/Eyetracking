<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebGazer Example</title>
    <script src="webgazer.js"></script>
    <script src="heatmap.js"></script>
    <style>
        body {
            background-image:url('wp1846480-black-wallpapers.jpg');
            background-size: cover;
            background-position: center;
        }
        #gaze-point {
            position: absolute
            background-color: red;
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        #message-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border: 1px solid black;
            border-radius: 5px;
            display: none;
        }
        #image {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 100%;
            max-height: 100%;
            display: none;
        }
        #timer {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: white;
            padding: 5px 10px;
            border-radius: 5px;
            display: none;
        }
        button {
            display: block;
            margin: 0 auto;
            padding: 10px 20px;
            background-color: blue;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="message-box">
        <p>Please look at the center of the screen for calibration.</p>
    </div>
    <button id="start-button">Start</button>
    <button id="stop-button">Stop</button>
    <div id="gaze-point"></div>
    <img id="image" src="wp1846480-black-wallpapers.jpg">
    <div id="timer">1:00</div>
    <script>
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

        // Start calibration and display calibration completing message
        function startCalibration() {
            webgazer.showFaceOverlay(true);
            webgazer.showFaceFeedbackBox(true);
            webgazer.showPredictionPoints(true);
            webgazer.showVideo(true);
            webgazer.beginCalibration();
            webgazer.setGazeListener(function(data, elapsedTime) {
                if (collectedPoints < 90) {
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
                    }
                }
            });
        }

        // Stop calibration and hide the message box
        function stopCalibration() {
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

        // Display the gaze data as a heatmap
        function displayHeatmap() {
            var data = [];
            webgazer.setGazeListener(function(data, elapsedTime) {
                data.push({
                    x: data.x * window.innerWidth,
                    y: data.y * window.innerHeight
                });
            });
            setTimeout(function() {
                webgazer.stopGazeListener();
                var heatmap = h337.create({
                   container: document.body
                });
                heatmap.setData(data);
            }, 60000);
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
            .begin();
    </script>
</body>
</html>