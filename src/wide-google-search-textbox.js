// ==UserScript==
// @name         wide-google-search-textbox
// @namespace    krk
// @version      1
// @description  Widens the search textbox on the Google Search page
// @match        https://*.google.com/search*
// @grant        none
// ==/UserScript==

let alreadyWide = false;

function setFlexAndAutoExpand(el)
{
    el?.style.setProperty('display', 'flex');
    el?.style.setProperty('flex', '1 1 auto');
}

function setWidth(el, width)
{
    el?.style.setProperty('width', width);
}

function setTop(el, top)
{
    if (el == null || top === '0px')
    {
        return;
    }

    el.style.setProperty('top', top, 'important');
}

function getAbsoluteTopBelow(el)
{
    const elTop = el?.clientTop ?? 0;
    const elHeight = el?.clientHeight ?? 0;
    return `${elTop + elHeight}px`;
}

function wideSearchTextbox()
{
    const form = document.querySelector('form');
    setFlexAndAutoExpand(form);

    const formDiv = form.querySelector('div:nth-child(1)');
    setFlexAndAutoExpand(formDiv);

    const formDivDiv = formDiv.querySelector('div:nth-child(1)');
    setFlexAndAutoExpand(formDivDiv);

    const formDivDivDiv2 = formDivDiv.querySelector('div:nth-child(2)');
    setFlexAndAutoExpand(formDivDivDiv2, '100%');

    return formDivDiv;
}

function adjustAutoComplete(formDivDiv)
{
    const formDivDivDiv2 = formDivDiv.querySelector('div:nth-child(2)');
    const formDivDivDiv3 = formDivDivDiv2.nextSibling;
    const top = getAbsoluteTopBelow(formDivDivDiv2);

    let observer;
    function handleChanges()
    {
        if (observer == null)
        {
            return;
        }

        setTop(formDivDivDiv3, top);
    }

    if (formDivDiv != null)
    {
        // Create a new MutationObserver
        observer = new MutationObserver(handleChanges);

        // Configure the MutationObserver to watch for changes to the entire document
        const config = { attributes: true, childList: true, subtree: true };

        // Start observing the document
        //console.log('observer.observe');
        observer.observe(formDivDiv, config);
    }

    // Call the handleChanges function initially
    handleChanges();
}

(function ()
{
    'use strict';

    if (alreadyWide)
    {
        return;
    }

    alreadyWide = true;

    const formDivDiv = wideSearchTextbox();

    adjustAutoComplete(formDivDiv);

})();