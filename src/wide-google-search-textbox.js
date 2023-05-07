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

class GoogleSearchPage
{
    alreadyWide = false;
    observer;
    isImagePage = document.querySelector('body > c-wiz') != null;

    formParent;
    form;

    // for some reason, the image search page doesn't have the autocomplete dropdown, so these two properties don't apply to the imge search page
    textarea;
    textareaThirdAncestor;

    setFlexAndAutoExpand(el)
    {
        el?.style?.setProperty('display', 'flex');
        el?.style?.setProperty('flex', '1 1 auto');
    }

    widenSearchTextbox()
    {
        this.alreadyWide = true;

        this.formParent = document.querySelector('div:has(> form)');
        this.form = this.formParent.querySelector('form');

        return this.isImagePage ? this.widenImageSearchTextbox() : this.widenNormalSearchTextbox();
    }

    widenImageSearchTextbox()
    {
        const divJsController = this.form.querySelector('div[jscontroller]');
        const divJsControllerSecondChild = divJsController.querySelector('div:nth-child(2)');

        this.setFlexAndAutoExpand(this.formParent);
        this.setFlexAndAutoExpand(this.form);
        this.setFlexAndAutoExpand(divJsController);
        this.setFlexAndAutoExpand(divJsControllerSecondChild);

        return divJsController;
    }

    widenNormalSearchTextbox()
    {
        const divJsModelFirstChild = this.form.querySelector('div[jsmodel]:nth-child(1)');
        const divJsControllerFirstChild = divJsModelFirstChild.querySelector('div[jscontroller]:nth-child(1)');
        this.textarea = divJsControllerFirstChild.querySelector('textarea');
        this.textareaThirdAncestor = this.textarea?.parentElement?.parentElement?.parentElement;

        this.setFlexAndAutoExpand(this.form);
        this.setFlexAndAutoExpand(divJsModelFirstChild);
        this.setFlexAndAutoExpand(divJsControllerFirstChild);
        this.setFlexAndAutoExpand(this.textareaThirdAncestor);

        return divJsControllerFirstChild;
    }

    adjustAutoComplete(divToObserve)
    {
        if (this.isImagePage) // for some reason, the image search page doesn't have the autocomplete dropdown
        {
            return;
        }

        const widenedDiv = this.textareaThirdAncestor;
        const targetDiv = widenedDiv?.nextSibling;

        const top = `${(widenedDiv?.clientTop ?? 0) + (widenedDiv?.clientHeight ?? 0)}px`;

        if (divToObserve != null)
        {
            this.observer = new MutationObserver(this.autoCompleteHandleChanges);
            this.observer.observe(divToObserve, { attributes: true, childList: true, subtree: true });
        }

        this.autoCompleteHandleChanges(widenedDiv, targetDiv, top);
    }

    autoCompleteHandleChanges(widenedDiv, targetDiv, top)
    {
        if (this.observer == null)
        {
            return;
        }

        targetDiv?.style?.setProperty('position', 'absolute');
        targetDiv?.style?.setProperty('width', `${widenedDiv?.clientWidth ?? 0}px`);

        if (top !== '0px')
        {
            targetDiv?.style?.setProperty('top', top, 'important');
            targetDiv?.style?.setProperty('margin-top', '-3px', 'important');
        }
    }
}

let g = new GoogleSearchPage();

(function ()
{
    'use strict';

    if (!g.alreadyWide)
    {
        const divToObserve = g.widenSearchTextbox();
        g.adjustAutoComplete(divToObserve);
    }

})();