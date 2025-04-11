function simulateNextVideo() {
    console.log("➡️ Pressing Shift + N to skip to next video...");

    // Simulate Shift + N key press
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'N',
        code: 'KeyN',
        keyCode: 78,
        which: 78,
        shiftKey: true
    }));
}

function getYouTubeVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("v");
}

function getRandomWaitTime(min = 60, max = 120) {
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
}

let skipLoopInterval = null;
let specialCheckInterval = null;

function startSkipLoop() {
    if (skipLoopInterval) return; // prevent multiple intervals
    console.log("▶️ Starting skip loop...");
    skipLoopInterval = setInterval(() => {
        simulateNextVideo();
    }, getRandomWaitTime());
}

function stopSkipLoop() {
    console.log("⏸️ Stopping skip loop...");
    clearInterval(skipLoopInterval);
    skipLoopInterval = null;
}

function startCheckingForSpecial(specialVideoID, waitTime) {
    specialCheckInterval = setInterval(() => {
        const currentVideoID = getYouTubeVideoId();

        if (currentVideoID === specialVideoID) {
            console.log(`✅ Special video "${specialVideoID}" found!`);

            stopSkipLoop(); // stop skipping
            clearInterval(specialCheckInterval); // stop checking

            console.log(`⏳ Waiting ${waitTime / 60000} minutes before resuming skip loop...`);
            setTimeout(() => {
                startSkipLoop();
                startCheckingForSpecial(specialVideoID, waitTime); // start checking again
            }, waitTime);
        } else {
            console.log(`🔁 Current video "${currentVideoID}" is not the target "${specialVideoID}".`);
        }
    }, 5000); // check every 5 seconds
}

function startAutomation() {
    chrome.storage.sync.get(["specialVideoID", "waitTime"], function (data) {
        let specialVideoID = data.specialVideoID;
        let waitTime = data.waitTime || 3600000; // Default to 1 hour

        console.log("🎯 Starting automation...");
        startSkipLoop();
        startCheckingForSpecial(specialVideoID, waitTime);
    });
}

// Start the process
startAutomation();
