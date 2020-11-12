'use strict';
/**
 * The GameSense(TM) Client
 * @constructor
 * @param {gamesense.Game} game The game.
 * @param {gamesense.ServerEndpoint} endpoint The GameSense(TM) server.
 */
gamesense.GameClient = function GameClient(game, endpoint) {


    var http = require('http');
    var Promise = require('promise');
    //var _ = require('underscore');

    /**
     * The heartbeat interval in seconds.
     * A least one event every 15 seconds is required.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#heartbeatkeepalive-events
     * @type {number}
     */
    var HEARTBEAT_INTERVAL = 10;

    /**
     * @type {?number}
     */
    var heartbeatIntervalId = null;

    /**
     * Register the given game.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#registering-a-game
     * @returns {Promise} Returns the promise.
     */
    this.registerGame = function registerGame() {
        var data = {
            game: game.name,
            game_display_name: game.displayName,
            developer: game.developer,
            deinitialize_timer_length_ms: game.deinitialize_timer_length_ms
        };

        return post('/game_metadata', data);
    };

    /**
     * As of SteelSeries Engine 3.5.0, you can remove a game you have registered.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#removing-a-game
     * @returns {Promise} Returns the promise.
     */
    this.removeGame = function removeGame() {
        var data = {
            game: game.name
        };
        return post('/remove_game', data);
    };

    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#registering-an-event
     * @param {gamesense.GameEvent} gameEvent
     * @returns {Promise} Returns the promise.
     */
    this.registerEvent = function registerEvent(gameEvent) {
        var data = {
            game: game.name,
            event: gameEvent.name,
            min_value: gameEvent.minValue,
            max_value: gameEvent.maxValue,
            icon_id: gameEvent.icon,
            value_optional: gameEvent.value_optional
        };
        return post('/register_game_event', data);
    };

    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#removing-an-event
     * @param {gamesense.GameEvent} gameEvent
     * @returns {Promise} Returns the promise.
     */
    this.removeEvent = function removeEvent(gameEvent) {
        var data = {
            game: game.name,
            event: gameEvent.name
        };
        return post('/remove_game_event', data);
    };

    /**
     * Bind handlers for an event.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#binding-an-event
     * @param {gamesense.GameEvent} event
     * @param {!Array<gamesense.GameEventHandler>} handlers
     * @returns {Promise} Returns the promise.
     */
    this.bindEvent = function bindEvent(event, handlers) {


        var data = {
            game: game.name,
            event: event.name,
            min_value: event.minValue,
            max_value: event.maxValue,
            icon_id: event.icon,
            value_optional: event.value_optional,
            handlers: handlers.map(function f(handler) { return handler.toHandlerData() })
        };
        return post('/bind_game_event', data);
    };

    /**
     * @param {gamesense.GameEvent} event
     * @returns {Promise} Returns the promise.
     */
    function getEventData(event) {
        var d = {}
        if (!event.value_optional) {
            d.value = event.value;
        }
        if (event.frame) {
            if (event.frame.constructor.name === 'Bitmap') {
                var fd = {
                    bitmap: event.frame.bitmap
                }
                if (event.frame.excluded_events) {
                    fd['excluded-events'] = event.frame.excluded_events
                }
                d.frame = fd
            } else {
                d.frame = event.frame
            }

        }
        var data = {
            event: event.name,
            data: d
        };
        return data
    }
    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#game-events
     * @returns {Promise} Returns the promise.
     * @param {gamesense.GameEvent} event 
     */
    this.sendGameEventUpdate = function updateGameEvent(event) {
        var data = getEventData(event)
        data.game = this.game.name;
        return post('/game_event', data);
    };
    /**
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#sending-multiple-event-updates-in-one-request
     * @returns {Promise} Returns the promise.
     * @param {Array<GameEvent>} events 
     */
    this.sendMultipleEventUpdate = function sendMultipleEventUpdate(events) {
        var options = {
            host: endpoint.host,
            port: endpoint.port,
            path: '/supports_multiple_game_events',
            method: 'GET',
        };
        return http.get(options, function f(m) {
            if (m.statusCode === 200) {
                var data = {
                    game: this.game.name,
                    events: events.map(function f(event) { return getEventData(event) })
                }
                return post('/multiple_game_events', data)
            } else {
                for (var e in events) {
                    this.sendGameEventUpdate(e)
                }
            }
        });
    }

    /**
     * Starts sending Heartbeat/Keepalive events.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#heartbeatkeepalive-events
     */
    this.startHeartbeatSending = function startHeartbeatSending() {
        heartbeatIntervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL * 1000);
    };

    /**
     * Stops sending  Heartbeat/Keepalive events.
     * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/sending-game-events.md#heartbeatkeepalive-events
     */
    this.stopHeartbeatSending = function stopHeartbeatSending() {
        if (heartbeatIntervalId) {
            clearInterval(heartbeatIntervalId);
        }
    };

    /**
     * Sends an heartbeat event
     */
    function sendHeartbeat() {
        var data = {
            game: game.name
        };
        post('/game_heartbeat', data);
    }

    /**
     * @param {string} path The url path, always start with a forward slash '/'.
     * @param {Object} data
     * @returns {Promise} Returns a request promise.
     */
    function post(path, data) {
        return new Promise(function postPromise(resolve, reject) {
            var jsonData = JSON.stringify(data);

            var options = {
                host: endpoint.host,
                port: endpoint.port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': jsonData.length
                }
            };

            var request = http.request(options, function handleResponse(response) {
                response.setEncoding('utf8');
                response.on('data', function handleOnData(chunk) {
                    // See more about error handling at
                    // https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md#error-handling
                    if (response.statusCode === 200) {
                        resolve(chunk);
                    } else {
                        reject({
                            jsonData: jsonData,
                            request: options,
                            statusCode: response.statusCode,
                            error: chunk
                        });
                    }
                });
            });

            request.write(jsonData);
            request.end();
        });
    }
};
