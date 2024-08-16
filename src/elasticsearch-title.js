// ==UserScript==
// @name         elasticsearch-title
// @namespace    krk
// @version      1
// @description  Changes the tab title to more concisely convey information about the page
// @match        https://*.csgedirect.com:9200/*
// @grant        none
// @noframes
// ==/UserScript==

function lockDocumentTitle()
{

    // extract the initial value
    var actualTitle = document.title;

    // override the property to always have that value
    Object.defineProperty(document, 'title', {
        value: actualTitle,
        /*
        By default:
          - not enumerable
          - not configurable
          - not writable
        */
    });
}

(function ()
{
    'use strict';

    const u = new URL(document.URL);
    const h = u.hostname;
    const p = u.pathname;

    const pathTokens = p.split('/').filter(Boolean);

    if (pathTokens.length == 1)
    {
        return;
    }

    const hostTokens = h.split('.').filter(Boolean);
    const hostToken0 = hostTokens[0];
    const subdomainTokens = hostToken0.split('-').filter(Boolean);
    const isMonitoring = subdomainTokens.includes('monitor');
    const monitoring = isMonitoring ? '_mon' : '';
    const environment = subdomainTokens[subdomainTokens.length - 1].replace('stathub', 'prod')
        .replace('monitor', 'prod')
        .replace('pre', 'cte')
        .replace('unittest', 'test')
        .replace('aiqa', 'dev');

    if (pathTokens.length == 0)
    {
        document.title = `${environment}${monitoring} - es`;
        return;
    }

    let token0 = pathTokens.length == 0 ? '' : pathTokens[0];

    if (token0 != '_cat' && token0 != '_cluster')
    {
        return;
    }

    token0 = token0.replace('_', '');

    const token1 = pathTokens.length < 2 ? '' : pathTokens[1];

    let name = `${environment}${monitoring} - es - ${token0} ${token1}`;

    document.title = name;
    lockDocumentTitle();
    console.log(name);
})();
