//
// Example: Remove Game from GameSense(TM)
//
// This an other examples are using a game ID of 'EXAMPLE_TEST', visible
// as A EXAMPLE Game in the GameSense(TM) software.
//
// As of SteelSeries Engine 3.5.0 and gamesense-client 1.0.0 games can now be
// removed.

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
 * Removes the 'EXAMPLE_TEST' client from GameSense(TM)
 */
client.removeGame();
