# gamesense-client
[![npm](https://img.shields.io/npm/v/gamesense-client.svg?style=flat-square)](https://www.npmjs.com/package/gamesense-client)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/cschuller/gamesense-client/master/LICENSE)
[![Built with Grunt](https://img.shields.io/badge/built with-grunt-yellow.svg?style=flat-square)](http://gruntjs.com/)


A SteelSeries GameSense(TM) client based on the [**gamesense-sdk**](https://github.com/SteelSeries/gamesense-sdk)

> GameSense™ is a framework in SteelSeries Engine 3 that allows games to send status 
> updates to Engine, which can then drive illumination (and potentially more) 
> capabilities of SteelSeries devices. 

This is not an official client implementation. GameSense is a trademark of [**steelseries**](http://steelseries.com/). 

## Getting started

Install the client library via ```npm```

``` npm install gamesense-client --save ```

and use the gamesense-client module:

``` var gamesense = require('gamesense-client'); ```

Take a look at the [**examples**](https://github.com/cschuller/gamesense-client/tree/master/examples) to get started. 
Every example can be run alone, for example:

``` node blinkingNavigation ```

Examples are not part of the ```npm``` package.

## Developing a game or app
 
Start with the [**gamesense-sdk**](https://github.com/SteelSeries/gamesense-sdk) 
 
### What's new in 1.0.0

- Support for SteelSeries GameSense(TM) > 3.5.0
- Remove game 
- Remove event
- Using new status codes for better error handling. Full support for promises.
- All examples updated. 

