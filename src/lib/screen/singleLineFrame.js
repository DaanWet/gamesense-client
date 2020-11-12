'use strict';
/** 
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#static-frame-data
 * @constructor
 * @param {gamesense.LineData} line_data
 * @param {gamesense.FrameModifiers} [frame_modifiers]
 */
gamesense.SingleLineFrame = function SingleLineFrame(line_data, frame_modifiers) {
    /**
     * @type {!gamesense.LineData}
     */
    this.line_data = line_data;

    /**
     * @type {!gamesense.FrameModifiers}
     */
    this.frame_modifiers = frame_modifiers
}
