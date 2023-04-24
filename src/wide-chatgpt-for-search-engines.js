// ==UserScript==
// @name         wide-chatgpt-for-search-engines
// @namespace    krk
// @version      1
// @description  Widens the ChatGPT for Search Engines extension output on the Google Search page
// @match        https://*.google.com/*
// @grant        none
// ==/UserScript==

function wideChatGptForSearchEngines()
{
    // Select the target element
    const rcntSelector = '.main > #cnt > #rcnt';
    const rcnt = document.querySelector(rcntSelector);
    let observer;

    // Define a function to handle changes to the target element
    function handleChanges() {

        if (observer == null)
        {
            return;
        }

        // Apply CSS styles
        //console.log(`changing ${rcntSelector}`);
        rcnt.style.setProperty('min-width', '90%', 'important');
        rcnt.style.setProperty('max-width', '90%', 'important');
        rcnt.style.setProperty('width', '90%', 'important');

        const rhs = rcnt.querySelector('#rhs');
        if (rhs != null)
        {
            //console.log('changing #rhs');
            rhs.style.setProperty('flex', '1 auto', 'important');
        }

        const s = rcnt.querySelector('section.chat-gpt-container');
        if (s != null)
        {
            // for some reason the extension authors chose to set this to the highest possible z-index, which causes it to appear over the autocomplete from the search textbox
            s.style.setProperty('z-index', 5, 'important');

            observer.disconnect();
        }
    }

    if (rcnt != null)
    {
        // Create a new MutationObserver
        observer = new MutationObserver(handleChanges);

        // Configure the MutationObserver to watch for changes to the entire document
        const config = { attributes: true, childList: true, subtree: true };

        // Start observing the document
        //console.log('observer.observe');
        observer.observe(rcnt, config);
    }

    // Call the handleChanges function initially
    handleChanges();
}

(function() {

    'use strict';

    wideChatGptForSearchEngines();

})();