'use strict';
/**
 * A concrete color range.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#color-based-on-ranges
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {gamesense.Color|gamesense.GradientColor} color
 */
gamesense.ColorRange = function ColorRange(low, high, color) {
    

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
