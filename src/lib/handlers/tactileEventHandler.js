'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-tactile.md
 * @constructor
 * @param {gamesense.DeviceType} [deviceType]
 * @param {gamesense.ScreenZone} [zone]
 * @param {Array<gamesense.PatternEntry> | gamesense.RangePattern} [pattern]
 * @param {!gamesense.Rate} [rate]
 */
gamesense.TactileEventHandler = function TactileEventHandler(deviceType, zone, pattern, rate){
    /**
     * @type {!gamesense.DeviceType}
     */
    this.deviceType = deviceType || gamesense.DeviceType.TACTILE;

    /**
     * @type {!gamesense.TactileZone}
     */
    this.zone = zone || gamesense.TactileZone.ONE;

    /**
     * @type {Array<gamesense.PatternEntry> | gamesense.RangePattern}
     */
    this.pattern = pattern || [];

    /**
     * @type {!gamesense.Rate}
     */
    this.rate = rate;

    this.toHandlerData = function toHandlerData() {
        var handlerData = {
            zone: this.zone,
            mode: 'vibrate'
        };
        if (this.pattern.constructor.name === 'RangePattern') {
            handlerData.pattern = this.pattern.toPatternData();
        } else {
            handlerData.pattern = this.pattern.map(function f(patt) {return patt.toPatternData()})
        }
        if (this.deviceType) {
            handlerData['device-type'] = this.deviceType;
        } else {
            throw new Error('bindEvent failed: Missing device type.');
        }

        if (this.rate) {
            handlerData.rate = this.rate.toRateData();
        }

        return handlerData;
    }

}
