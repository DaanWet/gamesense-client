/**
 * Pre defined Device Types
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/standard-zones.md#device-types
 * @enum {string}
 */
gamesense.DeviceType = {
    /**
     * Any connected, supported keyboard. Initially the Apex M800, Apex 300, MSI GE62, and MSI GE72.
     */
    KEYBOARD: 'keyboard',

    /**
     * Any connected, supported mouse. Initially the Rival, Dota 2 Rival, Sensei Wireless, and Sims 4 Mouse.
     */
    MOUSE: 'mouse',

    /**
     * Any connected, supported headset. Initially the Siberia Elite line and Siberia v3 Prism.
     */
    HEADSET: 'headset',

    /**
     * Any connected, supported simple indicator device. Initially the Sims4 Plumbob and Valve Dota 2 indicator.
     */
    INDICATOR: 'indicator',

    /**
     * Any connected, supported, single zone RGB device. Initially the Siberia Elite line, Siberia v3 Prism, and Sims 4 line.
     */
    RGB_1_ZONE: 'rgb-1-zone',

    /**
     * Any connected, supported, dual zone RGB device. Initially the Rival mouse.
     */
    RGB_2_ZONE: 'rgb-2-zone',

    /**
     * Any connected, supported, three zone RGB device. Initially the Sensei Wireless mouse, the MSI GE62 keyboard, and the MSI GE72 keyboard.
     */
    RGB_3_ZONE: 'rgb-3-zone',

    /**
     * Any connected, supported, five zone RGB device. Initially the Apex 300 keyboard.
     */
    RGB_5_ZONE: 'rgb-5-zone',

    /**
     * Any connected, supported, keyboard with a lighting zone for each key. Initially the APEX M800 keyboard.
     */
    RGB_PER_KEY_ZONES: 'rgb-per-key-zones'
};
