/**
 * A static FlashEffectFrequency.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#static-frequency
 * @param {number} frequency Number of flash times per second.
 * @constructor
 */
gamesense.FlashEffectFrequency = function FlashEffectFrequency(frequency) {
    'use strict';

    /**
     * @type {number}
     */
    this.frequency = frequency;
};
