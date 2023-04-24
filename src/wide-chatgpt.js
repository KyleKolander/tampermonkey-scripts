// ==UserScript==
// @name         wide-chatgpt
// @namespace    krk
// @version      1
// @description  Widens the output from ChatGPT to use the full width of the page
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`

body > div > div > div:nth-child(2) {
    width: calc(100% - 260px) !important;
}

div.group > .text-base {
    max-width: 98% !important;
}

.m-auto {
    margin: auto 0 !important;
}

.overflow-hidden {
    overflow-x: unset !important;
    overflow-y: hidden;
}

/* ChatGPT for Search Engines - Prompt Templates */
.chatgpt-button-shared {
    display: none;
}

`);