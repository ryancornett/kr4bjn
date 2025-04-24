import { bibleVerses } from "./bible.js";
import { displayData } from "./pota.js";
import { getARRLDisplayData } from "./arrl.js";

const verseText = document.getElementById('verse-text');
const verseRef = document.getElementById('verse-ref');
const verse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
verseText.textContent = verse.text;
verseRef.textContent = `${verse.book} ${verse.chapter}:${verse.verses} BSB`;

const year = new Date().getFullYear();
let rights = document.getElementById('rights');
rights.textContent = year == 2025 ? "All rights reserved 2025" : `All rights reserved 2025-${year}`;

setTimeout(await displayData, 3000);

async function getTimeData() {
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false };
    
    // Get UTC time
    const now = new Date();
    const utcString = now.toISOString().slice(11, 16); // Extracts HH:MM from UTC

    // Get Eastern Time (ET)
    const estFormatter = new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'America/New_York' });
    const estParts = estFormatter.formatToParts(now);
    const keyDay = estParts.find(part => part.type === 'weekday').value;
    const keyTime = estParts.filter(part => part.type === 'hour' || part.type === 'minute')
                            .map(part => part.value.padStart(2, '0')) // Ensures two-digit format
                            .join(':');

    // Determine if it's EST or EDT
    const estOrEdt = now.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' })
                        .split(' ')
                        .pop(); // Extracts "EST" or "EDT"

    // Return object with separated values
    return { keyDay, keyTime, estOrEdt, utcString };
}

function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes; // Convert hours to minutes and add minutes
}

const timeData = await getTimeData();

async function getTimeCategory() {

    const timeMinutes = timeToMinutes(timeData.keyTime); // Convert keyTime to minutes since midnight

    switch (true) {
        case (timeMinutes >= 0 && timeMinutes < 540): // 12:00 AM - 8:59 AM
            return "outsideHours"; 
        
        case (timeMinutes >= 540 && timeMinutes < 600): // 9:00 AM - 9:59 AM
            return 900;

        case (timeMinutes >= 600 && timeMinutes < 945): // 10:00 AM - 3:44 PM
            return "vot";

        case (timeMinutes >= 945 && timeMinutes < 960): // 3:45 PM - 3:59 PM
            return 345;

        case (timeMinutes >= 960 && timeMinutes < 1020): // 4:00 PM - 4:59 PM
            return 400;

        case (timeMinutes >= 1020 && timeMinutes < 1080): // 5:00 PM - 5:59 PM
            return "code";
        
        case (timeMinutes >= 1080 && timeMinutes < 1140): // 6:00 PM - 6:59 PM
            return "digital";
        
        case (timeMinutes >= 1140 && timeMinutes < 1200): // 7:00 PM - 7:59 PM
            return 700;

        case (timeMinutes >= 1200 && timeMinutes < 1260): // 8:00 PM - 8:59 PM
            return "code";
        
        case (timeMinutes >= 1260 && timeMinutes < 1305): // 9:00 PM - 9:44 PM
            return "digital";
        
        case (timeMinutes >= 1305 && timeMinutes < 1320): // 9:45 PM - 9:59 PM
            return "voice";

        case (timeMinutes >= 1320 && timeMinutes < 1380): // 10:00 PM - 11:00 PM
            return 1000;
        
        case (timeMinutes >= 1380 && timeMinutes < 1440): // 11:00 PM - 11:59 PM
            return "code";

        default:
            return "error";
    }
}

const arrlInfo = {
    "timeCategory": await getTimeCategory(),
    "day": timeData.keyDay.toLowerCase()
}

const arrlDataForDisplay = getARRLDisplayData(arrlInfo);

// Function to construct displayText
function buildDisplayText(timeData) {
    return `${timeData.keyDay} ${timeData.estOrEdt} ${timeData.keyTime} | UTC ${timeData.utcString}`;
}

const timeAndDay = document.getElementById('time-day');
timeAndDay.textContent = buildDisplayText(timeData);

const arrlTransmitting = document.getElementById('arrl-transmitting');
arrlTransmitting.textContent = arrlDataForDisplay.transmitting ? "W1AW is currently transmitting:" : "W1AW is not transmitting.";

const arrlDetails = document.getElementById('arrl-details');
arrlDetails.textContent = arrlDataForDisplay.details;


// CW KEYER
const rawMorseDisplay = document.getElementById("raw-morse");
const sidetoneVolumeSlider = document.getElementById("sidetone-volume");
const sidetonePitchSlider = document.getElementById("sidetone-pitch");
const pitchDisplay = document.getElementById("pitch-display");

let morseInput = "";
let inputTimer;
let spaceTimer;
let iambicTimer;
let ditPressed = false;
let dahPressed = false;
let paddleMode = false;

const morseOutputField = document.getElementById("morse-output");
const ditIndicator = document.getElementById("dit-indicator");
const dahIndicator = document.getElementById("dah-indicator");
const wpmSlider = document.getElementById("wpm");
const farnsworthSlider = document.getElementById("farnsworth");

// Your full dictionary
const morseDictionary = {
    ".": "E", "-": "T", "..": "I", ".-": "A", "-.": "N", "--": "M", "...": "S", "..-": "U", ".-.": "R", "-..": "D",
    ".--": "W", "--.": "G", "---": "O", "-.-": "K", "....": "H", "-...": "B", ".-..": "L", "..-.": "F", "...-": "V",
    "-.-.": "C", ".--.": "P", "-.--": "Y", "-..-": "X", "--..": "Z", "--.-": "Q", ".---": "J", ".----": "1", "..---": "2",
    "...--": "3", "....-": "4", ".....": "5", "-....": "6", "--...": "7", "---..": "8", "----.": "9", "-----": "0",
    "........": "correction", ".-.-.-": ".", "..--..": "?", "--..--": ",", ".-.-.": "+", ".--.-.": "@", "-.-.--": "!",
    "---...": ":", "-.-.-.": ";", "-....-": "-", "-.--.": "(", "-.--.-": ")", ".----.": "'", "...-..-": "$", ".-..-.": "\"",
    "-...-": "=", "-..-.": "/", "space": " "
};

function getTiming() {
    const wpm = parseInt(wpmSlider.value);
    const farnsworth = parseInt(farnsworthSlider.value);
    const sidetonePitchSlider = document.getElementById("sidetone-pitch");
    const pitchDisplay = document.getElementById("pitch-display");

    const ditLength = 1200 / wpm;
    const farnsworthFactor = (farnsworth / 100);
    const charPause = ditLength * 3 * (1 + farnsworthFactor);
    const wordPause = ditLength * 7 * (1 + farnsworthFactor);

    return { ditLength, charPause, wordPause };
}

function playTone(duration) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    const pitch = parseInt(sidetonePitchSlider.value);
    const volume = parseFloat(sidetoneVolumeSlider.value);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    setTimeout(() => oscillator.stop(), duration);
}

function playDit() {
    const { ditLength } = getTiming();
    playTone(ditLength);
    morseInput += ".";
    updateRawDisplay();
    ditIndicator.classList.add("active");
    resetTimers();
    setTimeout(() => ditIndicator.classList.remove("active"), ditLength);
}

function playDah() {
    const { ditLength } = getTiming();
    const dahLength = ditLength * 3;
    playTone(dahLength);
    morseInput += "-";
    updateRawDisplay();
    dahIndicator.classList.add("active");
    resetTimers();
    setTimeout(() => dahIndicator.classList.remove("active"), dahLength);
}

function resetTimers() {
    clearTimeout(inputTimer);
    clearTimeout(spaceTimer);

    const { charPause, wordPause } = getTiming();

    inputTimer = setTimeout(() => {
        decodeMorse(morseInput);
        morseInput = "";
        updateRawDisplay();
    }, charPause);

    spaceTimer = setTimeout(() => {
        morseOutputField.value += " ";
        rawMorseDisplay.innerText += " / ";
    }, wordPause);
}

function decodeMorse(input) {
    const decoded = morseDictionary[input] || "?";

    if (decoded === "correction") {
        // Backspace-like behavior
        morseOutputField.value = morseOutputField.value.slice(0, -1);
    } else {
        morseOutputField.value += decoded;
    }
}

function updateRawDisplay() {
    rawMorseDisplay.innerText = morseInput;
}

// Mouse hover activates paddle mode
document.getElementById("paddle-zone").addEventListener("mouseenter", () => {
    paddleMode = true;
});
document.getElementById("paddle-zone").addEventListener("mouseleave", () => {
    paddleMode = false;
    clearInterval(iambicTimer);
    ditPressed = false;
    dahPressed = false;
});

// Handle mouse down for left/right click
document.addEventListener("mousedown", (event) => {
    if (!paddleMode) return;
    event.preventDefault();

    if (event.button === 0) ditPressed = true;
    if (event.button === 2) dahPressed = true;

    handlePaddleInput();
});

// Handle mouseup to stop repeating
document.addEventListener("mouseup", (event) => {
    if (event.button === 0) ditPressed = false;
    if (event.button === 2) dahPressed = false;

    if (!ditPressed && !dahPressed) {
        clearInterval(iambicTimer);
    }
});

// Iambic alternating paddle logic
function handlePaddleInput() {
    const { ditLength } = getTiming();
    let toggle = true;

    clearInterval(iambicTimer);

    if (ditPressed && dahPressed) {
        iambicTimer = setInterval(() => {
            toggle ? playDit() : playDah();
            toggle = !toggle;
        }, ditLength * 2);
    } else if (ditPressed) {
        playDit();
    } else if (dahPressed) {
        playDah();
    }
}

// Clear output
document.getElementById('morse-output-clear').addEventListener('click', () => {
    morseOutputField.value = "";
    rawMorseDisplay.innerText = "";
});

sidetonePitchSlider.addEventListener("input", () => {
    pitchDisplay.textContent = `${sidetonePitchSlider.value} Hz`;
});

// Block right-click menu inside paddle zone
document.getElementById("paddle-zone").addEventListener("contextmenu", e => e.preventDefault());