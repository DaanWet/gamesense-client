/**
 * gamesense-client
 * @version 0.2.0 (2015-09-04)
 * @author Christian Schuller <cschuller@servusalps.com>
 * @license MIT
 */
/*global define:true, exports:true, module:true */
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define['amd']) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.gamesense = factory();
    }
}(this, function() {
/**
 * The root namespace for the eventbus.
 * @namespace cobu
 */
/*eslint-disable no-unused-vars */
var gamesense = {};
/*eslint-enable no-unused-vars */
/**
 * The GameSense(TM) Client
 * @constructor
 * @param {gamesense.Game} game The game.
 * @param {gamesense.ServerEndpoint} endpoint The GameSense(TM) server.
 */
gamesense.GameClient = function GameClient(game, endpoint) {
    'use strict';

    var http = require('http');
    var Promise = require('promise');
    var _ = require('underscore');

    /**
     * The heartbeat interval in seconds.
     * A least one event every 15 seconds is required.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#heartbeatkeepalive-events
     * @type {number}
     */
    var HEARTBEAT_INTERVAL = 10;

    /**
     * @type {?number}
     */
    var heartbeatIntervalId = null;

    /**
     * Register the given game.
     * @returns {Promise} Returns the promise.
     */
    this.registerGame = function registerGame() {
        /*eslint-disable camelcase */
        var data = {
            game: game.name,
            game_display_name: game.displayName,
            icon_color_id: game.iconColor
        };
        /*eslint-enable camelcase */

        return post('/game_metadata', data);
    };

    /**
     * @param {gamesense.GameEvent} gameEvent
     * @returns {Promise} Returns the promise.
     */
    this.registerEvent = function registerEvent(gameEvent) {
        /*eslint-disable camelcase */
        var data = {
            game: game.name,
            event: gameEvent.name,
            min_value: gameEvent.minValue,
            max_value: gameEvent.maxValue,
            icon_id: gameEvent.icon
        };
        /*eslint-enable camelcase */

        return post('/register_game_event', data);
    };

    /**
     * Bind handlers for an event.
     * @param {gamesense.GameEvent} event
     * @param {!Array<gamesense.GameEventHandler>} handlers
     * @returns {Promise} Returns the promise.
     */
    this.bindEvent = function bindEvent(event, handlers) {
        /*eslint-disable camelcase */

        /**
         * @param {!gamesense.GameEventHandler} handler
         * @returns {Object} The gamesense data object representing a handler.
         */
        function toHandlerData(handler) {
            var handlerData = {
                zone: handler.zone,
                color: handler.color,
                mode: handler.mode
            };

            if (handler.deviceType) {
                handlerData['device-type'] = handler.deviceType;
            } else {
                throw new Error('bindEvent failed: Missing device type.');
            }

            if (handler.rate) {
                handlerData.rate = handler.rate;
            }

            if (handler.color.constructor.name === 'GradientColor') {
                handlerData.color = {
                    gradient: handler.color
                };
            } else if (handler.color.constructor.name === 'ColorRanges') {
                handlerData.color = handler.color.ranges;
            }

            if (handler.customZoneKeys) {
                handlerData['custom-zone-keys'] = handler.customZoneKeys;
            }

            return handlerData;
        }

        var data = {
            game: game.name,
            event: event.name,
            min_value: event.minValue,
            max_value: event.maxValue,
            icon_id: event.icon,
            handlers: _.map(handlers, toHandlerData)
        };
        /*eslint-enable camelcase */

        return post('/bind_game_event', data);
    };

    /**
     * @param {gamesense.GameEvent} event
     * @returns {Promise} Returns the promise.
     */
    this.sendGameEventUpdate = function updateGameEvent(event) {
        /*eslint-disable camelcase */
        var data = {
            game: game.name,
            event: event.name,
            data: {
                value: event.value
            }
        };
        /*eslint-enable camelcase */

        return post('/game_event', data);
    };

    /**
     * Starts sending Heartbeat/Keepalive events.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#heartbeatkeepalive-events
     */
    this.startHeartbeatSending = function startHeartbeatSending() {
        heartbeatIntervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL * 1000);
    };

    /**
     * Stops sending  Heartbeat/Keepalive events.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#heartbeatkeepalive-events
     */
    this.stopHeartbeatSending = function stopHeartbeatSending() {
        if (heartbeatIntervalId) {
            clearInterval(heartbeatIntervalId);
        }
    };

    /**
     * Sends an heartbeat event
     */
    function sendHeartbeat() {
        /*eslint-disable camelcase */
        var data = {
            game: game.name
        };
        /*eslint-enable camelcase */

        post('/game_heartbeat', data);
    }

    /**
     * @param {string} path The url path, always start with a forward slash '/'.
     * @param {Object} data
     * @returns {Promise} Returns a request promise.
     */
    function post(path, data) {
        return new Promise(function postPromise(resolve) {
            var jsonData = JSON.stringify(data);

            var options = {
                host: endpoint.host,
                port: endpoint.port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': jsonData.length
                }
            };

            var request = http.request(options, function handleResponse(response) {
                response.setEncoding('utf8');
                response.on('data', function handleOnData(chunk) {
                    console.log(response.statusCode + ' < ' + chunk);
                    resolve(chunk);
                });
            });

            console.log('POST ' + path, {json: jsonData});

            request.write(jsonData);
            request.end();
        });
    }
};
/**
 * A static color.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @constructor
 */
gamesense.Color = function Color(r, g, b) {
    'use strict';

    /**
     * @type {number}
     */
    this.red = r;

    /**
     * @type {number}
     */
    this.green = g;

    /**
     * @type {number}
     */
    this.blue = b;
};
/**
 * A concrete color range.
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {gamesense.Color|gamesense.GradientColor} color
 */
gamesense.ColorRange = function ColorRange(low, high, color) {
    'use strict';

    /**
     * @type {number}
     */
    this.low = low;

    /**
     * @type {number}
     */
    this.high = high;

    /**
     * @type {gamesense.Color|gamesense.GradientColor}
     */
    this.color = color;
};
/**
 * List of color ranges.
 * @constructor
 * @param {Array<gamesense.ColorRange>} [ranges]
 */
gamesense.ColorRanges = function ColorRanges(ranges) {
    'use strict';

    /**
     * @type {Array<gamesense.ColorRange>}
     */
    this.ranges = ranges || [];
};
/**
 * Pre defined Device Types
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#device-types
 * @enum {string}
 */
gamesense.DeviceType = {
    /**
     * Any connected, supported keyboard. Initially the Apex M800, Apex 300, MSI GE62, and MSI GE72.
     */
    KEYBOARD: 'keyboard',

    /**
     * Any connected, supported mouse. Initially the Rival, Dota 2 Rival, Sensei Wireless, and Sims 4 Mouse.
     */
    MOUSE: 'mouse',

    /**
     * Any connected, supported headset. Initially the Siberia Elite line and Siberia v3 Prism.
     */
    HEADSET: 'headset',

    /**
     * Any connected, supported simple indicator device. Initially the Sims4 Plumbob and Valve Dota 2 indicator.
     */
    INDICATOR: 'indicator',

    /**
     * Any connected, supported, single zone RGB device. Initially the Siberia Elite line, Siberia v3 Prism, and Sims 4 line.
     */
    RGB_1_ZONE: 'rgb-1-zone',

    /**
     * Any connected, supported, dual zone RGB device. Initially the Rival mouse.
     */
    RGB_2_ZONE: 'rgb-2-zone',

    /**
     * Any connected, supported, three zone RGB device. Initially the Sensei Wireless mouse, the MSI GE62 keyboard, and the MSI GE72 keyboard.
     */
    RGB_3_ZONE: 'rgb-3-zone',

    /**
     * Any connected, supported, five zone RGB device. Initially the Apex 300 keyboard.
     */
    RGB_5_ZONE: 'rgb-5-zone',

    /**
     * Any connected, supported, keyboard with a lighting zone for each key. Initially the APEX M800 keyboard.
     */
    RGB_PER_KEY_ZONES: 'rgb-per-key-zones'
};
/**
 * Event Icons.
 * Icon will be displayed in SteelSeries(TM) Engine user interface.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#event-icons
 * @enum {number}
 */
gamesense.EventIcon = {
    NO_ICON: 0,
    HEALTH: 1,
    ARMOR: 2,
    AMMUNITION: 3,
    MONEY: 4,
    FLASH_EXPLOSION: 5,
    KILLS: 6,
    HEADSHOT: 7,
    HELMET: 8,
    HUNGER: 10,
    AIR_BREATH: 11,
    COMPASS: 12,
    TOOL_PICKAXE: 13,
    MANA_POTION: 14,
    CLOCK: 15,
    LIGHTNING: 16,
    ITEM_BACKPACK: 17
};
/**
 * A static FlashEffectFrequency.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#static-frequency
 * @param {number} frequency Number of flash times per second.
 * @constructor
 */
gamesense.FlashEffectFrequency = function FlashEffectFrequency(frequency) {
    'use strict';

    /**
     * @type {number}
     */
    this.frequency = frequency;
};
/**
 * @constructor
 * @param {string} name Use only uppercase A-Z, 0-9, hyphen and underscore characters for the game name.
 * @param {string} [displayName] Optional: The display name of game in the SteelSeries Engine Interface.
 * @param {gamesense.GameColor} [iconColor] Optional: The icon color in the SteelSeries Engine Interface.
 */
gamesense.Game = function Game(name, displayName, iconColor) {
    'use strict';

    /**
     * @type {string}
     */
    this.name = name.toUpperCase();

    /**
     * @type {string}
     */
    this.displayName = displayName;

    /**
     * @type {lib.GameColor}
     */
    this.iconColor = iconColor || gamesense.GameColor.SILVER;
};
/**
 * Default game icon colors.
 * To display the following colored versions of the default game icon next to your game
 * when it is displayed in SteelSeries Engine.
 * @enum {number}
 */
gamesense.GameColor = {
    ORANGE: 0,
    GOLD: 1,
    YELLOW: 2,
    GREEN: 3,
    TEAL: 4,
    LIGHT_BLUE:  5,
    BLUE: 6,
    PURPLE: 7,
    FUSCHIA: 8,
    PINK: 9,
    RED: 10,
    SILVER: 11
};
/**
 * @param {string} name
 * @constructor
 */
gamesense.GameEvent = function GameEvent(name) {
    'use strict';

    /**
     * @type {string}
     */
    this.name = name.toUpperCase();

    /**
     * @type {!gamesense.EventIcon}
     */
    this.icon = gamesense.EventIcon.NO_ICON;

    /**
     * @type {number}
     */
    this.minValue = 0;

    /**
     * @type {number}
     */
    this.maxValue = 1;

    /**
     * @type {number}
     */
    this.value = 0;
};
/**
 *
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#binding-an-event
 * @constructor
 * @param {gamesense.DeviceType}  [deviceType]
 * @param {string} [zone]
 * @param {gamesense.Color|gamesense.GradientColor|gamesense.ColorRanges} [color]
 */
gamesense.GameEventHandler = function GameEventHandler(deviceType, zone, color) {
    'use strict';

    /**
     * @type {!gamesense.DeviceType}
     */
    this.deviceType = deviceType || gamesense.DeviceType.RGB_PER_KEY_ZONE;

    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md
     * @type {string}
     */
    this.zone = zone || 'logo';

    /**
     * The value is an array of zone numbers. For the APEX M800,
     * this is an array of the HID codes of the keys in the zone,
     * in the order in which the effect should be applied.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#dynamic-zones
     * @type {Array<number>}
     */
    this.customZoneKeys = null;

    /**
     * @type {!gamesense.Color|!gamesense.GradientColor}
     */
    this.color = color || new gamesense.Color(0, 0, 255);

    /**
     * @type {!gamesense.VisualizationMode}
     */
    this.mode = gamesense.VisualizationMode.COLOR;

    /**
     * Specifying flash effects
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#specifying-flash-effects
     * @type {gamesense.FlashEffectFrequency}
     */
    this.rate = null;
};
/**
 * Color from a linear gradient
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#color-from-a-linear-gradient
 * @constructor
 * @param {gamesense.Color} zero
 * @param {gamesense.Color} hundred
 */
gamesense.GradientColor = function GradientColor(zero, hundred) {
    'use strict';

    /**
     * @type {gamesense.Color}
     */
    this.zero = zero;

    /**
     * @type {gamesense.Color}
     */
    this.hundred = hundred;
};
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#headset
 * @enum {string}
 */
gamesense.HeadsetZone = {
    EARCUPS: 'earcups'
};
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#indicator
 * @enum {string}
 */
gamesense.RgbZone = {
    ONE: 'one'
};
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#keyboard
 * @enum {string}
 */
gamesense.KeyboardZone = {
    FUNCTION_KEYS: 'function-keys',
    MAIN_KEYBOARD: 'main-keyboard',
    KEYPAD: 'keypad',
    NUMBER_KEYS: 'number-keys',
    MACRO_KEYS: 'macro-keys'
};
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#mouse
 * @enum {string}
 */
gamesense.MouseZone = {
    WHEEL: 'wheel',
    LOGO: 'logo',
    BASE: 'base'
};
/**
 * These zones are named based on the keycaps in the US English layout.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#rgb-per-key-zones
 * @enum {string}
 */
gamesense.RgbPerKeyZone = {
    LOGO: 'logo',
    A: 'a',
    B: 'b',
    C: 'c',
    D: 'd',
    E: 'e',
    F: 'f',
    G: 'g',
    H: 'h',
    I: 'i',
    J: 'j',
    K: 'k',
    L: 'l',
    M: 'm',
    N: 'n',
    O: 'o',
    P: 'p',
    Q: 'q',
    R: 'r',
    S: 's',
    T: 't',
    U: 'u',
    V: 'v',
    W: 'w',
    X: 'x',
    Y: 'y',
    Z: 'z',
    KEYBOARD_1: 'keyboard-1',
    KEYBOARD_2: 'keyboard-2',
    KEYBOARD_3: 'keyboard-3',
    KEYBOARD_4: 'keyboard-4',
    KEYBOARD_5: 'keyboard-5',
    KEYBOARD_6: 'keyboard-6',
    KEYBOARD_7: 'keyboard-7',
    KEYBOARD_8: 'keyboard-8',
    KEYBOARD_9: 'keyboard-9',
    KEYBOARD_0: 'keyboard-0',
    RETURN: 'return',
    ESCAPE: 'escape',
    BACKSPACE: 'backspace',
    TAB: 'tab',
    SPACEBAR: 'spacebar',
    CAPS: 'caps',
    DASH: 'dash',
    EQUAL: 'equal',
    LEFT_BRACKET: 'l-bracket',
    RIGHT_BRACKET: 'r-bracket',
    BACKSLASH: 'backslash',
    POUND_HASHMARK: 'pound',
    SEMICOLON: 'semicolon',
    QUOTE: 'quote',
    BACKQUOTE: 'backquote',
    COMMA: 'comma',
    PERIOD: 'period',
    SLASH: 'slash',
    F1: 'f1',
    F2: 'f2',
    F3: 'f3',
    F4: 'f4',
    F5: 'f5',
    F6: 'f6',
    F7: 'f7',
    F8: 'f8',
    F9: 'f9',
    F10: 'f10',
    F11: 'f11',
    F12: 'f12',
    PRINT_SCREEN: 'printscreen',
    SCROLL_LOCK: 'scrolllock',
    PAUSE: 'pause',
    INSERT: 'insert',
    HOME: 'home',
    PAGE_UP: 'pageup',
    PAGE_DOWN: 'pagedown',
    RIGHT_ARROW: 'rightarrow',
    LEFT_ARROW: 'leftarrow',
    DOWN_ARROW: 'downarrow',
    UP_ARROW: 'uparrow',
    KEYPAD_NUM_LOCK: 'keypad-num-lock',
    KEYPAD_DIVIDE: 'keypad-divide',
    KEYPAD_TIMES: 'keypad-times',
    KEYPAD_MINUS: 'keypad-minus',
    KEYPAD_PLUS: 'keypad-plus',
    KEYPAD_ENTER: 'keypad-enter',
    KEYPAD_PERIOD: 'keypad-period',
    KEYPAD_0: 'keypad-0',
    KEYPAD_1: 'keypad-1',
    KEYPAD_2: 'keypad-2',
    KEYPAD_3: 'keypad-3',
    KEYPAD_4: 'keypad-4',
    KEYPAD_5: 'keypad-5',
    KEYPAD_6: 'keypad-6',
    KEYPAD_7: 'keypad-7',
    KEYPAD_8: 'keypad-8',
    KEYPAD_9: 'keypad-9',
    LEFT_CTRL: 'l-ctrl',
    LEFT_SHIFT: 'l-shift',
    LEFT_ALT: 'l-alt',
    LEFT_WIN: 'l-win',
    RIGHT_CTRL: 'r-ctrl',
    RIGHT_SHIFT: 'r-shift',
    RIGHT_ALT: 'r-alt',
    RIGHT_WIN: 'r-win',
    STEELSERIES_KEY: 'ss-key',
    WIN_MENU: 'win-menu',
    MACRO_0: 'm0',
    MACRO_1: 'm1',
    MACRO_2: 'm2',
    MACRO_3: 'm3',
    MACRO_4: 'm4',
    MACRO_5: 'm5',
    FUNCTION_KEYS: 'function-keys',
    NUMBER_KEYS: 'number-keys',
    Q_ROW: 'q-row',
    A_ROW: 'a-row',
    Z_ROW: 'z-row',
    MACRO_KEYS: 'macro-keys',
    ALL_MACRO_KEYS: 'all-macro-keys',
    MAIN_KEYBOARD: 'main-keyboard',
    NAV_CLUSTER: 'nav-cluster',
    ARROWS: 'arrows',
    KEYPAD: 'keypad',
    KEYPAD_NUMBERS: 'keypad-nums',
    ALL: 'all'
};
/**
 * Each of these types supports up to the number of zones specified in its name.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#rgb-1-zone-rgb-2-zone-rgb-3-zone-rgb-5-zone
 * @enum {string}
 */
gamesense.RgbZone = {
    ONE: 'one',
    TWO: 'two',
    THREE: 'three',
    FOUR: 'four',
    FIVE: 'five'
};
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
/**
 * It controls the way that the computed color is applied to the LEDs
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#specifying-the-visualization-mode
 * @enum {string}
 */
gamesense.VisualizationMode = {
    COLOR: 'color',
    PERCENT: 'percent',
    COUNT: 'count'
};
    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return gamesense;
}));
