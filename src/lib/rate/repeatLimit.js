'use strict';
/**
 * A static RepeatLimit.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#flash-repeat-limit
 * @param {number} repeat_limit number of repeats
 * @constructor
 */
gamesense.RepeatLimit = function RepeatLimit(repeat_limit) {

    /**
     * @type {number}
     */
    this.repeat_limit = repeat_limit;
};
