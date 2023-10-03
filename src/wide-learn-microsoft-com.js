// ==UserScript==
// @name         wide-learn-microsoft-com
// @namespace    krk
// @version      1
// @description  Widens the content to use the full width of the page
// @match        https://learn.microsoft.com/*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`

div.mainContainer {
    max-width: 100% !important;
    width: 100% !important;
}

div.is-one-quarter-desktop {
    width: 15% !important;
}

div.is-three-quarters-desktop {
    width: 85% !important;
}

div.column.is-4-desktop {
    width: 20% !important;
}

div.column.is-8-desktop {
    width: 80% !important;
}

`);