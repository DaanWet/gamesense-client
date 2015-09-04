/**
 * List of color ranges.
 * @constructor
 * @param {Array<gamesense.ColorRange>} [ranges]
 */
gamesense.ColorRanges = function ColorRanges(ranges) {
    'use strict';

    /**
     * @type {Array<gamesense.ColorRange>}
     */
    this.ranges = ranges || [];
};
