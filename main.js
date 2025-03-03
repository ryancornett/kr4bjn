import { bibleVerses } from "./bible.js";

const verseText = document.getElementById('verse-text');
const verseRef = document.getElementById('verse-ref');
const verse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
verseText.textContent = verse.text;
verseRef.textContent = `${verse.book} ${verse.chapter}:${verse.verses} BSB`;

const year = new Date().getFullYear();
let rights = document.getElementById('rights');
rights.textContent = year == 2025 ? "All rights reserved 2025" : `All rights reserved 2025-${year}`;