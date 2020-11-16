'use strict';
/**
 * A static FlashFrequency.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#static-frequency
 * @param {number} frequency Number of flash times per second.
 * @constructor
 */
gamesense.Frequency = function Frequency(frequency) {

    /**
     * @type {number}
     */
    this.frequency = frequency;
};
