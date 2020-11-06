'use strict';
/**
 * A static FlashEffectFrequency.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#static-frequency
 * @param {number} frequency Number of flash times per second.
 * @constructor
 */
gamesense.FlashEffectFrequency = function FlashEffectFrequency(frequency) {

    /**
     * @type {number}
     */
    this.frequency = frequency;
};
