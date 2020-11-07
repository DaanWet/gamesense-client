'use strict';
/**
 * List of repeat limit ranges.
 * @constructor
 * @param {Array<gamesense.RepeatLimitRange>} [ranges]
 */
gamesense.RepeatLimitRanges = function RepeatLimitRanges(ranges) {
    /**
     * @type {Array<gamesense.RepeatLimitRange>}
     */
    this.ranges = ranges || [];
};
