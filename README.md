# gamesense-client
A JavaScript GameSense(TM) Client based on the [**gamesense-sdk**](https://github.com/SteelSeries/gamesense-sdk)

### Getting started

Take a look at the [**examples**](https://github.com/cschuller/gamesense-client/tree/master/examples)

### Latest version
0.1.0-SNAPSHOT

### Open Issues
- Auto discovery of the GameSense(TM) engine does not work on OSX.
    - Pull-Request is highly welcome, see TODO of the ```Endpoint```
    - Use url parameter of ```gamesense.Endpoint``` instead.
- Ranged colors for event handlers not supported.
- Releasing npm package
- The Escape key ```gamesens.RgbPerKeyZone.ESCAPE``` does not work. Seams to be a bug of the SteelSeries(TM) Engine 3.4.3 or the Apex M800 Firmware 1.24.0.0
