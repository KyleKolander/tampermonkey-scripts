// ==UserScript==
// @name         ado-pipelines-hide-appsec
// @namespace    krk
// @version      1
// @description  Hides the AppSec pipelines
// @match        https://dev.azure.com/CSGDevOpsAutomation/MnM/_build
// @grant        none
// ==/UserScript==

function hideAppSecPipelines()
{
    const tbodySelector = 'tbody:has(a td div.flex-row > span.inline-flex-row > span.text-ellipsis)';
    let tbody = document.querySelector(tbodySelector);
    let observer;

    // Define a function to handle changes to the target element
    function handleChanges()
    {
        if (observer == null)
        {
            return;
        }


        tbody = document.querySelector(tbodySelector);

        if (tbody == null)
        {
            return;
        }

        const pipelineRows = tbody.querySelectorAll('a:has(td div.flex-row > span.inline-flex-row > span.text-ellipsis)');
        if (pipelineRows == null)
        {
            return;
        }

        //console.info(`${pipelineRows.length} rows`);
        for (let i = pipelineRows.length - 1; i >= 0; i--)
        {
            const pipelineRow = pipelineRows[i];
            const pipelineSpan = pipelineRow.querySelector('td div.flex-row > span.inline-flex-row > span.text-ellipsis');
            const text = pipelineSpan.textContent.trim().toLowerCase();
            //console.info(`text=${text}`);
            if (text.startsWith('appsec-') === false)
            {
                continue;
            }

            //console.info(`found appsec`);

            // if (pipelineRow.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
            // {
            const parent = pipelineRow.parentElement;

            try
            {
                //parent.removeChild(pipelineRow);
                //pipelineRow.remove();
                //pipelineRow.style.display = 'none !important';
                pipelineRow.style.setProperty('display', 'none', 'important');
                //console.info(`removed pipelineRow ${i} with text: ${text}`);
            }
            catch (e)
            {
                console.error(e);
            }
            // }
            // else
            // {
            //     console.info(`can't remove pipelineRow ${i} because it's not visible`);
            // }
        }
    }

    if (tbody != null)
    {
        // Create a new MutationObserver
        observer = new MutationObserver(handleChanges);

        // Configure the MutationObserver to watch for changes to the entire document
        const config = { attributes: true, childList: true, subtree: true };

        // Start observing the document
        const body = document.querySelector('body');
        observer.observe(body, config);
    }

    // Call the handleChanges function initially
    handleChanges();
}

(function ()
{

    'use strict';

    hideAppSecPipelines();

})();
