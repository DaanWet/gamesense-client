'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md
 * @constructor
 * @param {gamesense.DeviceType} [deviceType]
 * @param {gamesense.ScreenZone} [zone]
 */
gamesense.ScreenEventHandler = function ScreenEventHandler(deviceType, zone) {

    /**
     * @type {!gamesense.DeviceType}
     */
    this.deviceType = deviceType || gamesense.DeviceType.SCREENED;

    /**
     * @type {!gamesense.ScreenZone}
     */
    this.zone = zone || gamesense.ScreenZone.ONE;

    //this.mode = 'screen';
    /**
     * @type {Array<gamesense.RangeScreenData> | Array<gamesense.SingleLineFrame | gamesense.MultiLineFrame | gamesense.ImageFrame>}
     */
    this.datas = null;


    this.toHandlerData = function toHandlerData() {
        var handlerData = {
            zone: this.zone,
            mode: 'screen'
        };
        handlerData['device-type'] = this.deviceType;
        function mapRangeScreenData(elem) {
            return {
                low: elem.low,
                high: elem.high,
                datas: elem.datas.map(function f(frame) { return toFrameData(frame); })
            };
        }

        function toFrameData(frame) {
            var frameData = {};
            if (frame.frame_modifiers) {
                if (frame.frame_modifiers.length_millis) {
                    frameData['length-millis'] = frame.frame_modifiers.length_millis;
                }
                if (frame.frame_modifiers.icon_id) {
                    frameData['icon-id'] = frame.frame_modifiers.icon_id;
                }
                if (frame.frame_modifiers.repeats) {
                    frameData.repeats = frame.frame_modifiers.repeats;
                }
            }
            if (frame.constructor.name === 'SingleLineFrame') {
                var lData = frame.line_data.toLineData();
                for (var key in lData) {
                    frameData[key] = lData[key];
                }
            } else if (frame.constructor.name === 'MultiLineFrame') {
                frameData.lines = frame.lines.map(function f(line) { return line.toLineData(); });
            } else if (frame.constructor.name === 'ImageFrame') {
                frameData['has-text'] = false;
                frameData['image-data'] = frame.image_data;
            }
            return frameData;
        }
        /*if (this.datas) {
            const mapper = this.datas[0] isInstanceOf RangeScreenData ?mapRangeScreenData: toFrameData;
            handlerData.datas = this.datas.map(mapper);
        }*/
        if (this.datas && this.datas[0].constructor.name === 'RangeScreenData') {
            handlerData.datas = this.datas.map(function f(frame) { return mapRangeScreenData(frame); });
        } else if (this.datas) {
            handlerData.datas = this.datas.map(function f(frame) { return toFrameData(frame); });
        }

        return handlerData;
    };
};
