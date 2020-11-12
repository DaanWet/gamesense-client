
# gamesense-client

[![npm](https://img.shields.io/npm/v/gamesense-client.svg?style=flat-square)](https://www.npmjs.com/package/gamesense-client)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/cschuller/gamesense-client/master/LICENSE)
[![Built with Grunt](https://img.shields.io/badge/built%20with-grunt-yellow.svg?style=flat-square)](http://gruntjs.com/)

A SteelSeries GameSense(TM) client based on the [**gamesense-sdk**](https://github.com/SteelSeries/gamesense-sdk) and on the [**original library**](https://github.com/cschuller/gamesense-client)

> GameSense™ is a framework in SteelSeries Engine 3 that allows games to send status
> updates to Engine, which can then drive illumination (and potentially more)
> capabilities of SteelSeries devices.

This is not an official client implementation. GameSense is a trademark of [**steelseries**](http://steelseries.com/).

## Getting started

### Install the client library via ```npm``` (only 1.0.0 and lower)

``` npm install gamesense-client --save ```

### Install 2.0.0 (temporary solution)

- Install the library via npm and download the files in the [**dist folder**](https://github.com/cschuller/gamesense-client/tree/master/dist)
- Replace the files in your node_modules folder

and use the gamesense-client module:

``` var gamesense = require('gamesense-client'); ```

Take a look at the [**examples**](https://github.com/DaanWet/gamesense-client/tree/master/examples) to get started.
Every example can be run alone, for example:

``` node blinkingNavigation ```

Examples are not part of the ```npm``` package.

## Developing a game or app

Start with the [**gamesense-sdk**](https://github.com/SteelSeries/gamesense-sdk)

## What's new in 2.0.0

- Support for SteelSeries GameSense(TM) > 3.7.0

- Added new event icons
- Added developer and deinitialize timer length to Game
- Added the ability to specify a custom path for the coreProps.json files
- Reworked frequency
- Added frequency ranges and repeat limit ranges
- Added OLED support
- Added tactile support
- Added new RGB zones and RGB zoned devices
