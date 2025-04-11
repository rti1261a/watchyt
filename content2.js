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

function waitAndRepeatUntilMatch(specialVideoID, callbackWhenMatched) {
    const currentVideoID = getYouTubeVideoId();

    if (currentVideoID === specialVideoID) {
        console.log(`✅ Special video "${specialVideoID}" found!`);
        callbackWhenMatched();
    } else {
        console.log(`🔁 Current video "${currentVideoID}" is not the target "${specialVideoID}". Skipping...`);
        simulateNextVideo();

        let waitTime = getRandomWaitTime();
        console.log(`Waiting ${waitTime / 1000} seconds before checking again.`);
        setTimeout(() => waitAndRepeatUntilMatch(specialVideoID, callbackWhenMatched), waitTime);
    }
}

function playNextVideoLoop() {
    simulateNextVideo();

    let waitTime = getRandomWaitTime();
    console.log(`Waiting ${waitTime / 1000} seconds before playing next video...`);

    setTimeout(playNextVideoLoop, waitTime);
}

function startAutomation() {
    chrome.storage.sync.get(["specialVideoID", "waitTime"], function (data) {
        let specialVideoID = data.specialVideoID;
        let waitTime = data.waitTime || 3600000; // Default to 1 hour

        console.log("🎯 Searching for special video...");

        waitAndRepeatUntilMatch(specialVideoID, function () {
            console.log(`⏳ Waiting ${waitTime / 60000} minutes before starting autoplay loop...`);
            setTimeout(playNextVideoLoop, waitTime);
        });
    });
}

// Start the process
startAutomation();
