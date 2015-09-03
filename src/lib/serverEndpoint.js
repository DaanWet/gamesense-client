/**
 * The server endpoint configuration.
 * @param {string} [url] URL to the HTTP server, like http://127.0.0.1:51248
 * @constructor
 */
gamesense.ServerEndpoint = function ServerEndpoint(url) {
    'use strict';

    /**
     * @type {gamesense.ServerEndpoint}
     */
    var self = this;

    var fs = require('fs');

    /**
     * @type {string}
     */
    this.url = url;

    /**
     * @type {?string}
     */
    this.baseUrl = null;

    /**
     * @type {?string}
     */
    this.host = null;

    /**
     * @type {?number}
     */
    this.port = null;

    /**
     * Constructor
     */
    function constructor() {
        if (url) {
            extractHostAndPortFromUrl(url);
        }
    }

    /**
     * Discover the GameSense(TM) server via the coreProps.json file.
     * This file can be found in one of these locations, depending on OS:
     * OSX | /Library/Application Support/SteelSeries Engine 3/coreProps.json
     * Windows | %PROGRAMDATA%/SteelSeries/SteelSeries Engine 3/coreProps.json
     */
    this.discoverUrl = function discoverUrl() {
        // TODO: ADD OSX support
        var corePropsFilename = '%PROGRAMDATA%/SteelSeries/SteelSeries Engine 3/coreProps.json';
        var absoluteCorePropsFilename = corePropsFilename.replace(/%([^%]+)%/g, function replaceEnvVariables(ignore, index) {
            return process.env[index];
        });

        var corePropsJson = fs.readFileSync(absoluteCorePropsFilename, {encoding: 'utf-8'});

        if (corePropsJson) {
            var coreProps = JSON.parse(corePropsJson);

            if (coreProps.address) {
                extractHostAndPortFromUrl('http://' + coreProps.address);
            } else {
                throw new Error('Discover url failed: The core props does not contain address property.');
            }
        }
    };

    /**
     * @param {string }url
     */
    function extractHostAndPortFromUrl(url) {
        // Regex from: http://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
        var urlPattern = /(http|ftp|https):\/\/([\w-]+(\.[\w-]*)+)([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/;

        var match = urlPattern.exec(url);

        self.url = url;
        self.baseUrl = url.replace(match[4], '');
        self.host = match[2];
        self.port = parseInt(match[4].replace(':', ''));
    }

    constructor();
};
