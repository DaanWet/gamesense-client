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
- Releasing npm package
- The Escape key ```gamesense.RgbPerKeyZone.ESCAPE``` does not work. Seams to be a bug of the SteelSeries(TM) Engine 3.4.3 or the Apex M800 Firmware 1.24.0.0

### Cleanup/Remove Game

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
