/**
 * A concrete color range.
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {gamesense.Color|gamesense.GradientColor} color
 */
gamesense.ColorRange = function ColorRange(low, high, color) {
    'use strict';

    /**
     * @type {number}
     */
    this.low = low;

    /**
     * @type {number}
     */
    this.high = high;

    /**
     * @type {gamesense.Color|gamesense.GradientColor}
     */
    this.color = color;
};
