'use strict';
/**
 * List of repeat limit ranges.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#ranged-repeat-limit-example
 * @constructor
 * @param {Array<gamesense.RepeatLimitRange>} [ranges]
 */
gamesense.RepeatLimitRanges = function RepeatLimitRanges(ranges) {
    /**
     * @type {Array<gamesense.RepeatLimitRange>}
     */
    this.ranges = ranges || [];
};
