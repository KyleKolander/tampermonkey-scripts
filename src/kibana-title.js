// ==UserScript==
// @name         kibana-title
// @namespace    krk
// @version      1
// @description  Changes the tab title to more concisely convey information about the page
// @match        https://coordinating.alb.mnm-dev.csgidev.com:5601/app*
// @match        https://monitoring.alb.mnm-dev.csgidev.com:5601/app*
// @match        https://coordinating.alb.mnm-test.csgidev.com:5601/app*
// @match        https://coordinating.alb.mnm-qa.csgidev.com:5601/app*
// @match        https://monitoring.alb.mnm-qa.csgidev.com:5601/app*
// @match        https://coordinating.alb.mnm-cte.csgiprod.com:5601/app*
// @match        https://monitoring.alb.mnm-cte.csgiprod.com:5601/app*
// @match        https://coordinating.alb.mnm-prod.csgiprod.com:5601/app*
// @match        https://monitoring.alb.mnm-prod.csgiprod.com:5601/app*
// @grant        none
// @noframes
// ==/UserScript==

let title = '';
let titleResetting = false;

class Info
{
    constructor(url, clusterType, env)
    {
        this.clusterType = clusterType;
        this.env = env;
        this.isMonitoring = clusterType === 'monitoring';
        this.monitoring = this.isMonitoring ? '_mon' : '';
        this.environment = `${env}${this.monitoring}`;
        this.u = new URL(url);
        this.h = this.u.hostname;
        this.p = this.u.pathname;
        this.pathTokens = this.p.split('/').filter(Boolean);
        this.tokenCount = this.pathTokens.length;
        this.area1 = this.tokenCount > 2 ? this.pathTokens[2] : '';
        this.area2 = this.tokenCount > 3 ? this.pathTokens[3] : '';
        this.area3 = this.tokenCount > 4 ? this.pathTokens[4] : '';
        this.area4 = this.tokenCount > 5 ? this.pathTokens[5] : '';
        this.area5 = this.tokenCount > 6 ? this.pathTokens[6] : '';
    }

    u;
    h;
    p;
    pathTokens = [];
    tokenCount = 0;

    clusterType = '';
    env = '';
    isMonitoring = false;
    monitoring = '';
    environment = '';
    area1 = '';
    area2 = '';
    area3 = '';
    area4 = '';
    area5 = '';

    normalizeClusterName(clusterName)
    {
        if (clusterName.startsWith('marvel'))
        {
            return 'marvel';
        }
        return 'stathub';
    }

    getKibanaArea()
    {
        let area = '';

        if (this.area1 === 'management')
        {
            area = this.getKibanaManagementArea();
        }
        else if (this.area1 === 'dev_tools')
        {
            area = this.getKibanaDevToolsArea();
        }
        else if (this.area1 === 'discover')
        {
            area = this.getKibanaDiscoverArea();
        }
        else if (this.area1 === 'visualize')
        {
            area = this.getKibanaVisualizeArea();
        }
        else if (this.area2 === 'dashboards')
        {
            area = 'dashboards';
        }
        else if (this.area2 === 'dashboard')
        {
            area = this.getKibanaDashboardArea();
        }
        else
        {
            area = `${this.area1} - ${this.area2} - ${this.area3}`;
        }

        return `${this.environment} - kb - ${area}`;
    }

    getMonitoringArea()
    {
        let area = '';

        if (this.area1 === 'home')
        {
            area = 'monitor overview';
        }
        else if (this.area1 == 'overview')
        {
            const clusterName = this.normalizeClusterName(document.querySelector('a[data-test-subj="clusterName"]')?.textContent?.trim() ?? '');
            area = `monitor ${clusterName} overview`;
        }
        else if (this.area1 === 'elasticsearch')
        {
            area = this.getMonitoringElasticsearchArea();
        }
        else if (this.area1 === 'kibana')
        {
            area = this.getMonitoringKibanaArea();
        }

        return `${this.environment} - kb - ${area}`;
    }

    getKibanaManagementArea()
    {
        let area = '';

        if (this.area2 === '')
        {
            area = 'management';
        }
        else if (this.area2 === 'elasticsearch')
        {
            if (this.area3 === 'index_management')
            {
                area = 'index management';
            }
            else if (this.area3 === 'license_management')
            {
                area = 'license management';
            }
            else if (this.area3 === 'watcher')
            {
                area = 'watcher';
            }
        }
        else if (this.area2 === 'kibana')
        {
            if (this.area3 === 'indices')
            {
                if (this.area4 === '')
                {
                    area = 'index patterns';
                }
                else
                {
                    const indexPattern = document.querySelector('h1[data-test-subj="indexPatternTitle"]')?.textContent?.trim() ?? '';
                    area = `index pattern "${indexPattern}"`;
                }
            }
            else if (this.area3 === 'objects')
            {
                area = 'saved objects';
            }
            else if (this.area3 === 'reporting')
            {
                area = 'reports';
            }
            else if (this.area3 === 'settings')
            {
                area = 'settings';
            }
        }
        else if (this.area2 === 'security')
        {
            if (this.area3 === 'users')
            {
                if (this.area4 === '')
                {
                    area = 'users';
                }
                else
                {
                    area = `user "${this.area5}"`;
                }
            }
            else if (this.area3 === 'roles')
            {
                if (this.area4 === '')
                {
                    area = 'roles';
                }
                else
                {
                    area = `role "${this.area5}"`;
                }
            }
        }
        else if (this.area2 === 'logstash')
        {
            if (this.area3 === 'pipelines')
            {
                area = 'logstash pipelines';
            }
        }

        return area;
    }

    getKibanaDevToolsArea()
    {
        let area = '';

        if (this.area2 === 'console')
        {
            area = 'console';
        }
        else if (this.area2 === 'searchprofiler')
        {
            area = 'search profiler';
        }
        else if (this.area2 === 'grokdebugger')
        {
            area = 'grok debugger';
        }

        return area;
    }

    getKibanaDiscoverArea()
    {
        let area = '';

        const indexPattern = 'stathub-qaint-kibana-*'; //document.querySelector('#index_pattern_id')?.textContent?.trim() ?? '';
        if (this.area2 === '')
        {
            area = `discover [${indexPattern}]`;
        }
        else
        {
            const search = 'Kyle - MSO Settings'; //document.querySelector('span[ng-bind="opts.savedSearch.lastSavedTitle"]')?.textContent ?? '';
            area = `discover "${search}"`;
        }

        return area;
    }

    getKibanaVisualizeArea()
    {
        let area = '';

        if (this.area2 === '')
        {
            area = 'visualize';
        }
        else if (this.area2 === 'new')
        {
            area = 'new visualization';

            if (this.area3 === 'configure')
            {
                area = 'configure new visualization';
            }
        }
        else if (this.area2 === 'create')
        {
            const indexPattern = 'stathub-qaint-log-20*'; //document.querySelector('#sidebarIndexPatternTitle')?.textContent?.trim() ?? '';
            area = `visualization [${indexPattern}]`;
        }
        else if (this.area2 === 'edit')
        {
            const search = 'Kyle - IIS Requests by URL Path'; //document.querySelector('div[data-test-subj="breadcrumbPageTitle"]')?.textContent?.trim() ?? '';
            area = `visualization "${search}"`;
        }

        return area;
    }

    getKibanaDashboardArea()
    {
        let area = '';

        if (this.area3 === '')
        {
            area = 'edit new dashboard';
        }
        else
        {
            const dashboard = 'Kyle - demo'; //document.querySelector('div[data-test-subj="breadcrumbs"] > div:last-of-type')?.textContent?.trim() ?? '';
            area = `dashboard "${dashboard}"`;
        }

        return area;
    }

    getMonitoringElasticsearchArea()
    {
        let area = '';

        const breadCrumbs = Array.from(document.querySelectorAll('kbn-top-nav a')).map(a => a?.textContent?.trim() ?? '');
        const breadCrumsCount = breadCrumbs.length;
        const clusterName = this.normalizeClusterName(breadCrumsCount > 1 ? breadCrumbs[1] : '');
        if (this.area2 === '')
        {
            area = `monitor es ${clusterName} overview`;
        }
        else if (this.area2 === 'nodes')
        {
            if (this.area3 === '')
            {
                area = `monitor es ${clusterName} nodes`;
            }
            else
            {
                const nodeName = (document.querySelector('kbn-top-nav span')?.textContent?.trim() ?? '').split('.')[0].replace('ip-', '').replaceAll('-', '.');
                const advanced = this.area4 !== '' ? ` ${this.area4}` : '';
                area = `monitor es ${clusterName} "${nodeName}"${advanced}`;
            }
        }
        else if (this.area2 === 'indices')
        {
            if (this.area3 === '')
            {
                area = `monitor es ${clusterName} indices`;
            }
            else
            {
                const indexName = document.querySelector('kbn-top-nav span')?.textContent?.trim() ?? '';
                const advanced = this.area4 !== '' ? ` ${this.area4}` : '';
                area = `monitor es ${clusterName} "${indexName}"${advanced}`;
            }
        }
        else if (this.area2 === 'ml_jobs')
        {
            area = 'ml jobs';
        }

        return area;
    }

    getMonitoringKibanaArea()
    {
        let area = '';

        const breadCrumbs = Array.from(document.querySelectorAll('kbn-top-nav a')).map(a => a?.textContent?.trim() ?? '');
        const breadCrumsCount = breadCrumbs.length;
        const clusterName = this.normalizeClusterName(breadCrumsCount > 1 ? breadCrumbs[1] : '');
        if (this.area2 === '')
        {
            area = `monitor kb ${clusterName} overview`;
        }
        else if (this.area2 === 'instances')
        {
            if (this.area3 === '')
            {
                area = `monitor kb ${clusterName} instances`;
            }
            else
            {
                const instanceName = (breadCrumsCount > 4 ? breadCrumbs[4] : '').split('.')[0].replace('ip-', '').replaceAll('-', '.');
                area = `monitor kb ${clusterName} "${instanceName}"`;
            }
        }

        return area;
    }
}

// Function to normalize whitespace
function normalizeWhitespace(str)
{
    return str.replace(/\s+/g, ' ').trim();
}

function getTitle()
{
    const regex = /https:\/\/(coordinating|monitoring)\.alb\.mnm-(dev|test|qa|cte|prod)\.csgi(prod|dev)\.com:5601\/app\/(kibana|monitoring).*/;
    const url = document.URL.replace('kibana#', 'kibana').replace('monitoring#', 'monitoring');
    const match = url.match(regex);

    if (!match)
    {
        return '';
    }
    const clusterType = match[1];
    const env = match[2];
    const appType = match[4];
    const isKibana = appType === 'kibana';
    const isMonitoring = appType === 'monitoring';

    if (!isKibana && !isMonitoring)
    {
        return '';
    }

    const info = new Info(url, clusterType, env);

    let title = isKibana ? info.getKibanaArea() : info.getMonitoringArea();
    title = normalizeWhitespace(title);
    return title;
}

(function ()
{
    'use strict';

    title = getTitle();

    if (title === '')
    {
        return;
    }

    function resetTitle()
    {
        titleResetting = true;
        title = getTitle();
        if (document.title !== title)
        {
            document.title = title;
            console.log(`restTitle => ${title}`);
        }
        titleResetting = false;
    }

    // Create a MutationObserver to monitor changes to the <title> element
    const observer = new MutationObserver(function (mutations)
    {
        for (const mutation of mutations)
        {
            if (mutation.type === 'childList' && !titleResetting)
            {
                resetTitle();
            }
        }
    });

    // Configuration of the observer
    const config = {
        childList: true,
        subtree: true
    };

    // Start observing the <title> element
    const titleElement = document.querySelector('title') || document.head.appendChild(document.createElement('title'));
    observer.observe(titleElement, config);

    // Set the title initially
    resetTitle();
})();
