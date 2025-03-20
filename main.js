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