'use strict';
/**
 * @constructor
 * @param {Number} [length_millis]
 * @param {!gamesense.EventIcon} [icon_id]
 * @param {boolean | number} [repeats]
 */
 gamesense.FrameModifiers = function FrameModifiers(length_millis, icon_id, repeats) {

    /**
     * @type {Number}
     */
    this.length_millis = length_millis;

    /**
     * @type {gamesense.EventIcon}
     */
    this.icon_id = icon_id

    /**
     *  @type {boolean | Number}
     */
    this.repeats = repeats
    
 }
