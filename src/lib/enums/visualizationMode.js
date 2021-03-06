'use strict';
/**
 * It controls the way that the computed color is applied to the LEDs
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-color.md#specifying-the-visualization-mode
 * @enum {string}
 */
gamesense.VisualizationMode = {
    COLOR: 'color',
    PERCENT: 'percent',
    COUNT: 'count',
    CONTEXT_COLOR: 'context-color'
};
