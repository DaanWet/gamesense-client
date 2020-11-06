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
    var _ = require('underscore');

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
     * @param {gamesense.GameEvent} gameEvent
     * @returns {Promise} Returns the promise.
     */
    this.registerEvent = function registerEvent(gameEvent) {
        var data = {
            game: game.name,
            event: gameEvent.name,
            min_value: gameEvent.minValue,
            max_value: gameEvent.maxValue,
            icon_id: gameEvent.icon
        };
        return post('/register_game_event', data);
    };

    /**
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
     * @param {gamesense.GameEvent} event
     * @param {!Array<gamesense.GameEventHandler>} handlers
     * @returns {Promise} Returns the promise.
     */
    this.bindEvent = function bindEvent(event, handlers) {
        /**
         * @param {!gamesense.GameEventHandler} handler
         * @returns {Object} The gamesense data object representing a handler.
         */
        function toHandlerData(handler) {
            var handlerData = {
                zone: handler.zone,
                color: handler.color,
                mode: handler.mode
            };

            if (handler.deviceType) {
                handlerData['device-type'] = handler.deviceType;
            } else {
                throw new Error('bindEvent failed: Missing device type.');
            }

            if (handler.rate) {
                handlerData.rate = handler.rate;
            }

            if (handler.color.constructor.name === 'GradientColor') {
                handlerData.color = {
                    gradient: handler.color
                };
            } else if (handler.color.constructor.name === 'ColorRanges') {
                handlerData.color = handler.color.ranges;
            }

            if (handler.customZoneKeys) {
                handlerData['custom-zone-keys'] = handler.customZoneKeys;
            }

            return handlerData;
        }

        var data = {
            game: game.name,
            event: event.name,
            min_value: event.minValue,
            max_value: event.maxValue,
            icon_id: event.icon,
            handlers: _.map(handlers, toHandlerData)
        };
        return post('/bind_game_event', data);
    };

    /**
     * @param {gamesense.GameEvent} event
     * @returns {Promise} Returns the promise.
     */
    this.sendGameEventUpdate = function updateGameEvent(event) {
        var data = {
            game: game.name,
            event: event.name,
            data: {
                value: event.value
            }
        };
        return post('/game_event', data);
    };

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
