/**
 * A static color.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @constructor
 */
gamesense.Color = function Color(r, g, b) {
    'use strict';

    /**
     * @type {number}
     */
    this.red = r;

    /**
     * @type {number}
     */
    this.green = g;

    /**
     * @type {number}
     */
    this.blue = b;
};
