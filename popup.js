document.addEventListener("DOMContentLoaded", function () {
    let specialVideoInput = document.getElementById("specialVideoURL");
    let waitTimeInput = document.getElementById("waitTime");
    let saveButton = document.getElementById("saveSettings");
    let githubToggle = document.getElementById("useGitHubFetch");

    // Load saved values
    chrome.storage.sync.get(["specialVideoID", "waitTime", "useGitHub"], function (data) {
        if (data.waitTime) {
            waitTimeInput.value = data.waitTime / 60000;
        }

        githubToggle.checked = !!data.useGitHub;

        if (githubToggle.checked) {
            fetchFromGitHubAndSetInput();
        } else if (data.specialVideoID) {
            specialVideoInput.value = `https://www.youtube.com/watch?v=${data.specialVideoID}`;
        }
    });

    githubToggle.addEventListener("change", function () {
        if (githubToggle.checked) {
            fetchFromGitHubAndSetInput();
        } else {
            specialVideoInput.value = ""; // Allow manual entry
        }
    });

    function fetchFromGitHubAndSetInput() {
        fetch("https://raw.githubusercontent.com/rti1261a/watchyt/refs/heads/0.3/link")
            .then(response => response.text())
            .then(text => {
                const trimmed = text.trim();
                if (trimmed.startsWith("https://www.youtube.com/watch?v=")) {
                    specialVideoInput.value = trimmed;
                    console.log("Auto-filled video URL from GitHub:", trimmed);
                } else {
                    console.warn("Invalid link format from GitHub raw file.");
                }
            })
            .catch(err => {
                console.error("Error fetching video URL from GitHub:", err);
            });
    }

    saveButton.addEventListener("click", function () {
        let specialVideoURL = specialVideoInput.value;
        let videoID = new URL(specialVideoURL).searchParams.get("v");
        let waitTime = parseInt(waitTimeInput.value) * 60000;

        chrome.storage.sync.set({ "useGitHub": githubToggle.checked });

        if (githubToggle.checked)
