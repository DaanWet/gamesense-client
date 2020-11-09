'use strict';
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
     * A generic specifier that applies to any connected, supported RGB device that has a static number of lighting zones. 
     * This can be used to apply settings to a certain zone on all of the types of devices in the list below at once. 
     * When using this type, a handler will be created for each type below that has the specified zone.
     */

    RGB_ZONED: 'rgb-zoned-device',

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
     * Any connected, supported, eight zone RGB device. Initially the Rival 600 and Rival 650 mice.
     */
    RGB_8_ZONE: 'rgb-8-zone',

    /**
     * Any connected, supported, twelve zone RGB device. Initially the QCK Prism mousepad
     */
    RGB_12_ZONE: 'rgb-12-zone',


    /**
     * Any connected, supported, seventeen zone RGB device. Initially the MSI Z270 Gaming Pro Carbon motherboard.
     */
    RGB_17_ZONE: 'rgb-17-zone',

    /**
     * Any connected, supported, twenty-four zone RGB device. Initially the MSI Mystic Light.
     */
    RGB_24_ZONE: 'rgb-24-zone',

    /**
     * Any connected, supported, one hundred three zone RGB device. Initially the MSI MPG27C and MPG27CQ monitors.
     */
    RGB_103_ZONE: 'rgb-103-zone',


    /**
     * Any connected, supported, keyboard with a lighting zone for each key. Initially the APEX M800 keyboard.
     */
    RGB_PER_KEY_ZONES: 'rgb-per-key-zones',

    /**
     * Any connected, supported device that supports notifications on a single OLED or LCD screen. 
     * Initially the Rival 700, Rival 710, Arctis Pro Wireless, and GameDAC.
     */
    SCREENED: 'screened',

    
};
