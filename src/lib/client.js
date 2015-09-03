/**
 * The GameSense(TM) Client
 * @constructor
 * @param {gamesense.Game} game The game.
 * @param {gamesense.ServerEndpoint} endpoint The GameSense(TM) server.
 */
gamesense.GameClient = function GameClient(game, endpoint) {
    'use strict';

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
        /*eslint-disable camelcase */
        var data = {
            game: game.name,
            game_display_name: game.displayName,
            icon_color_id: game.iconColor
        };
        /*eslint-enable camelcase */

        return post('/game_metadata', data);
    };

    /**
     * @param {gamesense.GameEvent} gameEvent
     * @returns {Promise} Returns the promise.
     */
    this.registerEvent = function registerEvent(gameEvent) {
        /*eslint-disable camelcase */
        var data = {
            game: game.name,
            event: gameEvent.name,
            min_value: gameEvent.minValue,
            max_value: gameEvent.maxValue,
            icon_id: gameEvent.icon
        };
        /*eslint-enable camelcase */

        return post('/register_game_event', data);
    };

    /**
     * Bind handlers for an event.
     * @param {gamesense.GameEvent} event
     * @param {!Array<gamesense.GameEventHandler>} handlers
     * @returns {Promise} Returns the promise.
     */
    this.bindEvent = function bindEvent(event, handlers) {
        /*eslint-disable camelcase */

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
        /*eslint-enable camelcase */

        return post('/bind_game_event', data);
    };

    /**
     * @param {gamesense.GameEvent} event
     * @returns {Promise} Returns the promise.
     */
    this.sendGameEventUpdate = function updateGameEvent(event) {
        /*eslint-disable camelcase */
        var data = {
            game: game.name,
            event: event.name,
            data: {
                value: event.value
            }
        };
        /*eslint-enable camelcase */

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
        /*eslint-disable camelcase */
        var data = {
            game: game.name
        };
        /*eslint-enable camelcase */

        post('/game_heartbeat', data);
    }

    /**
     * @param {string} path The url path, always start with a forward slash '/'.
     * @param {Object} data
     * @returns {Promise} Returns a request promise.
     */
    function post(path, data) {
        return new Promise(function postPromise(resolve) {
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
                    console.log(response.statusCode + ' < ' + chunk);
                    resolve(chunk);
                });
            });

            console.log('POST ' + path, {json: jsonData});

            request.write(jsonData);
            request.end();
        });
    }
};
