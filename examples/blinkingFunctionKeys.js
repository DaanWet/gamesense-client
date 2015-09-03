//
// Example: Blinking Function Buttons
//

/**
 * Get the GameSense(TM) JavaScript lib.
 */
var gamesense = gamesense || require('../dist/gamesense-client');

/**
 * Setup the web server endpoint to the local GameSense(TM) Engine.
 * A url parameter is optional.
 * @type {gamesense.ServerEndpoint}
 */
var endpoint = new gamesense.ServerEndpoint();

/**
 * Let's automatically discover the GameSense(TM) Engine web server url.
 */
endpoint.discoverUrl();

/**
 * Setups our unique game.
 * @type {gamesense.Game}
 */
var game = new gamesense.Game('TEST', 'A TEST GAME', gamesense.GameColor.SILVER);

/**
 * Create a client for our game and the local GameSense(TM) Engine web server.
 * @type {gamesense.GameClient}
 */
var client = new gamesense.GameClient(game, endpoint);

/**
 * Let's register our game.
 */
client.registerGame();

/**
 * Setup of our blink event.
 * @type {gamesense.GameEvent}
 */
var blinkEvent = new gamesense.GameEvent('IS_BLINK_ACTIVE');

/**
 * Register our blink event
 */
client.registerEvent(blinkEvent).then(bindBlinkKeyboardHandler);

/**
 * Binds the blink handler to the keyboard device.
 */
function bindBlinkKeyboardHandler() {
    var blinkColor = new gamesense.Color(0, 0, 255);

    /**
     * Setup of a event handler for the keyboard device and the function key zone.
     * @type {gamesense.GameEventHandler}
     */
    var functionKeysEventHandler = new gamesense.GameEventHandler(gamesense.DeviceType.KEYBOARD, gamesense.RgbPerKeyZone.FUNCTION_KEYS, blinkColor);
    client.bindEvent(blinkEvent, [functionKeysEventHandler]);

    // Start
    setInterval(changeBlinkState, 500);
}

function changeBlinkState() {
    blinkEvent.value = blinkEvent.value > 0 ? 0 : 1;
    client.sendGameEventUpdate(blinkEvent);
}
