class AboutLink {
    constructor(name, url, ariaLabel, title, targetBlank=true, rel="noopener noreferrer") {
        this.name = name;
        this.url = url;
        this.ariaLabel = ariaLabel;
        this.title = title;
        this.targetBlank = targetBlank;
        this.rel = rel;
    }

    build() {
        const li = document.createElement("li");
        li.textContent = this.name;
        const a = document.createElement("a");
        const icon = document.createElement("sl-icon");
        icon.classList.add("sl-icon");
        icon.setAttribute("name", "box-arrow-up-right");
        a.href = this.url;
        a.setAttribute("aria-label", this.ariaLabel);
        a.title = this.title;
        if (this.target) {
            a.target = "_blank";
        }
        if (this.rel) {
            a.rel = this.rel;
        }
        a.appendChild(icon);
        li.appendChild(a);
        return li;
    }
}

const interestLinks = [
    new AboutLink(
        "Parks on the Air® (POTA)",
        "https://parksontheair.com/",
        "Link to POTA",
        "Parks on the Air® Website"
    ),
    new AboutLink(
        "CW (Morse Code)",
        "https://www.aa9pw.com/morsecode/morse-code-alphabet/",
        "Link to information about Morse code",
        "Morse Code Information Website"
    ),
    new AboutLink(
        "QRP (low-powered operations)",
        "https://wd8rif.com/what_is_qrp.htm",
        "Link to information about QRP",
        "QRP Information Website"
    ),
    new AboutLink(
        "FT8 (a digital mode for making contacts with low signal-to-noise ratio)",
        "https://youtube.com/shorts/YRTdtGhbk9M?si=8tvjLHWG_Pcu5YWm",
        "Link to information about FT8",
        "FT8 Information Video"
    ),
];

const gearLinks = [
    new AboutLink(
        "QMX 5-band",
        "https://shop.qrp-labs.com/qmx",
        "Link to QMX 5-band transceiver",
        "QMX 5-band Transceiver Product Page"
    ),
    new AboutLink(
        "CWMorse Outdoor Double Paddle Key",
        "https://cwmorse.us/products/outdoor-pocket-double-paddle-morse-code-key",
        "Link to CWMorse Outdoor Double Paddle Key",
        "CWMorse Outdoor Double Paddle Key Product Page"
    ),
    new AboutLink(
        "Putikeeg Mini Straight Key",
        "https://www.amazon.com/dp/B0CZH8BHV9?ref_=ppx_hzsearch_conn_dt_b_fed_asin_title_1&th=1",
        "Link to Putikeeg Mini Straight Key",
        "Putikeeg Mini Straight Key Product Page"
    ),
    new AboutLink(
        "Homemade end-fed half-wave antenna",
        "https://www.youtube.com/watch?v=AfWvdS8uiLs",
        "Link to end-fed half-wave antenna build video",
        "End-Fed Half-Wave Antenna Build Video"
    ),
]

const clubLinks = [
    new AboutLink(
        "Lake Cumberland Amateur Radio Association (LCARA)",
        "https://lcara.org/",
        "Link to LCARA",
        "Lake Cumberland Amateur Radio Association Website"
    ),
    new AboutLink(
        "Long Island CW Club (LICW)",
        "https://licw.org/",
        "Link to LICW",
        "Long Island CW Club Website"
    ),
    new AboutLink(
        "American Radio Relay League (ARRL)",
        "https://www.arrl.org/",
        "Link to the ARRL",
        "American Radio Relay League Website"
    ),
    new AboutLink(
        "North American QRP CW Club (NAQCC)",
        "https://naqcc.info/",
        "Link to the NAQCC",
        "North American QRP CW Club Website"
    ),
];

export { interestLinks, gearLinks, clubLinks };