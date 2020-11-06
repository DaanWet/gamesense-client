'use strict';
/**
 * @constructor
 * @param {string} name Use only uppercase A-Z, 0-9, hyphen and underscore characters for the game name.
 * @param {string} [displayName] Optional: The display name of game in the SteelSeries Engine Interface.
 * @param {gamesense.GameColor} [iconColor] Optional: The icon color in the SteelSeries Engine Interface.
 */
gamesense.Game = function Game(name, displayName, iconColor) {
    

    /**
     * @type {string}
     */
    this.name = name.toUpperCase();

    /**
     * @type {string}
     */
    this.displayName = displayName;

    /**
     * @type {lib.GameColor}
     */
    this.iconColor = iconColor || gamesense.GameColor.SILVER;
};
