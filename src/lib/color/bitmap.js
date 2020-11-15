'use strict';

/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-full-keyboard-lighting.md
 * @constructor
 * @param {Array<gamesense.Color>} bitarray array of length 132
 * @param {Array<gamesense.GameEvent>} [excluded_events]
 */
gamesense.Bitmap = function Bitmap(bitarray, excluded_events){
    /**
     * @type {Array<Array<number>>}
     * 
     */
    this.bitmap = bitarray.map(function f(color){return [color.red, color.green, color.blue]})

    /**
     * @type {Array<string>}
     */
    this.excluded_events = excluded_events ? excluded_events.map(function f(event) {return event.name}) : null
}
