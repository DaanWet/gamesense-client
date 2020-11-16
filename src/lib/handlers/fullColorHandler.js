'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-full-keyboard-lighting.md
 * @constructor
 * @param {boolean} [partial_bitmap]
 * @param {Array<GameEvent>} [excluded]
 */
gamesense.FullColorHandler = function FullColorHandler(partial_bitmap, excluded) {


    /**
     * @type {boolean}
     */
    this.partial_bitmap = partial_bitmap || false;


    /**
     * @type {Array<GameEvent>}
     */
    this.excluded_events = excluded;

    this.toHandlerData = function toHandlerData() {
        var data = {
            mode: this.partial_bitmap ? 'partial-bitmap' : 'bitmap',
            'device-type': 'rgb-per-key-zones'
        }
        if (this.excluded_events){
            data['excluded-events'] = this.excluded_events.map(function f(event) {return event.name})
        }
        return data
    }
} 
