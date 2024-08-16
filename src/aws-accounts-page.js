// ==UserScript==
// @name         aws-accounts-page
// @namespace    krk
// @version      1.0
// @description  auto-expand accounts
// @author       Kyle Kolander
// @match        https://csgisso.awsapps.com/start/*
// @grant        none
// ==/UserScript==

let handledButtons = false;

function handleButtons()
{
    if (handledButtons === true)
    {
        return;
    }

    const buttons = document.querySelectorAll('div[data-testid="account-list"] > div > div > button');

    console.info(`Checking for buttons. Found ${buttons.length} button(s).`);

    if (buttons.length > 0)
    {

        handledButtons = true;

        // Stop observing once buttons are found and handled
        observer.disconnect();

        console.info(`buttons = ${buttons}`);

        let buttonsArray = Array.from(buttons).slice(1);
        console.info(`buttonsArray = ${buttonsArray}`);

        const numButtons = buttonsArray.length;
        const buttonsStatus = new Array(numButtons).fill(false);

        console.info(`buttonsStatus = ${buttonsStatus}`);

        let remaining = buttonsStatus.filter(b => !b).length;

        while (remaining > 0)
        {
            for (let i = 0; i < buttonsArray.length; i++)
            {
                if (buttonsStatus[i] === true)
                {
                    continue;
                }

                buttonsStatus[i] = true;

                const b = buttonsArray[i];

                console.info(`Clicking button[${i}]:`, b);

                b.click();
            }

            remaining = buttonsStatus.filter(b => !b).length;
        }
    }
}

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutationsList, observer) =>
{
    console.info('Mutation detected:', mutationsList);

    for (let mutation of mutationsList)
    {
        if (mutation.type === 'childList')
        {
            handleButtons();
        }
    }
});

// Start observing the target node for configured mutations
const targetNode = document.body;
const config = { childList: true, subtree: true };

// Initial check in case the buttons are already available
handleButtons();

// Start observing the DOM for changes
observer.observe(targetNode, config);

console.info('Observer started, waiting for mutations...');

