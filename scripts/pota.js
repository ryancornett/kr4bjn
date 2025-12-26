const regionalActivations = [];

// GET THE DATA FROM POTA

const potaActivationsUrl = 'https://api.pota.app/activation';
let activations;

async function getPotaActivations() {
    try {
      const response = await fetch(potaActivationsUrl);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      activations = await response.json();
    } catch (error) {
      console.error(error.message);
    }
}

// STORE ONLY THE REGIONAL ACTIVATIONS

async function getRegionalActivations() {
    await getPotaActivations();
    activations.forEach(activation => {
        if (activation.locationDesc == "US-KY"
            || activation.locationDesc == "US-VA"
            || activation.locationDesc == "US-TN"
            || activation.locationDesc == "US-NC"
            || activation.locationDesc == "US-WV"
            || activation.locationDesc == "US-GA"
            || activation.locationDesc == "US-FL"
            || activation.locationDesc == "US-AL"
            || activation.locationDesc == "US-MS"
            || activation.locationDesc == "US-IN"
            || activation.locationDesc == "US-IL"
            || activation.locationDesc == "US-MO"
            || activation.locationDesc == "US-AR"
            || activation.locationDesc == "US-OH") {
            regionalActivations.push(activation);
        }
    });
};

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const dd = String(today.getDate()).padStart(2, '0');
const todayStr = `${yyyy}-${mm}-${dd}`;

// GET THE DATA READY TO DISPLAY

const cardHolder = document.querySelector('.cards');

function populateActivationCards() {
    const upcomingActivations = regionalActivations.filter(act => act.startDate >= todayStr);
    upcomingActivations.forEach(activation => {
        const card = document.createElement('div');
        card.classList.add('card');
            // CARD HEADER
            const header = document.createElement('div');
            header.classList.add('card-header');
                const activator = document.createElement('a');
                activator.classList.add('card-activator');
                activator.textContent = activation.activator;
                activator.href = `https://pota.app/#/profile/${activation.activator}`;
                activator.target = "_blank";
                activator.rel = "noopener";
                header.appendChild(activator);
                
                const reference = document.createElement('a');
                reference.classList.add('card-reference');
                reference.textContent = activation.reference;
                reference.href = `https://pota.app/#/park/${activation.reference}`;
                reference.target = "_blank";
                reference.rel = "noopener";
                header.appendChild(reference);
            card.appendChild(header);
            // CARD BODY
            const body = document.createElement('div');
                // REFERENCE AND NAME ROW
                const infoRow = document.createElement('div');
                infoRow.classList.add('card-info-row');
                    const locationIcon = document.createElement('img');
                    locationIcon.classList.add('pota-png');
                    locationIcon.src = "img/location-icon.png";
                    locationIcon.alt = "Location icon";
                    infoRow.appendChild(locationIcon);
                    const infoRowText = document.createElement('div');
                    infoRowText.textContent = `${activation.reference} - ${activation.name}`;
                    infoRow.appendChild(infoRowText);
                body.appendChild(infoRow);

                // STATE ROW
                const stateRow = document.createElement('div');
                stateRow.classList.add('card-state-row');
                        const stateIcon = document.createElement('img');
                        stateIcon.classList.add('pota-png');
                        stateIcon.src = "img/star-icon.png";
                        stateIcon.alt = "State icon";
                    stateRow.appendChild(stateIcon);
                        const stateRowRight = document.createElement('div');
                            stateRowRight.textContent = activation.locationDesc;
                    stateRow.appendChild(stateRowRight);
                body.appendChild(stateRow);

                // FREQUENCY ROW
                const frequencyRow = document.createElement('div');
                frequencyRow.classList.add('card-state-row');
                        const dialIcon = document.createElement('img');
                        dialIcon.classList.add('pota-png');
                        dialIcon.src = "img/dial-icon.png";
                        dialIcon.alt = "Tuning dial icon";
                    frequencyRow.appendChild(dialIcon);
                        const frequencyRowRight = document.createElement('div');
                            frequencyRowRight.textContent =
                            activation.frequencies == "None" || activation.frequencies == "" || activation.frequencies == null
                            ? "No frequency given" : activation.frequencies;
                    frequencyRow.appendChild(frequencyRowRight);
                body.appendChild(frequencyRow);
                
                // UTC ROW
                const utcRow = document.createElement('div');
                utcRow.classList.add('card-state-row');
                        const utcIcon = document.createElement('img');
                        utcIcon.classList.add('pota-png');
                        utcIcon.src = "img/utc-icon.png";
                        utcIcon.alt = "Clock icon";
                    utcRow.appendChild(utcIcon);
                        const utcRowRight = document.createElement('div');
                            utcRowRight.textContent = `${activation.startDate.substring(5)} ${activation.startTime} UTC`;
                    utcRow.appendChild(utcRowRight);
                body.appendChild(utcRow);            

            card.appendChild(body);
            // CARD FOOTER
            const cardFooter = document.createElement('div');
            cardFooter.classList.add('card-footer');
            cardFooter.textContent = activation.comments == "" || activation.comments == null
            ? "No additional information provided" : activation.comments;
            card.appendChild(cardFooter);
        cardHolder.appendChild(card);
    })
}


async function displayData() {
    await getRegionalActivations();
    cardHolder.innerHTML = "";
    populateActivationCards();
}

setTimeout(await displayData, 3000);