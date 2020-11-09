'use strict';
/**
 * List of frequency ranges.
 * @constructor
 * @param {Array<gamesense.FrequencyRange>} [ranges]
 */
gamesense.FrequencyRanges = function FrequencyRanges(ranges) {
    /**
     * @type {Array<gamesense.FrequencyRange>}
     */
    this.ranges = ranges || [];
};
