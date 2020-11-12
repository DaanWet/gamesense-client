'use strict';
/**
 * A Rate
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#specifying-flash-effects
 * @param {gamesense.Frequency|gamesense.FrequencyRanges} frequency
 * @param {gamesense.RepeatLimit|gamesense.RepeatLimitRanges} [repeat_limit]
 * @constructor
 */
gamesense.Rate = function Rate(frequency, repeat_limit){
    /**
     * @type {gamesense.Frequency|gamesense.FrequencyRanges}
     */
    this.frequency = frequency;

    /**
     * @type {gamesense.RepeatLimit|gamesense.RepeatLimitRanges}
     */
    this.repeat_limit = repeat_limit;


    this.toRateData = function toRateData() {
        var f;
        if (this.frequency.constructor.name === 'Frequency'){
            f = this.frequency.frequency
        } else if (this.frequency.constructor.name === 'FrequencyRanges'){
            f = this.frequency.ranges.map(function f(range){return {low: range.low, high: range.high, frequency:range.freq}})
        }
        var data = {
            frequency: f
        }
        if (this.repeat_limit){
            if (this.repeat_limit.constructor.name === 'RepeatLimit'){
                data.repeat_limit = this.repeat_limit.repeat_limit
            } else if (this.repeat_limit.constructor.name === 'RepeatLimitRanges'){
                data.repeat_limit = this.repeat_limit.ranges.map(function f(repeat_limit){return {low: range.low, high: range.high, repeat_limit:repeat_limit.repeat_limit}})
            }
        }
        return data;
    }
}
