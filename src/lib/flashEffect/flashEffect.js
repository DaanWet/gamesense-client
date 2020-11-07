'use strict';
/**
 * A Flash Effect
 * @param {gamesense.FlashFrequency|gamesense.FrequencyRanges} frequency
 * @param {gamesense.RepeatLimit|gamesense.RepeatLimitRanges} [repeat_limit]
 * @constructor
 */
gamesense.FlashEffect = function FlashEffect(frequency, repeat_limit){
    /**
     * @type {gamesense.FlashFrequency|gamesense.FrequencyRanges}
     */
    this.frequency = frequency;

    /**
     * @type {gamesense.RepeatLimit|gamesense.RepeatLimitRanges}
     */
    this.repeat_limit = repeat_limit;

}
