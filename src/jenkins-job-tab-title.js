// ==UserScript==
// @name         jenkins-job-tab-title
// @namespace    krk
// @version      1
// @description  Changes the tab title to more concisely convey information about the job
// @include      /^https?://odcsgesmj.*\.csgidev\.com/job.*/
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
    const p = u.pathname;
    const tokens = p.split('/').filter(Boolean);

    if (tokens.length < 2 || tokens[0] != 'job')
    {
        return;
    }

    const regex = /\d\d\.\d\.0\.0\.0/i;
    const job = tokens[1];
    let name = job.replace('Trunk', '').replace('-ACPx-', '').replace('Infrastructure-', '').replace(regex, '').replace('-Chrome', '').replace('-AcceptanceTests', ' Acceptance').replace('-SmokeTest', ' Smoke').replace('-CI', ' CI').replace('-CS', ' CS').replace('-Build-DSM', ' Build DSM').replace('-DSM', ' DSM');

    if (tokens.length > 2)
    {
        let pageType = tokens[2];
        const buildNumber = parseInt(pageType);
        pageType = !Number.isNaN(buildNumber) ? `#${buildNumber}` : pageType;
        name = `${name} ${pageType}`;

        for (let i = 3; i < tokens.length; i++)
        {
            const token = tokens[i];
            name += ` ${token}`;
        }
    }

    document.title = name;
    lockDocumentTitle();
    console.log(name);
})();
