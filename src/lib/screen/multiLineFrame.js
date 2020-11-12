'use strict';
/**
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

