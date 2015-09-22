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
 
#### Trick to cleanup / remove a registered game

--- AT YOUR OWN RISK ---

The SteelSeries GameSense(TM) SDK/API does not provide a way to unregister or cleanup a game. When playing around with
different event handlers sometimes things are messed up a little bit and you want to remove the game.

All the games, events and handlers are stored in a *SQLite* database.
The database file can be found in one of these locations, depending on OS:

**OSX**     | `/Library/Application Support/SteelSeries Engine 3/db/database.db`

**Windows** | `%PROGRAMDATA%/SteelSeries/SteelSeries Engine 3/db/database.db`

Edit the ```game_integration_games``` table and delete the corresponding row. You may also cleanup some other tables. 
The [**DB Browser for SQLite**](http://sqlitebrowser.org/) is a good tool for this job.

As always: It is ```highly recommended``` to make a backup before editing a database you don't own. ;-)
