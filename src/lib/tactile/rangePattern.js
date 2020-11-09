'use strict';

/**
 * @constructor
 * @param {number} low Minimum value, inclusive.
 * @param {number} high Maximum value, inclusive.
 * @param {Array<gamesense.PatternEntry> | gamesense.RangePattern} pattern Static Frequency
 */
gamesense.RangePattern = function RangePattern(low, high, pattern){
    /**
     * @type {number}
     */
    this.low = low;

    /**
     * @type {number}
     */
    this.high = high;

    /**
     * @type {Array<gamesense.PatternEntry> | gamesense.RangePattern}
     */
    this.pattern = pattern;

    this.toPatternData = function toPatternData() {
        var data = {
            low: this.low,
            high: this.high
        }
        if (this.pattern.constructor.name === 'RangePattern') {
            data.pattern = this.pattern.toPatternData();
        } else {
            data.pattern = this.pattern.map(function f(patt) {return patt.toPatternData()})
        }
        return data;
    }
}
