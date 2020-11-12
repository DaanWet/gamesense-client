'use strict';
/**
 * List of frequency ranges.
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#frequency-ranges
 * @constructor
 * @param {Array<gamesense.FrequencyRange>} [ranges]
 */
gamesense.FrequencyRanges = function FrequencyRanges(ranges) {
    /**
     * @type {Array<gamesense.FrequencyRange>}
     */
    this.ranges = ranges || [];
};
