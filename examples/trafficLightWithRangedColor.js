//
// Example: Traffic light using ranged color.
//
// This basic example shows a complete workflow to realize a traffic light on a key.
// - Register Game
// - Register Event
// - Bind Handler
// - Update Event
//
// This code is using the ranged color to set different colors on one key (zone).
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
 * Setup of our traffic light event.
 * 0 - 29       ... stop
 * 30 - 59      ... warning
 * 60 - 89      ... go
 * 90 - 119     ... warning
 * @type {gamesense.GameEvent}
 */
var trafficLightEvent = new gamesense.GameEvent('TRAFFIC_LIGHT');
trafficLightEvent.maxValue = 119;

/**
 * Let's setup and start everything.
 * The SteelSeries GameSense� SDK is not very exact about the ordering of the different steps.
 * So let's wait on every request for the response to start the next step. The gamesense-client
 * provides Promises to do this in a very easy way.
 */
client.registerGame()
    .then(bindTrafficLightHandler)
    .then(startTrafficLightUpdates)
    .catch(logError);

/**
 * Binds the blink handler to the keyboard device.
 */
function bindTrafficLightHandler() {
    var red = new gamesense.Color(255, 0, 0);
    var yellow = new gamesense.Color(255, 255, 0);
    var green = new gamesense.Color(0, 255, 0);

    var trafficLightColors = new gamesense.ColorRanges([
        new gamesense.ColorRange(0, 29, red),
        new gamesense.ColorRange(30, 59, yellow),
        new gamesense.ColorRange(60, 89, green),
        new gamesense.ColorRange(90, 129, yellow)
    ]);

    /**
     * Setup of a event handler for the keyboard device and the function key zone.
     * @type {gamesense.GameEventHandler}
     */
    var trafficLightEventHandler = new gamesense.GameEventHandler(gamesense.DeviceType.RGB_PER_KEY_ZONES, gamesense.RgbPerKeyZone.LOGO, trafficLightColors);

    return client.bindEvent(trafficLightEvent, [trafficLightEventHandler]);
}

/**
 * Start Traffic Lights Updates
 */
function startTrafficLightUpdates() {
    setInterval(updateTrafficLightEvent, 1000);
}

/**
 * Toggles the blink event value between 0 and 1.
 */
function updateTrafficLightEvent() {
    trafficLightEvent.value = trafficLightEvent.value + 30;

    if (trafficLightEvent.value > trafficLightEvent.maxValue) {
        trafficLightEvent.value = trafficLightEvent.minValue;
    }

    client.sendGameEventUpdate(trafficLightEvent).catch(logError);
}

/**
 * Logs an error to the console.
 */
function logError(error) {
    console.log(error);
}
