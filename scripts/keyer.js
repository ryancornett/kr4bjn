import { lettersAtoM, lettersNtoZ, numbers, symbols } from "./cw-legend.js";

const rawMorseDisplay = document.getElementById("raw-morse");
const sidetoneVolumeSlider = document.getElementById("sidetone-volume");
const sidetonePitchSlider = document.getElementById("sidetone-pitch");

let morseInput = "";
let inputTimer;
let spaceTimer;
let iambicTimer;
let ditPressed = false;
let dahPressed = false;
let paddleMode = false;

const morseOutputField = document.getElementById("morse-output");
const morseOutputClearBtn = document.getElementById("morse-output-clear");
const ditIndicator = document.getElementById("dit-indicator");
const dahIndicator = document.getElementById("dah-indicator");
const wpmSlider = document.getElementById("wpm");
const farnsworthSlider = document.getElementById("farnsworth");

// Your full dictionary
const morseDictionary = {
  ".": "E",
  "-": "T",
  "..": "I",
  ".-": "A",
  "-.": "N",
  "--": "M",
  "...": "S",
  "..-": "U",
  ".-.": "R",
  "-..": "D",
  ".--": "W",
  "--.": "G",
  "---": "O",
  "-.-": "K",
  "....": "H",
  "-...": "B",
  ".-..": "L",
  "..-.": "F",
  "...-": "V",
  "-.-.": "C",
  ".--.": "P",
  "-.--": "Y",
  "-..-": "X",
  "--..": "Z",
  "--.-": "Q",
  ".---": "J",
  ".----": "1",
  "..---": "2",
  "...--": "3",
  "....-": "4",
  ".....": "5",
  "-....": "6",
  "--...": "7",
  "---..": "8",
  "----.": "9",
  "-----": "0",
  "........": "correction",
  ".-.-.-": ".",
  "..--..": "?",
  "--..--": ",",
  ".-.-.": "+",
  ".--.-.": "@",
  "-.-.--": "!",
  "---...": ":",
  "-.-.-.": ";",
  "-....-": "-",
  "-.--.": "(",
  "-.--.-": ")",
  ".----.": "'",
  "...-..-": "$",
  ".-..-.": '"',
  "-...-": "=",
  "-..-.": "/",
  space: " ",
};

function getTiming() {
  const wpm = parseInt(wpmSlider.value);
  const farnsworth = parseInt(farnsworthSlider.value);

  const ditLength = 1200 / wpm;
  const farnsworthFactor = farnsworth / 100;
  const charPause = ditLength * 3 * (1 + farnsworthFactor);
  const wordPause = ditLength * 7 * (1 + farnsworthFactor);

  return { ditLength, charPause, wordPause };
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let waveformType = "sine";
const waveformGroup = document.getElementById("waveform-group");

// Load saved waveform from localStorage (if any)
const savedWaveform = localStorage.getItem("cw_waveform");
if (savedWaveform) {
    waveformGroup.value = savedWaveform;
    waveformType = savedWaveform;
}

// Listen for changes from Shoelace component
waveformGroup.addEventListener("sl-change", (event) => {
    waveformType = event.target.value;
    localStorage.setItem("cw_waveform", waveformType);
    drawWaveformPreview(waveformType);
});


function playTone(duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    const pitch = parseInt(sidetonePitchSlider.value);
    const volume = parseFloat(sidetoneVolumeSlider.value);
    const now = audioCtx.currentTime;

    oscillator.type = waveformType || "sine";
    oscillator.frequency.setValueAtTime(pitch, now);

    gainNode.gain.setValueAtTime(0.0001, now); // start silent
    gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01); // smooth fade in
    gainNode.gain.setValueAtTime(volume, now + duration / 1000 - 0.02); // hold
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000); // smooth fade out

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(now);
    oscillator.stop(now + duration / 1000 + 0.02); // let it fade out fully
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

morseOutputClearBtn.addEventListener("click", () => {
  morseOutputField.value = "";
});

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

// Touch for mobile paddles
document.getElementById("dit-indicator").addEventListener("touchstart", (e) => {
  e.preventDefault();
  playDit();
});

document.getElementById("dah-indicator").addEventListener("touchstart", (e) => {
  e.preventDefault();
  playDah();
});

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

// Block right-click menu inside paddle zone
document
  .getElementById("paddle-zone")
  .addEventListener("contextmenu", (e) => e.preventDefault());

wpmSlider.addEventListener("input", () => {
  document.getElementById("wpm").textContent = wpmSlider.value;
});

farnsworthSlider.addEventListener("input", () => {
  document.getElementById("farnsworth").textContent =
    farnsworthSlider.value;
});

// Save settings when user changes controls
sidetoneVolumeSlider.addEventListener("input", () => {
  localStorage.setItem("cw_volume", sidetoneVolumeSlider.value);
});

sidetonePitchSlider.addEventListener("input", () => {
  localStorage.setItem("cw_pitch", sidetonePitchSlider.value);
});

wpmSlider.addEventListener("input", () => {
  localStorage.setItem("cw_wpm", wpmSlider.value);
});

farnsworthSlider.addEventListener("input", () => {
  localStorage.setItem("cw_farnsworth", farnsworthSlider.value);
});

function playMorseCodeSequence(codeStr) {
  const { ditLength } = getTiming();
  const gap = ditLength; // Inter-element space
  const symbols = codeStr.trim().split(" "); // `· - · ·` → ["·", "-", "·", "·"]
  let delay = 0;

  symbols.forEach((sym) => {
    setTimeout(() => {
      if (sym === "·") {
        playDit();
      } else if (sym === "-") {
        playDah();
      }
    }, delay);
    delay += (sym === "-" ? ditLength * 3 : ditLength) + gap;
  });
}

// Restore saved settings
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("cw_volume")) {
    sidetoneVolumeSlider.value = localStorage.getItem("cw_volume");
  }

  if (localStorage.getItem("cw_pitch")) {
    sidetonePitchSlider.value = localStorage.getItem("cw_pitch");
  }

  if (localStorage.getItem("cw_wpm")) {
    wpmSlider.value = localStorage.getItem("cw_wpm");
  }

  if (localStorage.getItem("cw_farnsworth")) {
    farnsworthSlider.value = localStorage.getItem("cw_farnsworth");
  }

    const lettersAtoMContainer = document.querySelector(".letters_1");
    lettersAtoMContainer.innerHTML = ""; // Clear loading text
    lettersAtoM.forEach((item) => {
      const el = item.build("p", playMorseCodeSequence);
      el.classList.add("cw-character");
      lettersAtoMContainer.appendChild(el);
    });

  const lettersNtoZContainer = document.querySelector(".letters_2");
  lettersNtoZContainer.innerHTML = ""; // Clear loading text
  lettersNtoZ.forEach((item) => {
    const el = item.build("p", playMorseCodeSequence);
    el.classList.add("cw-character");
    lettersNtoZContainer.appendChild(el);
  });

  const numbersContainer = document.querySelector(".numbers");
  numbersContainer.innerHTML = ""; // Clear loading text
  numbers.forEach((item) => {
    const el = item.build("p", playMorseCodeSequence);
    el.classList.add("cw-character");
    numbersContainer.appendChild(el);
  });

  const symbolsContainer = document.querySelector(".symbols");
  symbolsContainer.innerHTML = ""; // Clear loading text
  symbols.forEach((item) => {
    const el = item.build("p", playMorseCodeSequence);
    el.classList.add("cw-character");
    symbolsContainer.appendChild(el);
  });
});

const previewCanvas = document.getElementById('waveform-preview');
const ctx = previewCanvas.getContext('2d');

function drawWaveformPreview(type = 'sine') {
    const width = previewCanvas.width;
    const height = previewCanvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 2;

    const step = width / 100;
    const mid = height / 2;
    const amp = height / 2.5;

    for (let x = 0; x <= width; x += step) {
        const t = x / width; // time (0 to 1)
        let y;

        switch (type) {
            case 'square':
                y = (t % 1) < 0.5 ? -1 : 1;
                break;
            case 'triangle':
                y = 2 * Math.abs(2 * (t - Math.floor(t + 0.5))) - 1;
                break;
            case 'sawtooth':
                y = 2 * (t - Math.floor(t + 0.5));
                break;
            case 'sine':
            default:
                y = Math.sin(t * 2 * Math.PI * 4); // 4 cycles
                break;
        }

        const drawY = mid - y * amp;

        if (x === 0) {
            ctx.moveTo(x, drawY);
        } else {
            ctx.lineTo(x, drawY);
        }
    }

    ctx.stroke();
}
drawWaveformPreview(waveformType);