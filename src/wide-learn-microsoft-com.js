// ==UserScript==
// @name         wide-learn-microsoft-com
// @namespace    krk
// @version      1
// @description  Widens the content to use the full width of the page
// @match        https://learn.microsoft.com/*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`

.mainContainer {
    max-width: 100% !important;
    width: 100% !important;
}

.left-container {
    padding-left: 2.25rem !important;
}

.is-one-quarter-desktop {
    width: 15% !important;
}

.is-three-quarters-desktop {
    width: 85% !important;
    padding-right: 2.25rem !important;
}

.column.is-4-desktop {
    width: 20% !important;
}

.column.is-8-desktop {
    width: 80% !important;
}

.bolt-checkmark {
    border-color: #a7a7a6 !important;
}

`);