'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-screen.md#describing-the-screen-notification
 * @constructor
 * @param {boolean} [progress_bar]
 */
gamesense.LineData = function LineData(progress_bar){
    /**
     * @type {boolean}
     */
    this.progress_bar = progress_bar;
    /**
     * @type {string}
     */
    this.prefix = null;
    /**
     * @type {string}
     */
    this.suffix = null;
    /**
     * @type {boolean}
     */
    this.bold = null;
    /**
     * @type {number}
     */
    this.wrap = null;
    /**
     * @type {string}
     */
    this.arg = null;
    /**
     * @type {string}
     */
    this.context_frame_key = null;

    this.toLineData = function toLineData() {
        var data = {
            'has-text': true
        }
        if (this.progress_bar){
            data['has-progress-bar'] = this.progress_bar;
            data['has-text'] = false
        }
        if (this.prefix){
            data.prefix = this.prefix;
        }
        if (this.suffix){
            data.suffix = this.suffix;
        }
        if (this.bold){
            data.bold = this.bold;
        }
        if (this.wrap){
            data.wrap = this.wrap;
        }
        if (this.arg){
            data.arg = this.arg;
        }
        if (this.context_frame_key){
            data['context-frame-key'] = this.context_frame_key;
        }
        return data
    }
    
}
