'use strict';
/**
 * Color from a linear gradient
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#color-from-a-linear-gradient
 * @constructor
 * @param {gamesense.Color} zero
 * @param {gamesense.Color} hundred
 */
gamesense.GradientColor = function GradientColor(zero, hundred) {
    /**
     * @type {gamesense.Color}
     */
    this.zero = zero;

    /**
     * @type {gamesense.Color}
     */
    this.hundred = hundred;
};
