'use strict';
/**
 *
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#json-color-handlers
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
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#specifying-flash-effects
     * @type {gamesense.Rate}
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
            handlerData.rate = this.rate.toRateData();
        }

        if (this.color.constructor.name === 'GradientColor') {
            handlerData.color = {
                gradient: this.color
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
