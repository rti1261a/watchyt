document.addEventListener("DOMContentLoaded", function () {
    let specialVideoInput = document.getElementById("specialVideoURL");
    let waitTimeInput = document.getElementById("waitTime");
    let saveButton = document.getElementById("saveSettings");

    // Load saved values
    chrome.storage.sync.get(["specialVideoID", "waitTime"], function (data) {
        if (data.specialVideoID) {
            specialVideoInput.value = `https://www.youtube.com/watch?v=${data.specialVideoID}`;
        }
        if (data.waitTime) {
            waitTimeInput.value = data.waitTime / 60000; // Convert ms to minutes
        }
    });

    saveButton.addEventListener("click", function () {
        let specialVideoURL = specialVideoInput.value;
        let videoID = new URL(specialVideoURL).searchParams.get("v"); // Extract video ID
        let waitTime = parseInt(waitTimeInput.value) * 60000; // Convert minutes to milliseconds

        if (videoID) {
            chrome.storage.sync.set({ "specialVideoID": videoID, "waitTime": waitTime }, function () {
                console.log("Settings saved:", videoID, waitTime);
            });
        } else {
            alert("Please enter a valid YouTube video URL.");
        }
    });
});
