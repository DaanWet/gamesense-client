'use strict';
/**
 *
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#binding-an-event
 * @constructor
 * @param {gamesense.DeviceType}  [deviceType]
 * @param {string} [zone]
 * @param {gamesense.Color|gamesense.GradientColor|gamesense.ColorRanges} [color]
 */
gamesense.GameEventHandler = function GameEventHandler(deviceType, zone, color) {


    /**
     * @type {!gamesense.DeviceType}
     */
    this.deviceType = deviceType || gamesense.DeviceType.RGB_PER_KEY_ZONES;

    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md
     * @type {string}
     */
    this.zone = zone || 'logo';

    /**
     * The value is an array of zone numbers. For the APEX M800,
     * this is an array of the HID codes of the keys in the zone,
     * in the order in which the effect should be applied.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#dynamic-zones
     * @type {Array<number>}
     */
    this.customZoneKeys = null;

    /**
     * @type {!gamesense.Color|!gamesense.GradientColor}
     */
    this.color = color || new gamesense.Color(0, 0, 255);

    /**
     * @type {!gamesense.VisualizationMode}
     */
    this.mode = gamesense.VisualizationMode.COLOR;

    /**
     * Specifying flash effects
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#specifying-flash-effects
     * @type {gamesense.FlashEffect}
     */
    this.rate = null;
    /**
    * @returns {Object} The gamesense data object representing a handler.
    */
    this.toHandlerData = function toHandlerData() {
        var handlerData = {
            zone: this.zone,
            color: this.color,
            mode: this.mode
        };

        if (this.deviceType) {
            handlerData['device-type'] = this.deviceType;
        } else {
            throw new Error('bindEvent failed: Missing device type.');
        }

        if (this.rate) {
            var f;
            if (this.rate.frequency.constructor.name === 'FlashFrequency'){
                f = this.rate.frequency.frequency
            } else if (this.rate.frequency.constructor.name === 'FrequencyRanges'){
                f = this.rate.frequency.ranges.map(function f(range){return {low: range.low, high: range.high, frequency:range.freq}})
            }
            var data = {
                frequency: f
            }
            if (this.rate.repeat_limit){
                if (this.rate.repeat_limit.constructor.name === 'RepeatLimit'){
                    data.repeat_limit = this.rate.repeat_limit.repeat_limit
                } else if (this.rate.repeat_limit.constructor.name === 'RepeatLimitRanges'){
                    data.repeat_limit = this.rate.repeat_limit.ranges.map(function f(repeat_limit){return {low: range.low, high: range.high, repeat_limit:repeat_limit.repeat_limit}})
                }
            }
            handlerData.rate = data;
        }

        if (this.color.constructor.name === 'GradientColor') {
            handlerData.color = {
                gradient: handler.color
            };
        } else if (this.color.constructor.name === 'ColorRanges') {
            handlerData.color = this.color.ranges;
        }

        if (this.customZoneKeys) {
            handlerData['custom-zone-keys'] = this.customZoneKeys;
        }

        return handlerData;
    }
};
