'use strict';
/**
 * A static FlashFrequency.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#static-frequency
 * @param {number} frequency Number of flash times per second.
 * @constructor
 */
gamesense.FlashFrequency = function FlashFrequency(frequency) {

    /**
     * @type {number}
     */
    this.frequency = frequency;
};
