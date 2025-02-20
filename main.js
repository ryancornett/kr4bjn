import { bibleVerses } from "./bible.js";

const verseText = document.getElementById('verse-text');
const verseRef = document.getElementById('verse-ref');
const verse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
verseText.textContent = verse.text;
verseRef.textContent = `${verse.book} ${verse.chapter}:${verse.verses} BSB`;

