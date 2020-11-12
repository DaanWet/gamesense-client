'use strict';
/**
 * A concrete RepeatLimit range.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#ranged-repeat-limit-example
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {gamesense.RepeatLimit} repeat_limit Static Frequency
 */
gamesense.RepeatLimitRange = function RepeatLimitRange(low, high, repeat_limit) {
    

    /**
     * @type {number}
     */
    this.low = low;

    /**
     * @type {number}
     */
    this.high = high;

    /**
     * @type {gamesense.RepeatLimit}
     */
    this.repeat_limit = repeat_limit;
};