'use strict';
/**
 * List of color ranges.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#color-based-on-ranges
 * @constructor
 * @param {Array<gamesense.ColorRange>} [ranges]
 */
gamesense.ColorRanges = function ColorRanges(ranges) {
    /**
     * @type {Array<gamesense.ColorRange>}
     */
    this.ranges = ranges || [];
};
