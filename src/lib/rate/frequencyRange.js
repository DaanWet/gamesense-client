'use strict';
/**
 * A concrete flashfrequency range.
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {gamesense.FlashFrequency} frequency Static Frequency
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
     * @type {gamesense.flashFrequency}
     */
    this.freq = frequency;
};