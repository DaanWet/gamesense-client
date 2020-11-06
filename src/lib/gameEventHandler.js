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
    this.deviceType = deviceType || gamesense.DeviceType.RGB_PER_KEY_ZONE;

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
     * @type {gamesense.FlashEffectFrequency}
     */
    this.rate = null;
};
