//
// Example: Radiation Warning Flash
//
// Let's assume we have a game/app with a radiation warning
// and want to blink/flash a key/zone.
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
 * Setup of our event.
 * @type {gamesense.GameEvent}
 */
var radiationWarningEvent = new gamesense.GameEvent('RADIATION_WARNING');

/**
 * Let's setup and start everything.
 * The SteelSeries GameSense� SDK is not very exact about the ordering of the different steps.
 * So let's wait on every request for the response to start the next step. The gamesense-client
 * provides Promises to do this in a very easy way.
 */
client.registerGame()
    .then(bindRadiationWarningHandler)
    .then(activateRadiationWarning)
    .catch(logError);

/**
 * Binds the blink handler to the keyboard device.
 */
function bindRadiationWarningHandler() {
    var warningColor = new gamesense.Color(255, 255, 0);

    /**
     * Setup of a event handler for the keyboard device and the function key zone.
     * @type {gamesense.GameEventHandler}
     */
    var radiationWarningEventHandler = new gamesense.GameEventHandler(gamesense.DeviceType.KEYBOARD, gamesense.RgbPerKeyZone.STEELSERIES_KEY, warningColor);
    radiationWarningEventHandler.rate = new gamesense.FlashEffectFrequency(4);

    return client.bindEvent(radiationWarningEvent, [radiationWarningEventHandler]);
}

/**
 * Activate the radiation warning. In this example we do not send any heartbeat to keep the game/app alive,
 * so the radiation warning will last for 15 seconds. (default game/app timeout)
 */
function activateRadiationWarning() {
    radiationWarningEvent.value = 1;
    client.sendGameEventUpdate(radiationWarningEvent).catch(logError);
}

/**
 * Logs an error to the console.
 */
function logError(error) {
    console.log(error);
}
