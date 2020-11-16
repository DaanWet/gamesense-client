'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#showing-raw-bitmaps
 * @constructor
 * @param {Array<gamesense.LineData>} image_data
 * @param {gamesense.FrameModifiers} [frame_modifiers]
 */
gamesense.MultiLineFrame = function MultiLineFrame(image_data, frame_modifiers) {
    /**
    * @type {Array<number>}
    */
    this.image_data = image_data;

    /**
     * @type {!gamesense.FrameModifiers}
     */
    this.frame_modifiers = frame_modifiers;

}

