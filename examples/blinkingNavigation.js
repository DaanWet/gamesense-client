//
// Example: Blinking Navigation Buttons
//
// This basic example shows a complete workflow for a single blink event.
// - Register Game
// - Register Event
// - Bind Handler
// - Update Event
//
// This code demonstrates how to implement a "blink" effect without using
// the flash effects from GameSense(TM). Look at the 'flash' example for
// more information
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
var game = new gamesense.Game('EXAMPLE_TEST', 'A EXAMPLE GAME', gamesense.GameColor.SILVER);

/**
 * Create a client for our game and the local GameSense(TM) Engine web server.
 * @type {gamesense.GameClient}
 */
var client = new gamesense.GameClient(game, endpoint);

/**
 * Setup of our blink event.
 * @type {gamesense.GameEvent}
 */
var blinkEvent = new gamesense.GameEvent('IS_BLINK_ACTIVE');

/**
 * Let's setup and start everything.
 * The SteelSeries GameSense� SDK is not very exact about the ordering of the different steps.
 * So let's wait on every request for the response to start the next step. The gamesense-client
 * provides Promises to do this in a very easy way.
 */
client.registerGame()
    .then(bindBlinkHandler)
    .then(startBlinkEventUpdates)
    .catch(logError);

/**
 * Binds the blink handler to the keyboard device.
 */
function bindBlinkHandler() {
    var blinkColor = new gamesense.Color(0, 0, 255);

    /**
     * Setup of a event handler for the keyboard device and the function key zone.
     * @type {gamesense.GameEventHandler}
     */
    var functionKeysEventHandler = new gamesense.GameEventHandler(gamesense.DeviceType.KEYBOARD, gamesense.RgbPerKeyZone.NAV_CLUSTER, blinkColor);

    return client.bindEvent(blinkEvent, [functionKeysEventHandler]);
}

/**
 * Start blinking interval
 */
function startBlinkEventUpdates() {
    setInterval(updateBlinkEvent, 500);
}

/**
 * Toggles the blink event value between 0 and 1.
 */
function updateBlinkEvent() {
    blinkEvent.value = blinkEvent.value > 0 ? 0 : 1;
    console.log('updateBlinkEvent', {blinkEvent: blinkEvent});
    client.sendGameEventUpdate(blinkEvent).catch(logError);
}

/**
 * Logs an error to the console.
 */
function logError(error) {
    console.log(error);
}
