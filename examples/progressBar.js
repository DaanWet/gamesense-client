//
// Example: Progress Animation with color change
// Creates a progress in the A key row.
// Starting with a red color for 0% and a blue color for 100%
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
var progressEvent = new gamesense.GameEvent('PROGRESS');
progressEvent.maxValue = 100;

/**
 * Register our blink event
 */
client.registerEvent(progressEvent).then(bindProgressKeyboardHandler);

/**
 * Binds the blink handler to the keyboard device.
 */
function bindProgressKeyboardHandler() {
    var blue = new gamesense.Color(0, 0, 255);
    var red = new gamesense.Color(255, 0, 0);
    var gradient = new gamesense.GradientColor(red, blue);

    /**
     * Setup of a event handler for the keyboard device and the function key zone.
     * @type {gamesense.GameEventHandler}
     */
    var functionKeysEventHandler = new gamesense.GameEventHandler(gamesense.DeviceType.KEYBOARD, gamesense.RgbPerKeyZone.A_ROW, gradient);
    functionKeysEventHandler.mode = gamesense.VisualizationMode.PERCENT;

    client.bindEvent(progressEvent, [functionKeysEventHandler]);

    // Start
    setInterval(updateProgress, 200);
}

function updateProgress() {
    progressEvent.value = progressEvent.value + 5;
    if (progressEvent.value > 100) {
        progressEvent.value = 0;
    }
    client.sendGameEventUpdate(progressEvent);
}
