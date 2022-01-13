/**
 * gamesense-client
 * @version 2.0.3
 * @author Christian Schuller <cschuller>
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
'use strict';
/**
 * The root namespace.
 * @namespace gamesense
 */
/*eslint-disable no-unused-vars */
var gamesense = {};
/*eslint-enable no-unused-vars */
'use strict';
/**
 * The GameSense(TM) Client
 * @constructor
 * @param {gamesense.Game} game The game.
 * @param {gamesense.ServerEndpoint} endpoint The GameSense(TM) server.
 */
gamesense.GameClient = function GameClient(game, endpoint) {


    var http = require('http');
    var Promise = require('promise');
    //var _ = require('underscore');

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
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#registering-a-game
     * @returns {Promise} Returns the promise.
     */
    this.registerGame = function registerGame() {
        var data = {
            game: game.name,
            game_display_name: game.displayName,
            developer: game.developer,
            deinitialize_timer_length_ms: game.deinitialize_timer_length_ms
        };

        return post('/game_metadata', data);
    };

    /**
     * As of SteelSeries Engine 3.5.0, you can remove a game you have registered.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#removing-a-game
     * @returns {Promise} Returns the promise.
     */
    this.removeGame = function removeGame() {
        var data = {
            game: game.name
        };
        return post('/remove_game', data);
    };

    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#registering-an-event
     * @param {gamesense.GameEvent} gameEvent
     * @returns {Promise} Returns the promise.
     */
    this.registerEvent = function registerEvent(gameEvent) {
        var data = {
            game: game.name,
            event: gameEvent.name,
            min_value: gameEvent.minValue,
            max_value: gameEvent.maxValue,
            icon_id: gameEvent.icon,
            value_optional: gameEvent.value_optional
        };
        return post('/register_game_event', data);
    };

    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#removing-an-event
     * @param {gamesense.GameEvent} gameEvent
     * @returns {Promise} Returns the promise.
     */
    this.removeEvent = function removeEvent(gameEvent) {
        var data = {
            game: game.name,
            event: gameEvent.name
        };
        return post('/remove_game_event', data);
    };

    /**
     * Bind handlers for an event.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#binding-an-event
     * @param {gamesense.GameEvent} event
     * @param {!Array<Object>} handlers
     * @returns {Promise} Returns the promise.
     */
    this.bindEvent = function bindEvent(event, handlers) {


        var data = {
            game: game.name,
            event: event.name,
            min_value: event.minValue,
            max_value: event.maxValue,
            icon_id: event.icon,
            value_optional: event.value_optional,
            handlers: handlers.map(function f(handler) { return handler.toHandlerData(); })
        };
        return post('/bind_game_event', data);
    };

    /**
     * @param {gamesense.GameEvent} event
     * @returns {Promise} Returns the promise.
     */
    function getEventData(event) {
        var d = {};
        if (!event.value_optional) {
            d.value = event.value;
        }
        if (event.frame) {
            if (event.frame.constructor.name === 'Bitmap') {
                var fd = {
                    bitmap: event.frame.bitmap
                };
                if (event.frame.excluded_events) {
                    fd['excluded-events'] = event.frame.excluded_events;
                }
                d.frame = fd;
            } else {
                d.frame = event.frame;
            }

        }
        var data = {
            event: event.name,
            data: d
        };
        return data;
    }
    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#game-events
     * @returns {Promise} Returns the promise.
     * @param {gamesense.GameEvent} event 
     */
    this.sendGameEventUpdate = function updateGameEvent(event) {
        var data = getEventData(event);
        data.game = game.name;
        return post('/game_event', data);
    };
    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#sending-multiple-event-updates-in-one-request
     * @returns {Promise} Returns the promise.
     * @param {Array<GameEvent>} events 
     */
    this.sendMultipleEventUpdate = function sendMultipleEventUpdate(events) {
        var options = {
            host: endpoint.host,
            port: endpoint.port,
            path: '/supports_multiple_game_events',
            method: 'GET',
        };
        return http.get(options, function f(m) {
            if (m.statusCode === 200) {
                var data = {
                    game: game.name,
                    events: events.map(function f(event) { return getEventData(event); })
                };
                return post('/multiple_game_events', data);
            } else {
                for (var e in events) {
                    this.sendGameEventUpdate(e);
                }
            }
        });
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
        var data = {
            game: game.name
        };
        post('/game_heartbeat', data);
    }

    /**
     * @param {string} path The url path, always start with a forward slash '/'.
     * @param {Object} data
     * @returns {Promise} Returns a request promise.
     */
    function post(path, data) {
        return new Promise(function postPromise(resolve, reject) {
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
                    // See more about error handling at
                    // https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#error-handling
                    if (response.statusCode === 200) {
                        resolve(chunk);
                    } else {
                        reject({
                            jsonData: jsonData,
                            request: options,
                            statusCode: response.statusCode,
                            error: chunk
                        });
                    }
                });
            });

            request.write(jsonData);
            request.end();
        });
    }
};
'use strict';

/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-full-keyboard-lighting.md
 * @constructor
 * @param {Array<gamesense.Color>} bitarray array of length 132
 * @param {Array<gamesense.GameEvent>} [excluded_events]
 */
gamesense.Bitmap = function Bitmap(bitarray, excluded_events){
    /**
     * @type {Array<Array<number>>}
     * 
     */
    this.bitmap = bitarray.map(function f(color){return [color.red, color.green, color.blue]})

    /**
     * @type {Array<string>}
     */
    this.excluded_events = excluded_events ? excluded_events.map(function f(event) {return event.name}) : null
}
'use strict';
/**
 * A static color.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @constructor
 */
gamesense.Color = function Color(r, g, b) {
    

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
'use strict';
/**
 * A concrete color range.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#color-based-on-ranges
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {gamesense.Color|gamesense.GradientColor} color
 */
gamesense.ColorRange = function ColorRange(low, high, color) {
    

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
'use strict';
/**
 * List of color ranges.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#color-based-on-ranges
 * @constructor
 * @param {Array<gamesense.ColorRange>} [ranges]
 */
gamesense.ColorRanges = function ColorRanges(ranges) {
    /**
     * @type {Array<gamesense.ColorRange>}
     */
    this.ranges = ranges || [];
};
'use strict';
/**
 * Color from a linear gradient
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#color-from-a-linear-gradient
 * @constructor
 * @param {gamesense.Color} zero
 * @param {gamesense.Color} hundred
 */
gamesense.GradientColor = function GradientColor(zero, hundred) {
    /**
     * @type {gamesense.Color}
     */
    this.zero = zero;

    /**
     * @type {gamesense.Color}
     */
    this.hundred = hundred;
};
'use strict';
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
     * A generic specifier that applies to any connected, supported RGB device that has a static number of lighting zones. 
     * This can be used to apply settings to a certain zone on all of the types of devices in the list below at once. 
     * When using this type, a handler will be created for each type below that has the specified zone.
     */

    RGB_ZONED: 'rgb-zoned-device',

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
     * Any connected, supported, eight zone RGB device. Initially the Rival 600 and Rival 650 mice.
     */
    RGB_8_ZONE: 'rgb-8-zone',

    /**
     * Any connected, supported, twelve zone RGB device. Initially the QCK Prism mousepad
     */
    RGB_12_ZONE: 'rgb-12-zone',


    /**
     * Any connected, supported, seventeen zone RGB device. Initially the MSI Z270 Gaming Pro Carbon motherboard.
     */
    RGB_17_ZONE: 'rgb-17-zone',

    /**
     * Any connected, supported, twenty-four zone RGB device. Initially the MSI Mystic Light.
     */
    RGB_24_ZONE: 'rgb-24-zone',

    /**
     * Any connected, supported, one hundred three zone RGB device. Initially the MSI MPG27C and MPG27CQ monitors.
     */
    RGB_103_ZONE: 'rgb-103-zone',


    /**
     * Any connected, supported, keyboard with a lighting zone for each key. Initially the APEX M800 keyboard.
     */
    RGB_PER_KEY_ZONES: 'rgb-per-key-zones',

    /**
     * Any connected, supported device that supports notifications on a single OLED or LCD screen. 
     * Initially the Rival 700, Rival 710, Arctis Pro Wireless, and GameDAC.
     */
    SCREENED: 'screened',

    /**
     * Currently the only supported tactile feedback device is the Rival 700, which has a single motor for the purpose. 
     * More zones may be introduced in the future with new devices
     */
    TACTILE: 'tactile'
};
'use strict';
/**
 * Event Icons.
 * Icon will be displayed in SteelSeries(TM) Engine user interface.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/event-icons.md
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
    ITEM_BACKPACK: 17,
    AT_SYMBOL: 18,
    MUTED: 19,
    TALKING: 20,
    CONNECT: 21,
    DISCONNECT: 22,
    MUSIC: 23,
    PLAY: 24,
    PAUSE: 25,
    CPU: 27,
    GPU: 28,
    RAM: 29,
    ASSISTS: 30,
    CREEP_SCORE: 31,
    DEAD: 32,
    DRAGON: 33,
    ENEMIES: 35,
    GAME_START: 36,
    GOLD: 37,
    HEALTH_2: 38,
    KILLS_2: 39,
    MANA_2: 40,
    TEAMMATES: 41,
    TIMER: 42,
    TEMPERATURE: 43
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#headset
 * @enum {string}
 */
gamesense.HeadsetZone = {
    EARCUPS: 'earcups'
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#indicator
 * @enum {string}
 */
gamesense.RgbZone = {
    ONE: 'one'
};
'use strict';
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
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#mouse
 * @enum {string}
 */
gamesense.MouseZone = {
    WHEEL: 'wheel',
    LOGO: 'logo',
    BASE: 'base'
};
'use strict';
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
    DELETE: 'delete',
    END: 'end',
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
'use strict';
/**
 * Each of these types supports up to the number of zones specified in its name.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#static-rgb-zoned-devices-rgb-zoned-device-and-each-individual-type-eg-rgb-1-zone
 * @enum {string}
 */
gamesense.RgbZone = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
    13: 'thirteen',
    14: 'fourteen',
    15: 'fifteen',
    16: 'sixteen',
    17: 'seventeen',
    18: 'eighteen',
    19: 'nineteen',
    20: 'twenty',
    21: 'twenty-one',
    22: 'twenty-two',
    23: 'twenty-three',
    24: 'twenty-four',
    25: 'twenty-five',
    26: 'twenty-six',
    27: 'twenty-seven',
    28: 'twenty-eight',
    29: 'twenty-nine',
    30: 'thirty',
    31: 'thirty-one',
    32: 'thirty-two',
    33: 'thirty-three',
    34: 'thirty-four',
    35: 'thirty-five',
    36: 'thirty-six',
    37: 'thirty-seven',
    38: 'thirty-eight',
    39: 'thirty-nine',
    40: 'forty',
    41: 'forty-one',
    42: 'forty-two',
    43: 'forty-three',
    44: 'forty-four',
    45: 'forty-five',
    46: 'forty-six',
    47: 'forty-seven',
    48: 'forty-eight',
    49: 'forty-nine',
    50: 'fifty',
    51: 'fifty-one',
    52: 'fifty-two',
    53: 'fifty-three',
    54: 'fifty-four',
    55: 'fifty-five',
    56: 'fifty-six',
    57: 'fifty-seven',
    58: 'fifty-eight',
    59: 'fifty-nine',
    60: 'sixty',
    61: 'sixty-one',
    62: 'sixty-two',
    63: 'sixty-three',
    64: 'sixty-four',
    65: 'sixty-five',
    66: 'sixty-six',
    67: 'sixty-seven',
    68: 'sixty-eight',
    69: 'sixty-nine',
    70: 'seventy',
    71: 'seventy-one',
    72: 'seventy-two',
    73: 'seventy-three',
    74: 'seventy-four',
    75: 'seventy-five',
    76: 'seventy-six',
    77: 'seventy-seven',
    78: 'seventy-eight',
    79: 'seventy-nine',
    80: 'eighty',
    81: 'eighty-one',
    82: 'eighty-two',
    83: 'eighty-three',
    84: 'eighty-four',
    85: 'eighty-five',
    86: 'eighty-six',
    87: 'eighty-seven',
    88: 'eighty-eight',
    89: 'eighty-nine',
    90: 'ninety',
    91: 'ninety-one',
    92: 'ninety-two',
    93: 'ninety-three',
    94: 'ninety-four',
    95: 'ninety-five',
    96: 'ninety-six',
    97: 'ninety-seven',
    98: 'ninety-eight',
    99: 'ninety-nine',
    100: 'one-hundred',
    101: 'one-hundred-one',
    102: 'one-hundred-two',
    103: 'one-hundred-three',
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#screened-screened-widthxheight
 * @enum {string}
 */
gamesense.ScreenZone = {
    ONE: 'one'
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#tactile
 * @enum {string}
 */
gamesense.TactileZone = {
    ONE: 'one'
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-tactile.md#reference-sections---ti-predefined-vibrations
 * @enum {string}
 */
gamesense.VibrationType = {
    CUSTOM: 'custom',
    STRONGCLICK_100: 'ti_predefined_strongclick_100',
    STRONGCLICK_60: 'ti_predefined_strongclick_60',
    STRONGCLICK_30: 'ti_predefined_strongclick_30',
    SHARPCLICK_100: 'ti_predefined_sharpclick_100',
    SHARPCLICK_60: 'ti_predefined_sharpclick_60',
    SHARPCLICK_30: 'ti_predefined_sharpclick_30',
    SOFTBUMP_100: 'ti_predefined_softbump_100',
    SOFTBUMP_60: 'ti_predefined_softbump_60',
    SOFTBUMP_30: 'ti_predefined_softbump_30',
    DOUBLECLICK_100: 'ti_predefined_doubleclick_100',
    DOUBLECLICK_60: 'ti_predefined_doubleclick_60',
    TRIPLECLICK_100: 'ti_predefined_tripleclick_100',
    SOFTFUZZ_60: 'ti_predefined_softfuzz_60',
    STRONGBUZZ_100: 'ti_predefined_strongbuzz_100',
    BUZZALERT750MS: 'ti_predefined_buzzalert750ms',
    BUZZALERT1000MS: 'ti_predefined_buzzalert1000ms',
    STRONGCLICK1_100: 'ti_predefined_strongclick1_100',
    STRONGCLICK2_80: 'ti_predefined_strongclick2_80',
    STRONGCLICK3_60: 'ti_predefined_strongclick3_60',
    STRONGCLICK4_30: 'ti_predefined_strongclick4_30',
    MEDIUMCLICK1_100: 'ti_predefined_mediumclick1_100',
    MEDIUMCLICK2_80: 'ti_predefined_mediumclick2_80',
    MEDIUMCLICK3_60: 'ti_predefined_mediumclick3_60',
    SHARPTICK1_100: 'ti_predefined_sharptick1_100',
    SHARPTICK2_80: 'ti_predefined_sharptick2_80',
    SHARPTICK3_60: 'ti_predefined_sharptick3_60',
    SHORTDOUBLECLICKSTRONG1_100: 'ti_predefined_shortdoubleclickstrong1_100',
    SHORTDOUBLECLICKSTRONG2_80: 'ti_predefined_shortdoubleclickstrong2_80',
    SHORTDOUBLECLICKSTRONG3_60: 'ti_predefined_shortdoubleclickstrong3_60',
    SHORTDOUBLECLICKSTRONG4_30: 'ti_predefined_shortdoubleclickstrong4_30',
    SHORTDOUBLECLICKMEDIUM1_100: 'ti_predefined_shortdoubleclickmedium1_100',
    SHORTDOUBLECLICKMEDIUM2_80: 'ti_predefined_shortdoubleclickmedium2_80',
    SHORTDOUBLECLICKMEDIUM3_60: 'ti_predefined_shortdoubleclickmedium3_60',
    SHORTDOUBLESHARPTICK1_100: 'ti_predefined_shortdoublesharptick1_100',
    SHORTDOUBLESHARPTICK2_80: 'ti_predefined_shortdoublesharptick2_80',
    SHORTDOUBLESHARPTICK3_60: 'ti_predefined_shortdoublesharptick3_60',
    LONGDOUBLESHARPCLICKSTRONG1_100: 'ti_predefined_longdoublesharpclickstrong1_100',
    LONGDOUBLESHARPCLICKSTRONG2_80: 'ti_predefined_longdoublesharpclickstrong2_80',
    LONGDOUBLESHARPCLICKSTRONG3_60: 'ti_predefined_longdoublesharpclickstrong3_60',
    LONGDOUBLESHARPCLICKSTRONG4_30: 'ti_predefined_longdoublesharpclickstrong4_30',
    LONGDOUBLESHARPCLICKMEDIUM1_100: 'ti_predefined_longdoublesharpclickmedium1_100',
    LONGDOUBLESHARPCLICKMEDIUM2_80: 'ti_predefined_longdoublesharpclickmedium2_80',
    LONGDOUBLESHARPCLICKMEDIUM3_60: 'ti_predefined_longdoublesharpclickmedium3_60',
    LONGDOUBLESHARPTICK1_100: 'ti_predefined_longdoublesharptick1_100',
    LONGDOUBLESHARPTICK2_80: 'ti_predefined_longdoublesharptick2_80',
    LONGDOUBLESHARPTICK3_60: 'ti_predefined_longdoublesharptick3_60',
    BUZZ1_100: 'ti_predefined_buzz1_100',
    BUZZ2_80: 'ti_predefined_buzz2_80',
    BUZZ3_60: 'ti_predefined_buzz3_60',
    BUZZ4_40: 'ti_predefined_buzz4_40',
    BUZZ5_20: 'ti_predefined_buzz5_20',
    PULSINGSTRONG1_100: 'ti_predefined_pulsingstrong1_100',
    PULSINGSTRONG2_60: 'ti_predefined_pulsingstrong2_60',
    PULSINGMEDIUM1_100: 'ti_predefined_pulsingmedium1_100',
    PULSINGMEDIUM2_60: 'ti_predefined_pulsingmedium2_60',
    PULSINGSHARP1_100: 'ti_predefined_pulsingsharp1_100',
    PULSINGSHARP2_60: 'ti_predefined_pulsingsharp2_60',
    TRANSITIONCLICK1_100: 'ti_predefined_transitionclick1_100',
    TRANSITIONCLICK2_80: 'ti_predefined_transitionclick2_80',
    TRANSITIONCLICK3_60: 'ti_predefined_transitionclick3_60',
    TRANSITIONCLICK4_40: 'ti_predefined_transitionclick4_40',
    TRANSITIONCLICK5_20: 'ti_predefined_transitionclick5_20',
    TRANSITIONCLICK6_10: 'ti_predefined_transitionclick6_10',
    TRANSITIONHUM1_100: 'ti_predefined_transitionhum1_100',
    TRANSITIONHUM2_80: 'ti_predefined_transitionhum2_80',
    TRANSITIONHUM3_60: 'ti_predefined_transitionhum3_60',
    TRANSITIONHUM4_40: 'ti_predefined_transitionhum4_40',
    TRANSITIONHUM5_20: 'ti_predefined_transitionhum5_20',
    TRANSITIONHUM6_10: 'ti_predefined_transitionhum6_10',
    TRANSITIONRAMPDOWNLONGSMOOTH1_100TO0: 'ti_predefined_transitionrampdownlongsmooth1_100to0',
    TRANSITIONRAMPDOWNLONGSMOOTH2_100TO0: 'ti_predefined_transitionrampdownlongsmooth2_100to0',
    TRANSITIONRAMPDOWNMEDIUMSMOOTH1_100TO0: 'ti_predefined_transitionrampdownmediumsmooth1_100to0',
    TRANSITIONRAMPDOWNMEDIUMSMOOTH2_100TO0: 'ti_predefined_transitionrampdownmediumsmooth2_100to0',
    TRANSITIONRAMPDOWNSHORTSMOOTH1_100TO0: 'ti_predefined_transitionrampdownshortsmooth1_100to0',
    TRANSITIONRAMPDOWNSHORTSMOOTH2_100TO0: 'ti_predefined_transitionrampdownshortsmooth2_100to0',
    TRANSITIONRAMPDOWNLONGSHARP1_100TO0: 'ti_predefined_transitionrampdownlongsharp1_100to0',
    TRANSITIONRAMPDOWNLONGSHARP2_100TO0: 'ti_predefined_transitionrampdownlongsharp2_100to0',
    TRANSITIONRAMPDOWNMEDIUMSHARP1_100TO0: 'ti_predefined_transitionrampdownmediumsharp1_100to0',
    TRANSITIONRAMPDOWNMEDIUMSHARP2_100TO0: 'ti_predefined_transitionrampdownmediumsharp2_100to0',
    TRANSITIONRAMPDOWNSHORTSHARP1_100TO0: 'ti_predefined_transitionrampdownshortsharp1_100to0',
    TRANSITIONRAMPDOWNSHORTSHARP2_100TO0: 'ti_predefined_transitionrampdownshortsharp2_100to0',
    TRANSITIONRAMPUPLONGSMOOTH1_0TO100: 'ti_predefined_transitionrampuplongsmooth1_0to100',
    TRANSITIONRAMPUPLONGSMOOTH2_0TO100: 'ti_predefined_transitionrampuplongsmooth2_0to100',
    TRANSITIONRAMPUPMEDIUMSMOOTH1_0TO100: 'ti_predefined_transitionrampupmediumsmooth1_0to100',
    TRANSITIONRAMPUPMEDIUMSMOOTH2_0TO100: 'ti_predefined_transitionrampupmediumsmooth2_0to100',
    TRANSITIONRAMPUPSHORTSMOOTH1_0TO100: 'ti_predefined_transitionrampupshortsmooth1_0to100',
    TRANSITIONRAMPUPSHORTSMOOTH2_0TO100: 'ti_predefined_transitionrampupshortsmooth2_0to100',
    TRANSITIONRAMPUPLONGSHARP1_0TO100: 'ti_predefined_transitionrampuplongsharp1_0to100',
    TRANSITIONRAMPUPLONGSHARP2_0TO100: 'ti_predefined_transitionrampuplongsharp2_0to100',
    TRANSITIONRAMPUPMEDIUMSHARP1_0TO100: 'ti_predefined_transitionrampupmediumsharp1_0to100',
    TRANSITIONRAMPUPMEDIUMSHARP2_0TO100: 'ti_predefined_transitionrampupmediumsharp2_0to100',
    TRANSITIONRAMPUPSHORTSHARP1_0TO100: 'ti_predefined_transitionrampupshortsharp1_0to100',
    TRANSITIONRAMPUPSHORTSHARP2_0TO100: 'ti_predefined_transitionrampupshortsharp2_0to100',
    TRANSITIONRAMPDOWNLONGSMOOTH1_50TO0: 'ti_predefined_transitionrampdownlongsmooth1_50to0',
    TRANSITIONRAMPDOWNLONGSMOOTH2_50TO0: 'ti_predefined_transitionrampdownlongsmooth2_50to0',
    TRANSITIONRAMPDOWNMEDIUMSMOOTH1_50TO0: 'ti_predefined_transitionrampdownmediumsmooth1_50to0',
    TRANSITIONRAMPDOWNMEDIUMSMOOTH2_50TO0: 'ti_predefined_transitionrampdownmediumsmooth2_50to0',
    TRANSITIONRAMPDOWNSHORTSMOOTH1_50TO0: 'ti_predefined_transitionrampdownshortsmooth1_50to0',
    TRANSITIONRAMPDOWNSHORTSMOOTH2_50TO0: 'ti_predefined_transitionrampdownshortsmooth2_50to0',
    TRANSITIONRAMPDOWNLONGSHARP1_50TO0: 'ti_predefined_transitionrampdownlongsharp1_50to0',
    TRANSITIONRAMPDOWNLONGSHARP2_50TO0: 'ti_predefined_transitionrampdownlongsharp2_50to0',
    TRANSITIONRAMPDOWNMEDIUMSHARP1_50TO0: 'ti_predefined_transitionrampdownmediumsharp1_50to0',
    TRANSITIONRAMPDOWNMEDIUMSHARP2_50TO0: 'ti_predefined_transitionrampdownmediumsharp2_50to0',
    TRANSITIONRAMPDOWNSHORTSHARP1_50TO0: 'ti_predefined_transitionrampdownshortsharp1_50to0',
    TRANSITIONRAMPDOWNSHORTSHARP2_50TO0: 'ti_predefined_transitionrampdownshortsharp2_50to0',
    TRANSITIONRAMPUPLONGSMOOTH1_0TO50: 'ti_predefined_transitionrampuplongsmooth1_0to50',
    TRANSITIONRAMPUPLONGSMOOTH2_0TO50: 'ti_predefined_transitionrampuplongsmooth2_0to50',
    TRANSITIONRAMPUPMEDIUMSMOOTH1_0TO50: 'ti_predefined_transitionrampupmediumsmooth1_0to50',
    TRANSITIONRAMPUPMEDIUMSMOOTH2_0TO50: 'ti_predefined_transitionrampupmediumsmooth2_0to50',
    TRANSITIONRAMPUPSHORTSMOOTH1_0TO50: 'ti_predefined_transitionrampupshortsmooth1_0to50',
    TRANSITIONRAMPUPSHORTSMOOTH2_0TO50: 'ti_predefined_transitionrampupshortsmooth2_0to50',
    TRANSITIONRAMPUPLONGSHARP1_0TO50: 'ti_predefined_transitionrampuplongsharp1_0to50',
    TRANSITIONRAMPUPLONGSHARP2_0TO50: 'ti_predefined_transitionrampuplongsharp2_0to50',
    TRANSITIONRAMPUPMEDIUMSHARP1_0TO50: 'ti_predefined_transitionrampupmediumsharp1_0to50',
    TRANSITIONRAMPUPMEDIUMSHARP2_0TO50: 'ti_predefined_transitionrampupmediumsharp2_0to50',
    TRANSITIONRAMPUPSHORTSHARP1_0TO50: 'ti_predefined_transitionrampupshortsharp1_0to50',
    TRANSITIONRAMPUPSHORTSHARP2_0TO50: 'ti_predefined_transitionrampupshortsharp2_0to50',
    LONGBUZZFORPROGRAMMATICSTOPPING_100: 'ti_predefined_longbuzzforprogrammaticstopping_100',
    SMOOTHHUM1NOKICKORBRAKEPULSE_50: 'ti_predefined_smoothhum1nokickorbrakepulse_50',
    SMOOTHHUM2NOKICKORBRAKEPULSE_40: 'ti_predefined_smoothhum2nokickorbrakepulse_40',
    SMOOTHHUM3NOKICKORBRAKEPULSE_30: 'ti_predefined_smoothhum3nokickorbrakepulse_30',
    SMOOTHHUM4NOKICKORBRAKEPULSE_20: 'ti_predefined_smoothhum4nokickorbrakepulse_20',
    SMOOTHHUM5NOKICKORBRAKEPULSE_10: 'ti_predefined_smoothhum5nokickorbrakepulse_10',
}
'use strict';
/**
 * It controls the way that the computed color is applied to the LEDs
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#specifying-the-visualization-mode
 * @enum {string}
 */
gamesense.VisualizationMode = {
    COLOR: 'color',
    PERCENT: 'percent',
    COUNT: 'count',
    CONTEXT_COLOR: 'context-color'
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#registering-a-game
 * @constructor
 * @param {string} name Use only uppercase A-Z, 0-9, hyphen and underscore characters for the game name.
 * @param {string} [displayName] Optional: The display name of game in the SteelSeries Engine Interface.
 * @param {string} [developer] Optional: Developer name displayed underneath the game name in SSE
 * @param {integer} [deinitialize_timer_length_ms] Optional: After what time without events the stop_game call is made (in ms, default 15000)
 */
gamesense.Game = function Game(name, displayName, developer, deinitialize_timer_length_ms) {
    

    /**
     * @type {string}
     */
    this.name = name.toUpperCase();

    /**
     * @type {string}
     */
    this.displayName = displayName;

    /**
     * @type {string}
     */
    this.developer = developer;

    /**
     * @type {integer}
     */
    this.deinitialize_timer_length_ms = deinitialize_timer_length_ms
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#game-events
 * @param {string} name
 * @constructor
 */
gamesense.GameEvent = function GameEvent(name) {
    

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

    /**
     * @type {boolean}
     */
    this.value_optional = false

    /**
     * @type {gamesense.Bitmap | Object}
     */
    this.frame = null
};
'use strict';
/**
 *
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#json-color-handlers
 * @constructor
 * @param {gamesense.DeviceType}  [deviceType]
 * @param {string} [zone]
 * @param {gamesense.Color|gamesense.GradientColor|gamesense.ColorRanges} [color]
 */
gamesense.ColorEventHandler = function ColorEventHandler(deviceType, zone, color) {


    /**
     * @type {!gamesense.DeviceType}
     */
    this.deviceType = deviceType || gamesense.DeviceType.RGB_PER_KEY_ZONES;

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
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#specifying-flash-effects
     * @type {gamesense.Rate}
     */
    this.rate = null;
    /**
    * @returns {Object} The gamesense data object representing a handler.
    */

    /**
     * Defines which color to use from the added frame data in the GameEvent
     * @type {string}
     */
    this.context_frame_key = null

    this.toHandlerData = function toHandlerData() {
        var handlerData = {
            zone: this.zone,
            color: this.color,
            mode: this.mode
        };

        if (this.deviceType) {
            handlerData['device-type'] = this.deviceType;
        } else {
            throw new Error('bindEvent failed: Missing device type.');
        }

        if (this.rate) {
            handlerData.rate = this.rate.toRateData();
        }

        if (this.color.constructor.name === 'GradientColor') {
            handlerData.color = {
                gradient: this.color
            };
        } else if (this.color.constructor.name === 'ColorRanges') {
            handlerData.color = this.color.ranges;
        }

        if (this.customZoneKeys) {
            handlerData['custom-zone-keys'] = this.customZoneKeys;
        }
        if (this.context_frame_key && this.mode === gamesense.VisualizationMode.CONTEXT_COLOR){
            handlerData['context-frame-key'] = this.context_frame_key
        }

        return handlerData;
    }
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-full-keyboard-lighting.md
 * @constructor
 * @param {boolean} [partial_bitmap]
 * @param {Array<GameEvent>} [excluded]
 */
gamesense.FullColorEventHandler = function FullColorEventHandler(partial_bitmap, excluded) {


    /**
     * @type {boolean}
     */
    this.partial_bitmap = partial_bitmap || false;


    /**
     * @type {Array<GameEvent>}
     */
    this.excluded_events = excluded;

    this.toHandlerData = function toHandlerData() {
        var data = {
            mode: this.partial_bitmap ? 'partial-bitmap' : 'bitmap',
            'device-type': 'rgb-per-key-zones'
        }
        if (this.excluded_events){
            data['excluded-events'] = this.excluded_events.map(function f(event) {return event.name})
        }
        return data
    }
} 
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md
 * @constructor
 * @param {gamesense.DeviceType} [deviceType]
 * @param {gamesense.ScreenZone} [zone]
 */
gamesense.ScreenEventHandler = function ScreenEventHandler(deviceType, zone) {

    /**
     * @type {!gamesense.DeviceType}
     */
    this.deviceType = deviceType || gamesense.DeviceType.SCREENED;

    /**
     * @type {!gamesense.ScreenZone}
     */
    this.zone = zone || gamesense.ScreenZone.ONE;

    //this.mode = 'screen';
    /**
     * @type {Array<gamesense.RangeScreenData> | Array<gamesense.SingleLineFrame | gamesense.MultiLineFrame | gamesense.ImageFrame>}
     */
    this.datas = null;


    this.toHandlerData = function toHandlerData() {
        var handlerData = {
            zone: this.zone,
            mode: 'screen'
        };
        handlerData['device-type'] = this.deviceType;
        function mapRangeScreenData(elem) {
            return {
                low: elem.low,
                high: elem.high,
                datas: elem.datas.map(function f(frame) { return toFrameData(frame); })
            };
        }

        function toFrameData(frame) {
            var frameData = {};
            if (frame.frame_modifiers) {
                if (frame.frame_modifiers.length_millis) {
                    frameData['length-millis'] = frame.frame_modifiers.length_millis;
                }
                if (frame.frame_modifiers.icon_id) {
                    frameData['icon-id'] = frame.frame_modifiers.icon_id;
                }
                if (frame.frame_modifiers.repeats) {
                    frameData.repeats = frame.frame_modifiers.repeats;
                }
            }
            if (frame.constructor.name === 'SingleLineFrame') {
                var lData = frame.line_data.toLineData();
                for (var key in lData) {
                    frameData[key] = lData[key];
                }
            } else if (frame.constructor.name === 'MultiLineFrame') {
                frameData.lines = frame.lines.map(function f(line) { return line.toLineData(); });
            } else if (frame.constructor.name === 'ImageFrame') {
                frameData['has-text'] = false;
                frameData['image-data'] = frame.image_data;
            }
            return frameData;
        }
        /*if (this.datas) {
            const mapper = this.datas[0] isInstanceOf RangeScreenData ?mapRangeScreenData: toFrameData;
            handlerData.datas = this.datas.map(mapper);
        }*/
        if (this.datas && this.datas[0].constructor.name === 'RangeScreenData') {
            handlerData.datas = this.datas.map(function f(frame) { return mapRangeScreenData(frame); });
        } else if (this.datas) {
            handlerData.datas = this.datas.map(function f(frame) { return toFrameData(frame); });
        }

        return handlerData;
    };
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-tactile.md
 * @constructor
 * @param {gamesense.DeviceType} [deviceType]
 * @param {gamesense.ScreenZone} [zone]
 * @param {Array<gamesense.PatternEntry> | gamesense.RangePattern} [pattern]
 * @param {!gamesense.Rate} [rate]
 */
gamesense.TactileEventHandler = function TactileEventHandler(deviceType, zone, pattern, rate){
    /**
     * @type {!gamesense.DeviceType}
     */
    this.deviceType = deviceType || gamesense.DeviceType.TACTILE;

    /**
     * @type {!gamesense.TactileZone}
     */
    this.zone = zone || gamesense.TactileZone.ONE;

    /**
     * @type {Array<gamesense.PatternEntry> | gamesense.RangePattern}
     */
    this.pattern = pattern || [];

    /**
     * @type {!gamesense.Rate}
     */
    this.rate = rate;

    this.toHandlerData = function toHandlerData() {
        var handlerData = {
            zone: this.zone,
            mode: 'vibrate'
        };
        if (this.pattern.constructor.name === 'RangePattern') {
            handlerData.pattern = this.pattern.toPatternData();
        } else {
            handlerData.pattern = this.pattern.map(function f(patt) {return patt.toPatternData()})
        }
        if (this.deviceType) {
            handlerData['device-type'] = this.deviceType;
        } else {
            throw new Error('bindEvent failed: Missing device type.');
        }

        if (this.rate) {
            handlerData.rate = this.rate.toRateData();
        }

        return handlerData;
    }

}
'use strict';
/**
 * A static FlashFrequency.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#static-frequency
 * @param {number} frequency Number of flash times per second.
 * @constructor
 */
gamesense.Frequency = function Frequency(frequency) {

    /**
     * @type {number}
     */
    this.frequency = frequency;
};
'use strict';
/**
 * A concrete flashfrequency range.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#frequency-ranges
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {gamesense.Frequency} frequency Static Frequency
 */
gamesense.FrequencyRange = function FrequencyRange(low, high, frequency) {
    

    /**
     * @type {number}
     */
    this.low = low;

    /**
     * @type {number}
     */
    this.high = high;

    /**
     * @type {gamesense.Frequency}
     */
    this.freq = frequency;
};'use strict';
/**
 * List of frequency ranges.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#frequency-ranges
 * @constructor
 * @param {Array<gamesense.FrequencyRange>} [ranges]
 */
gamesense.FrequencyRanges = function FrequencyRanges(ranges) {
    /**
     * @type {Array<gamesense.FrequencyRange>}
     */
    this.ranges = ranges || [];
};
'use strict';
/**
 * A Rate
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#specifying-flash-effects
 * @param {gamesense.Frequency|gamesense.FrequencyRanges} frequency
 * @param {gamesense.RepeatLimit|gamesense.RepeatLimitRanges} [repeat_limit]
 * @constructor
 */
gamesense.Rate = function Rate(frequency, repeat_limit){
    /**
     * @type {gamesense.Frequency|gamesense.FrequencyRanges}
     */
    this.frequency = frequency;

    /**
     * @type {gamesense.RepeatLimit|gamesense.RepeatLimitRanges}
     */
    this.repeat_limit = repeat_limit;


    this.toRateData = function toRateData() {
        var f;
        if (this.frequency.constructor.name === 'Frequency'){
            f = this.frequency.frequency
        } else if (this.frequency.constructor.name === 'FrequencyRanges'){
            f = this.frequency.ranges.map(function f(range){return {low: range.low, high: range.high, frequency:range.freq}})
        }
        var data = {
            frequency: f
        }
        if (this.repeat_limit){
            if (this.repeat_limit.constructor.name === 'RepeatLimit'){
                data.repeat_limit = this.repeat_limit.repeat_limit
            } else if (this.repeat_limit.constructor.name === 'RepeatLimitRanges'){
                data.repeat_limit = this.repeat_limit.ranges.map(function f(repeat_limit){return {low: range.low, high: range.high, repeat_limit:repeat_limit.repeat_limit}})
            }
        }
        return data;
    }
}
'use strict';
/**
 * A static RepeatLimit.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#flash-repeat-limit
 * @param {number} repeat_limit number of repeats
 * @constructor
 */
gamesense.RepeatLimit = function RepeatLimit(repeat_limit) {

    /**
     * @type {number}
     */
    this.repeat_limit = repeat_limit;
};
'use strict';
/**
 * A concrete RepeatLimit range.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#ranged-repeat-limit-example
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {gamesense.RepeatLimit} repeat_limit Static Frequency
 */
gamesense.RepeatLimitRange = function RepeatLimitRange(low, high, repeat_limit) {
    

    /**
     * @type {number}
     */
    this.low = low;

    /**
     * @type {number}
     */
    this.high = high;

    /**
     * @type {gamesense.RepeatLimit}
     */
    this.repeat_limit = repeat_limit;
};'use strict';
/**
 * List of repeat limit ranges.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#ranged-repeat-limit-example
 * @constructor
 * @param {Array<gamesense.RepeatLimitRange>} [ranges]
 */
gamesense.RepeatLimitRanges = function RepeatLimitRanges(ranges) {
    /**
     * @type {Array<gamesense.RepeatLimitRange>}
     */
    this.ranges = ranges || [];
};
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#controlling-frame-timing-and-repeating-data
 * @constructor
 * @param {Number} [length_millis]
 * @param {!gamesense.EventIcon} [icon_id]
 * @param {boolean | number} [repeats]
 */
 gamesense.FrameModifiers = function FrameModifiers(length_millis, icon_id, repeats) {

    /**
     * @type {Number}
     */
    this.length_millis = length_millis;

    /**
     * @type {gamesense.EventIcon}
     */
    this.icon_id = icon_id

    /**
     *  @type {boolean | Number}
     */
    this.repeats = repeats
    
 }
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#showing-raw-bitmaps
 * @constructor
 * @param {Array<gamesense.LineData>} image_data
 * @param {gamesense.FrameModifiers} [frame_modifiers]
 */
gamesense.MultiLineFrame = function MultiLineFrame(image_data, frame_modifiers) {
    /**
    * @type {Array<number>}
    */
    this.image_data = image_data;

    /**
     * @type {!gamesense.FrameModifiers}
     */
    this.frame_modifiers = frame_modifiers;

}

'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#describing-the-screen-notification
 * @constructor
 * @param {boolean} [progress_bar]
 */
gamesense.LineData = function LineData(progress_bar){
    /**
     * @type {boolean}
     */
    this.progress_bar = progress_bar;
    /**
     * @type {string}
     */
    this.prefix = null;
    /**
     * @type {string}
     */
    this.suffix = null;
    /**
     * @type {boolean}
     */
    this.bold = null;
    /**
     * @type {number}
     */
    this.wrap = null;
    /**
     * @type {string}
     */
    this.arg = null;
    /**
     * @type {string}
     */
    this.context_frame_key = null;

    this.toLineData = function toLineData() {
        var data = {
            'has-text': true
        }
        if (this.progress_bar){
            data['has-progress-bar'] = this.progress_bar;
            data['has-text'] = false
        }
        if (this.prefix){
            data.prefix = this.prefix;
        }
        if (this.suffix){
            data.suffix = this.suffix;
        }
        if (this.bold){
            data.bold = this.bold;
        }
        if (this.wrap){
            data.wrap = this.wrap;
        }
        if (this.arg){
            data.arg = this.arg;
        }
        if (this.context_frame_key){
            data['context-frame-key'] = this.context_frame_key;
        }
        return data
    }
    
}
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#static-frame-data
 * @constructor
 * @param {Array<gamesense.LineData>} lines
 * @param {gamesense.FrameModifiers} [frame_modifiers]
 */
gamesense.MultiLineFrame = function MultiLineFrame(lines, frame_modifiers) {
    /**
    * @type {Array<gamesense.LineData>}
    */
    this.lines = lines;

    /**
     * @type {!gamesense.FrameModifiers}
     */
    this.frame_modifiers = frame_modifiers;

}

'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#ranged-frame-data
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {Array<gamesense.SingleLineFrame | gamesense.MultiLineFrame | gamesense.ImageFrame>} datas
 */
gamesense.RangeScreenData = function RangeScreenData(low, high, datas) {
    /**
     * @type {number}
     */
    this.low = low;

    /**
     * @type {number}
     */
    this.high = high;
    /**
     * @type {Array<gamesense.SingleLineFrame | gamesense.MultiLineFrame | gamesense.ImageFrame>}
     */
    this.datas = datas
}

'use strict';
/** 
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#static-frame-data
 * @constructor
 * @param {gamesense.LineData} line_data
 * @param {gamesense.FrameModifiers} [frame_modifiers]
 */
gamesense.SingleLineFrame = function SingleLineFrame(line_data, frame_modifiers) {
    /**
     * @type {!gamesense.LineData}
     */
    this.line_data = line_data;

    /**
     * @type {!gamesense.FrameModifiers}
     */
    this.frame_modifiers = frame_modifiers
}
'use strict';
/**
 * The server endpoint configuration.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#server-discovery
 * @param {string} [url] URL to the HTTP server, like http://127.0.0.1:51248
 * @constructor
 */
gamesense.ServerEndpoint = function ServerEndpoint(url) {
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
     * @param {string} [path] Optional: custom Path to corepropsfile
     */
    this.discoverUrl = function discoverUrl(path) {
        var corePropsFilename;
        // Check the user's current platform
        // Initial check is for Darwin (OS X), and because SSE is Windows/OS X only,
        // we'll assume that the only other option is Windows.
        if (path){
            corePropsFilename = path
        } else if (process.platform === 'darwin') {
            corePropsFilename = '/Library/Application\ Support/SteelSeries\ Engine\ 3/coreProps.json';
        } else {
            corePropsFilename = '%PROGRAMDATA%/SteelSeries/SteelSeries Engine 3/coreProps.json';
        }

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
'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-tactile.md#static-pattern
 * @constructor
 * @param {!gamesense.VibrationType} type
 * @param {number} [length_ms]
 */
gamesense.PatternEntry = function PatternEntry(type, length_ms) {
    /**
     * @type {!gamesense.VibrationType}
     */
    this.type = type;

    /**
     * @type {number}
     * delay value in ms, ignored on last entry
     */
    this.delay_ms = null;

    /**
     * @type {number}
     * length value in ms mandatory for custom pattern
     */
    this.length_ms = length_ms

    this.toPatternData = function toPatternData() {
        var d = {
            type: this.type
        }
        if (this.type === gamesense.VibrationType.CUSTOM) {
            if (this.length_ms) {
                d['length-ms'] = this.length_ms;
            } else {
                throw new Error('length_ms mandatory for custom vibration type')
            }
        }
        if (this.delay_ms){
            d['delay-ms'] = this.delay_ms;
        }
        return d
    }
}
'use strict';

/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-tactile.md#vibration-based-on-ranges
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {Array<gamesense.PatternEntry> | gamesense.RangePattern} pattern Static Frequency
 */
gamesense.RangePattern = function RangePattern(low, high, pattern){
    /**
     * @type {number}
     */
    this.low = low;

    /**
     * @type {number}
     */
    this.high = high;

    /**
     * @type {Array<gamesense.PatternEntry> | gamesense.RangePattern}
     */
    this.pattern = pattern;

    this.toPatternData = function toPatternData() {
        var data = {
            low: this.low,
            high: this.high
        }
        if (this.pattern.constructor.name === 'RangePattern') {
            data.pattern = this.pattern.toPatternData();
        } else {
            data.pattern = this.pattern.map(function f(patt) {return patt.toPatternData()})
        }
        return data;
    }
}
    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return gamesense;
}));
