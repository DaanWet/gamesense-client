'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#static-frame-data
 * @constructor
 * @param {Array<gamesense.LineData>} lines
 * @param {gamesense.FrameModifiers} [frame_modifiers]
 */
gamesense.MultiLineFrame = function MultiLineFrame(lines, frame_modifiers) {
    /**
    * @type {Array<gamesense.LineData>}
    */
    this.lines = lines;

    /**
     * @type {!gamesense.FrameModifiers}
     */
    this.frame_modifiers = frame_modifiers;

}

