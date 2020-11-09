'use strict';
/**
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
