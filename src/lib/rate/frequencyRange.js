'use strict';
/**
 * A concrete flashfrequency range.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#frequency-ranges
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {gamesense.Frequency} frequency Static Frequency
 */
gamesense.FrequencyRange = function FrequencyRange(low, high, frequency) {
    

    /**
     * @type {number}
     */
    this.low = low;

    /**
     * @type {number}
     */
    this.high = high;

    /**
     * @type {gamesense.Frequency}
     */
    this.freq = frequency;
};