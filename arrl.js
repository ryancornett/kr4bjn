const scheduleText = {
    "between": "Transmissions resume at 9:00 AM",
    "weekend": "Transmissions resume at 10:00 AM Monday.",
    "backAt4": "Check back at 4:00 PM",
    "vot": "Visiting Operator Time",
    "fastCode": "Fast CW Practice",
    "slowCode": "Slow CW Practice",
    "digital": "Digital Bulletin",
    "voice": "Voice Bulletin",
    "code": "Code Bulletin"
}

const monday = {
    "outsideHours": scheduleText.weekend,
    345: "Check back at 4:00 PM",
    400: scheduleText.fastCode,
    700: scheduleText.slowCode,
    1000: scheduleText.fastCode,
}
const oddDay = {
    900: scheduleText.fastCode,
    345: "Check back at 4:00 PM",
    400: scheduleText.slowCode,
    700: scheduleText.fastCode,
    1000: scheduleText.slowCode,
}
const evenDay = {
    900: scheduleText.slowCode,
    345: "Check back at 4:00 PM",
    400: scheduleText.fastCode,
    700: scheduleText.slowCode,
    1000: scheduleText.fastCode,
}

function getARRLDisplayData(obj) {
    console.log(obj);
    if (obj.timeCategory === "error") {
        return {
            "transmitting": false,
            "details": "An error occurred."
        }
    }
    if (obj.day === "saturday" || obj.day === "sunday") {
        return {
            "transmitting": false,
            "details": scheduleText.weekend
        };
    } else if (obj.timeCategory == 345) {
        return {
            "transmitting": false,
            "details": scheduleText.backAt4
        };
    }
    else if (obj.timeCategory == "outsideHours" && obj.day != "monday") {
        return {
            "transmitting": false,
            "details": scheduleText.between
        };
    } else if (obj.timeCategory == "vot") {
        return {
            "transmitting": true,
            "details": scheduleText.vot
        };
    } else if (obj.timeCategory == "voice") {
        return {
            "transmitting": true,
            "details": scheduleText.voice
        };
    } else if (obj.timeCategory == "code") {
        return {
            "transmitting": true,
            "details": scheduleText.code
        };
    } else if (obj.timeCategory == "digital") {
        return {
            "transmitting": true,
            "details": scheduleText.digital
        };
    } else {
        switch (obj.day) {
            case "monday":
                if (obj.timeCategory === 900) {
                    return {
                        "transmitting": false,
                        "details": scheduleText.weekend
                    }
                } else return {
                    "transmitting": true,
                    "details": monday[obj.timeCategory]
                };

            case "tuesday":
                return {
                    "transmitting": true,
                    "details": evenDay[obj.timeCategory]
                };
                
            case "wednesday":
                    return {
                        "transmitting": true,
                        "details": oddDay[obj.timeCategory]
                    };
            
            case "thursday":
                return {
                    "transmitting": true,
                    "details": evenDay[obj.timeCategory]
                };

            case "friday":
                return {
                    "transmitting": true,
                    "details": oddDay[obj.timeCategory]
                };

            default:
                return "An unexpected error occurred."
        }
    }
}

export { getARRLDisplayData };