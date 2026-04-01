class Item {
  constructor(character, phoneticOrName, codeStr, codeSym) {
    this.character = character;
    this.phoneticOrName = phoneticOrName;
    this.codeStr = codeStr;
    this.codeSym = codeSym;
    this.id = crypto.randomUUID();
  }

  build(htmlElementType, playCallback) {
    const el = document.createElement(htmlElementType);
    el.setAttribute("id", this.id);
    el.setAttribute("title", `${this.character} (${this.phoneticOrName})`);
    el.setAttribute(
      "data-label",
      `${this.character} \u00A0 \u00A0${this.codeSym}`
    );
    el.setAttribute("data-code-str", this.codeStr);
    el.setAttribute("data-code-sym", this.codeSym);
    el.textContent = `${this.character} \u00A0 ${this.codeStr}`;

    el.addEventListener("click", () => {
      if (typeof playCallback === "function") {
        playCallback(this.codeSym);
      }
    });

    return el;
  }
}

const lettersAtoM = [
  new Item("A", "alpha", "di-dah", "· -"),
  new Item("B", "bravo", "dah-di-di-dit", "- · · ·"),
  new Item("C", "charlie", "dah-di-dah-dit", "- · - ·"),
  new Item("D", "delta", "dah-di-dit", "- · ·"),
  new Item("E", "echo", "dit", "·"),
  new Item("F", "foxtrot", "di-di-dah-dit", "· · - ·"),
  new Item("G", "golf", "dah-dah-dit", "- - ·"),
  new Item("H", "hotel", "di-di-di-dit", "· · · ·"),
  new Item("I", "india", "di-dit", "· ·"),
  new Item("J", "juliet", "di-dah-dah-dah", "· - - -"),
  new Item("K", "kilo", "dah-di-dah", "- · -"),
  new Item("L", "lima", "di-dah-di-dit", "· - · ·"),
  new Item("M", "mike", "dah-dah", "- -"),
];

const lettersNtoZ = [
  new Item("N", "november", "dah-dit", "- ·"),
  new Item("O", "oscar", "dah-dah-dah", "- - -"),
  new Item("P", "papa", "di-dah-dah-dit", "· - - ·"),
  new Item("Q", "quebec", "dah-dah-di-dah", "- - · -"),
  new Item("R", "romeo", "di-dah-dit", "· - ·"),
  new Item("S", "sierra", "di-di-dit", "· · ·"),
  new Item("T", "tango", "dah", "-"),
  new Item("U", "uniform", "di-di-dah", "· · -"),
  new Item("V", "victor", "di-di-di-dah", "· · · -"),
  new Item("W", "whiskey", "di-dah-dah", "· - -"),
  new Item("X", "x-ray", "dah-di-di-dah", "- · · -"),
  new Item("Y", "yankee", "dah-di-dah-dah", "- · - -"),
  new Item("Z", "zulu", "dah-dah-di-dit", "- - · ·"),
];

const numbers = [
  new Item("0", "zero", "dah-dah-dah-dah-dah", "- - - - -"),
  new Item("1", "one", "di-dah-dah-dah-dah", "· - - - -"),
  new Item("2", "two", "di-di-dah-dah-dah", "· · - - -"),
  new Item("3", "three", "di-di-di-dah-dah", "· · · - -"),
  new Item("4", "four", "di-di-di-di-dah", "· · · · -"),
  new Item("5", "five", "di-di-di-di-dit", "· · · · ·"),
  new Item("6", "six", "dah-di-di-di-dit", "- · · · ·"),
  new Item("7", "seven", "dah-dah-di-di-dit", "- - · · ·"),
  new Item("8", "eight", "dah-dah-dah-di-dit", "- - - · ·"),
  new Item("9", "nine", "dah-dah-dah-dah-dit", "- - - - ·"),
];

const symbols = [
  new Item(".", "period", "di-dah-di-dah-di-dah", "· - · - · -"),
  new Item(",", "comma", "dah-dah-di-di-dah-dah", "- - · · - -"),
  new Item("?", "question mark", "di-di-dah-dah-di-dit", "· · - - · ·"),
  new Item("/", "slash", "dah-di-di-dah-dit", "- · · - ·"),
  new Item("<AR> or +", "plus or <AR>", "di-dah-di-dah-dit", "· - · - ·"),
  new Item("<BT> or =", "equals or <BT>", "dah-di-di-di-dah", "- · · · -"),
  new Item("<BK>", "Break", "dah-di-di-di-dah-di-dah", "- · · · - · -"),
  new Item("<KN>", "Go ahead", "dah-di-dah-dah-dit", "- · - - ·"),
  new Item("<SK>", "End of contact", "di-di-di-dah-di-dah", "· · · - · -"),
  new Item("*error*", "error", "di-di-di-di-di-di-di-dit", "· · · · · · · ·"),
];

const qcodes = [
  { name: "QRL", meaning: "Frequency busy(?)" },
  { name: "QRZ", meaning: "Who is calling me?" },
  { name: "QSB", meaning: "Signal fading(?)" },
  { name: "QRM", meaning: "Manmade interference" },
  { name: "QRN", meaning: "Natural interference" },
  { name: "QRO", meaning: "Increase power" },
  { name: "QRP", meaning: "Decrease power/low-powered" },
  { name: "QRQ", meaning: "Send faster" },
  { name: "QRS", meaning: "Send slower" },
  { name: "QTH", meaning: "(What is your) Location(?)" },
  { name: "QRT", meaning: "Stop(ped) sending" },
  { name: "QSL", meaning: "Acknowledge receipt(?)" },
  { name: "QSO", meaning: "Contact or conversation" },
]

const abbreviations = [
  { name: "73", meaning: "Best regards" },
  { name: "72", meaning: "Best regards (when transmitting QRP)" },
  { name: "CQ", meaning: "Calling any station" },
  { name: "DE", meaning: "From or This is" },
  { name: "ES", meaning: "And" },
  { name: "NR", meaning: "Number" },
  { name: "R", meaning: "Received or Roger" },
  { name: "TU", meaning: "Thank you" },
  { name: "PSE", meaning: "Please" },
  { name: "UR", meaning: "You are" },
  { name: "WX", meaning: "Weather" },
  {name: "GM", meaning: "Good morning"},
  {name: "GA", meaning: "Good afternoon"},
  {name: "GE", meaning: "Good evening"},
  { name: "ANT", meaning: "Antenna" },
  { name: "RPT", meaning: "Report" },
  { name: "RST", meaning: "Readability, Signal Strength, Tone (signal report)" },
]

export { Item, lettersAtoM, lettersNtoZ, numbers, symbols, qcodes, abbreviations };
