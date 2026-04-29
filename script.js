let zoom = 1;
let language = "en";

// NAVIGATION DATA
const navigation = {
    "Office Room": { en: "Go straight and take left. Office Room A0L01 is there.", ta: "நேராக சென்று இடப்பக்கம் திரும்பவும். அலுவலகம் அங்கே உள்ளது." },
    "Principal Room": { en: "Go straight and take left. Principal room is there.", ta: "நேராக சென்று இடப்பக்கம் திரும்பவும். முதல்வர் அறை அங்கே உள்ளது." },
    "Admission Centre": { en: "Go straight and take right.", ta: "நேராக சென்று வலப்பக்கம் செல்லவும்." },
    "Computer Center": { en: "Go straight and take right.", ta: "நேராக சென்று வலப்பக்கம் செல்லவும்." },
    "Maths Department": { en: "Go straight and take left.", ta: "நேராக சென்று இடப்பக்கம் செல்லவும்." },
    "English Department": { en: "Go straight and take right.", ta: "நேராக சென்று வலப்பக்கம் செல்லவும்." },

    "CSE Department": { en: "Go to first floor, turn left.", ta: "முதல் மாடிக்கு சென்று இடப்பக்கம் செல்லவும்." },
    "ECE Department": { en: "Go to first floor, turn right.", ta: "முதல் மாடிக்கு சென்று வலப்பக்கம் செல்லவும்." },
    "Civil Department": { en: "Go to first floor, take left.", ta: "முதல் மாடியில் இடப்பக்கம் செல்லவும்." },
    "AIML Department": { en: "Go to first floor, take right.", ta: "முதல் மாடியில் வலப்பக்கம் செல்லவும்." },
    "Library": { en: "Go to first floor, move right.", ta: "முதல் மாடியில் வலப்பக்கம் செல்லவும்." },
    "Physics Lab": { en: "Go to first floor, take left.", ta: "முதல் மாடியில் இடப்பக்கம் செல்லவும்." },
    "Chemistry Lab": { en: "Go to first floor, take right.", ta: "முதல் மாடியில் வலப்பக்கம் செல்லவும்." },

    "IT Department": { en: "Go to second floor, take left.", ta: "இரண்டாம் மாடியில் இடப்பக்கம் செல்லவும்." },
    "Language Lab": { en: "Go to second floor, take right.", ta: "இரண்டாம் மாடியில் வலப்பக்கம் செல்லவும்." },
    "Seminar Hall": { en: "Go straight on second floor.", ta: "இரண்டாம் மாடியில் நேராக செல்லவும்." },
    "CAD Lab": { en: "Go to second floor, take left.", ta: "இரண்டாம் மாடியில் இடப்பக்கம் செல்லவும்." },

    "CSBS Department": { en: "Go to third floor, take left.", ta: "மூன்றாம் மாடியில் இடப்பக்கம் செல்லவும்." },
    "PRR Hall": { en: "Go to third floor, take right.", ta: "மூன்றாம் மாடியில் வலப்பக்கம் செல்லவும்." }
};

// FLOOR DATA
const floors = {
    "ground.jpeg": ["Office Room","Principal Room","Admission Centre","Computer Center","Maths Department","English Department"],
    "first.jpeg": ["CSE Department","ECE Department","Civil Department","AIML Department","Library","Physics Lab","Chemistry Lab"],
    "second.jpeg": ["IT Department","Language Lab","Seminar Hall","CAD Lab"],
    "third.jpeg": ["CSBS Department","PRR Hall"]
};

// PAGE NAVIGATION
function openMap() {
    document.getElementById("landing").classList.add("hidden");
    document.getElementById("mapPage").classList.remove("hidden");
    autoDetectArrival();
}

function enterCampus() {
    document.getElementById("landing").classList.add("hidden");
    document.getElementById("mapPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    loadFloor("ground.jpeg");
}

// LOAD FLOOR
function loadFloor(image) {
    document.getElementById("floorMap").src = image;

    let list = floors[image];
    let box = document.getElementById("locationsBox");

    box.innerHTML = "<h3>Locations:</h3>";

    list.forEach(loc => {
        let p = document.createElement("p");
        p.textContent = loc;
        p.onclick = () => speakNavigation(loc);
        box.appendChild(p);
    });
}

// VOICE
function speakNavigation(place) {
    let text = navigation[place] ? navigation[place][language] : "No data";

    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = language === "ta" ? "ta-IN" : "en-US";
    speechSynthesis.speak(speech);

    alert(text);
}

// LANGUAGE
function toggleLanguage() {
    language = (language === "en") ? "ta" : "en";
    alert(language === "en" ? "English" : "தமிழ்");
}

// ZOOM
function zoomIn() {
    zoom += 0.1;
    document.getElementById("floorMap").style.transform = `scale(${zoom})`;
}

function zoomOut() {
    zoom -= 0.1;
    document.getElementById("floorMap").style.transform = `scale(${zoom})`;
}

// 🔥 SEARCH SYSTEM
const allLocations = Object.keys(navigation);

const searchInput = document.getElementById("search");
const suggestionsBox = document.getElementById("suggestions");

searchInput.addEventListener("input", function() {
    let value = this.value.toLowerCase();
    suggestionsBox.innerHTML = "";

    if (!value) return;

    let results = allLocations.filter(loc =>
        loc.toLowerCase().includes(value)
    );

    results.forEach(loc => {
        let div = document.createElement("div");
        div.textContent = loc;

        div.onclick = () => {
            searchInput.value = loc;
            suggestionsBox.innerHTML = "";
            showSelected(loc);
        };

        suggestionsBox.appendChild(div);
    });
});

searchInput.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

        let value = this.value.toLowerCase();

        let match = allLocations.find(loc =>
            loc.toLowerCase() === value
        );

        if (match) {

            // 🔥 find which floor it belongs to
            let floorImage = Object.keys(floors).find(floor =>
                floors[floor].includes(match)
            );

            if (floorImage) {
                loadFloor(floorImage); // load correct floor
            }

            // 🔥 show only selected location
            let box = document.getElementById("locationsBox");

            box.innerHTML = "<h3>Selected Location:</h3>";

            let p = document.createElement("p");
            p.textContent = match;
            p.onclick = () => speakNavigation(match);

            box.appendChild(p);

            suggestionsBox.innerHTML = "";

        } else {
            alert("Location not found");
        }
    }
});

function getRoute() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            let userLat = position.coords.latitude;
            let userLng = position.coords.longitude;

            let collegeLat = 9.48233;
            let collegeLng = 77.51430;

            let url = `https://www.google.com/maps/dir/${userLat},${userLng}/${collegeLat},${collegeLng}`;

            window.open(url, "_blank");

        }, function() {
            alert("Location access denied. Please allow GPS.");
        });
    } else {
        alert("Geolocation not supported");
    }
}
function goBackToApp() {
    document.getElementById("mapPage").classList.add("hidden");
    document.getElementById("landing").classList.remove("hidden");
}
function autoDetectArrival() {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(function(position) {

        let userLat = position.coords.latitude;
        let userLng = position.coords.longitude;

        let collegeLat = 9.48233;
        let collegeLng = 77.51430;

        let distance = Math.sqrt(
            Math.pow(userLat - collegeLat, 2) +
            Math.pow(userLng - collegeLng, 2)
        );

        // 🔥 If near college (adjust if needed)
        if (distance < 0.01) {

            alert("You have reached the college 🎉");

            enterCampus();

            // optional voice
            speakNavigation("Office Room");
        }

    });
}
function startAssistant() {

    let text;

    if (language === "en") {
        text = "Welcome to Ramco Institute of Technology. Where would you like to go? Navigation is ready.";
    } else {
        text = "ராம்கோ இன்ஸ்டிட்யூட் ஆப் டெக்னாலஜிக்கு வரவேற்கிறோம். நீங்கள் எங்கு செல்ல விரும்புகிறீர்கள்? வழிசெலுத்தல் தயார்.";
    }

    let speech = new SpeechSynthesisUtterance(text);

    // Try to use best voice
    let voices = speechSynthesis.getVoices();

    let tamilVoice = voices.find(v => v.lang.includes("ta"));
    let englishVoice = voices.find(v => v.lang.includes("en"));

    if (language === "ta" && tamilVoice) {
        speech.voice = tamilVoice;
    } else if (englishVoice) {
        speech.voice = englishVoice;
    }

    speechSynthesis.speak(speech);
}