// ==UserScript==
// @name         wide-google-search-textbox
// @namespace    krk
// @version      1
// @description  Widens the search textbox on the Google Search page
// @match        https://*.google.com/search*
// @grant        none
// ==/UserScript==

//
// This is less than ideal, so if anyone wants to submit a PR with a better approach that'd be just swell.
//

let alreadyWide = false;
let isImage = false;

function setPosition(el, position)
{
    el?.style?.setProperty('position', position);
}

function setFlexAndAutoExpand(el)
{
    el?.style?.setProperty('display', 'flex');
    el?.style?.setProperty('flex', '1 1 auto');
}

function setFlexAndAutoExpandAll(selectorArray)
{
    selectorArray.forEach(selector =>
    {
        setFlexAndAutoExpand(document.querySelector(selector));
    });
}

function getWidth(el)
{
    return `${el?.clientWidth ?? 0}px`;
}

function setWidth(el, width)
{
    el?.style?.setProperty('width', width);
}

function setTop(el, top)
{
    if (top === '0px')
    {
        return;
    }

    el?.style?.setProperty('top', top, 'important');
}

function setMarginTop(el, top)
{
    if (top === '0px')
    {
        return;
    }

    el?.style?.setProperty('top', top, 'important');
}

function getAbsoluteTopBelow(el)
{
    const elTop = el?.clientTop ?? 0;
    const elHeight = el?.clientHeight ?? 0;
    return `${elTop + elHeight}px`;
}

function wideSearchTextbox()
{
    let elArray;
    let selector;

    if (isImage)
    {
        elArray = [
            '#kO001e > div:nth-child(2) > div > div:nth-child(1)',
            'form',
            'form > div[jscontroller]',
            'form > div[jscontroller] > div:nth-child(2)'
        ];

        selector = 'form > div[jscontroller]';
    }
    else
    {
        elArray = [
            'form',
            'form > div[jsmodel]:nth-child(1)',
            'form > div[jsmodel]:nth-child(1) > div[jscontroller]:nth-child(1)',
            'form > div[jsmodel]:nth-child(1) > div[jscontroller]:nth-child(1) > div:nth-child(2)'
        ];

        selector = 'form > div[jsmodel]:nth-child(1) > div[jscontroller]:nth-child(1)';
    }

    setFlexAndAutoExpandAll(elArray);

    return document.querySelector(selector);
}

function adjustAutoComplete(jscontrollerDiv)
{
    const widenedDiv = jscontrollerDiv.querySelector('div:nth-child(2)');
    const targetDiv = widenedDiv.nextSibling;
    const top = getAbsoluteTopBelow(widenedDiv);

    let observer;
    function handleChanges()
    {
        if (observer == null)
        {
            return;
        }

        setPosition(targetDiv, 'absolute');
        setTop(targetDiv, top);
        const width = getWidth(widenedDiv);
        setWidth(targetDiv, width);
        setMarginTop(el, '-3px');
    }

    if (jscontrollerDiv != null)
    {
        observer = new MutationObserver(handleChanges);
        observer.observe(jscontrollerDiv, { attributes: true, childList: true, subtree: true });
    }

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
    isImage = document.querySelector('body > c-wiz') != null;

    const jscontrollerDiv = wideSearchTextbox();

    adjustAutoComplete(jscontrollerDiv);

})();