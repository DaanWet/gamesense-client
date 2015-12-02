//
// Example: Progress Animation with color change
//
// Creates a progress bar in the A key row.
// Using a gradient color effect, starting with a red color for 0% and a blue color for 100%
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
 * Setup the progress event.
 * @type {gamesense.GameEvent}
 */
var progressEvent = new gamesense.GameEvent('PROGRESS');
progressEvent.maxValue = 100;

/**
 * Let's register our game.
 */
client.registerGame()
    .then(bindProgressHandler)
    .then(startProgressUpdates)
    .catch(logError);

/**
 * Binds the progress handler.
 * @returns {Promise}
 */
function bindProgressHandler() {
    var blue = new gamesense.Color(0, 0, 255);
    var red = new gamesense.Color(255, 0, 0);
    var gradient = new gamesense.GradientColor(red, blue);

    /**
     * Setup of a event handler for the keyboard device and the function key zone.
     * @type {gamesense.GameEventHandler}
     */
    var functionKeysEventHandler = new gamesense.GameEventHandler(gamesense.DeviceType.RGB_PER_KEY_ZONES, gamesense.RgbPerKeyZone.FUNCTION_KEYS, gradient);
    functionKeysEventHandler.mode = gamesense.VisualizationMode.PERCENT;

    return client.bindEvent(progressEvent, [functionKeysEventHandler]);
}

function startProgressUpdates() {
    setInterval(updateProgress, 200);
}

function updateProgress() {
    progressEvent.value = progressEvent.value + 5;
    if (progressEvent.value > progressEvent.maxValue) {
        progressEvent.value = progressEvent.minValue;
    }

    client.sendGameEventUpdate(progressEvent).catch(logError);
}

/**
 * Logs an error to the console.
 */
function logError(error) {
    console.log(error);
}