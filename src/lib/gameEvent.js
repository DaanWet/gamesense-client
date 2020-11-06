'use strict';
/**
 * @param {string} name
 * @constructor
 */
gamesense.GameEvent = function GameEvent(name) {
    

    /**
     * @type {string}
     */
    this.name = name.toUpperCase();

    /**
     * @type {!gamesense.EventIcon}
     */
    this.icon = gamesense.EventIcon.NO_ICON;

    /**
     * @type {number}
     */
    this.minValue = 0;

    /**
     * @type {number}
     */
    this.maxValue = 1;

    /**
     * @type {number}
     */
    this.value = 0;
};
