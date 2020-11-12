'use strict';
/**
 * List of color ranges.
 * @constructor
 * @param {Array<gamesense.ColorRange>} [ranges]
 */
gamesense.ColorRanges = function ColorRanges(ranges) {
    /**
     * @type {Array<gamesense.ColorRange>}
     */
    this.ranges = ranges || [];
};
