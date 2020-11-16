
# gamesense-client

[![npm](https://img.shields.io/npm/v/gamesense-client.svg?style=flat-square)](https://www.npmjs.com/package/gamesense-client)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/cschuller/gamesense-client/master/LICENSE)
[![Built with Grunt](https://img.shields.io/badge/built%20with-grunt-yellow.svg?style=flat-square)](http://gruntjs.com/)

A SteelSeries GameSense(TM) client based on the [**gamesense-sdk**](https://github.com/SteelSeries/gamesense-sdk), credits to [cschuller](https://github.com/cschuller) who started this library.

> GameSense™ is a framework in SteelSeries Engine 3 that allows games to send status
> updates to Engine, which can then drive illumination (and potentially more)
> capabilities of SteelSeries devices.

This is not an official client implementation. GameSense is a trademark of [**steelseries**](http://steelseries.com/).

## Getting started

Install the client library via ```npm```

``` npm install gamesense-client --save ```

and use the gamesense-client module:

``` var gamesense = require('gamesense-client'); ```

Take a look at the [**examples**](https://github.com/DaanWet/gamesense-client/tree/master/examples) to get started.
Every example can be run alone, for example:

``` node blinkingNavigation ```

Examples are not part of the ```npm``` package.

## Developing a game or app

Start with the [**gamesense-sdk**](https://github.com/SteelSeries/gamesense-sdk)

## What's new in 2.0.1

- Support for SteelSeries GameSense(TM) 3.18.4

- New event icons
- Added developer and deinitialize timer length to Game
- Added the ability to specify a custom path for the coreProps.json files
- Reworked frequency
- Frequency ranges and repeat limit ranges
- OLED support
- Tactile support
- New RGB zones and RGB zoned devices
- Bitmap and partial bitmap mode
- Context color mode
- Update multiple events at once
