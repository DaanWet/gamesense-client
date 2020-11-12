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
