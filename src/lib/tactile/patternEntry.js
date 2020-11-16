'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-tactile.md#static-pattern
 * @constructor
 * @param {!gamesense.VibrationType} type
 * @param {number} [length_ms]
 */
gamesense.PatternEntry = function PatternEntry(type, length_ms) {
    /**
     * @type {!gamesense.VibrationType}
     */
    this.type = type;

    /**
     * @type {number}
     * delay value in ms, ignored on last entry
     */
    this.delay_ms = null;

    /**
     * @type {number}
     * length value in ms mandatory for custom pattern
     */
    this.length_ms = length_ms

    this.toPatternData = function toPatternData() {
        var d = {
            type: this.type
        }
        if (this.type === gamesense.VibrationType.CUSTOM) {
            if (this.length_ms) {
                d['length-ms'] = this.length_ms;
            } else {
                throw new Error('length_ms mandatory for custom vibration type')
            }
        }
        if (this.delay_ms){
            d['delay-ms'] = this.delay_ms;
        }
        return d
    }
}
