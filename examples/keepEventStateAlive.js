//
// Example: Keep an event state alive during time of inactivity.
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
 * Setup an event that will change only once after game start.
 * @type {gamesense.GameEvent}
 */
var isStartedEvent = new gamesense.GameEvent('IS_STARTED');

/**
 * Let's register our game.
 */
client.registerGame()
    .then(registerStartedEvent)
    .then(bindStartedHandler)
    .then(startGame);

/**
 * Register event.
 * @returns {Promise}
 */
function registerStartedEvent() {
    return client.registerEvent(isStartedEvent);
}


/**
 * Binds the is started handler to the keyboard device.
 */
function bindStartedHandler() {
    var allOkayColor = new gamesense.Color(0, 255, 0);

    /**
     * The ESC key shall light RED for the started event.
     * @type {gamesense.GameEventHandler}
     */
    var functionKeysEventHandler = new gamesense.GameEventHandler(gamesense.DeviceType.RGB_PER_KEY_ZONES, gamesense.RgbPerKeyZone.MACRO_KEYS, allOkayColor);
    return client.bindEvent(isStartedEvent, [functionKeysEventHandler]);
}

function startGame() {
    console.log('Starting the game...');
    isStartedEvent.value = 1;
    client.sendGameEventUpdate(isStartedEvent);

    // Use heartbeat to keep the current state alive.
    client.startHeartbeatSending();
}