"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    function Player(socketId, name, position, dimensions, color) {
        this.dimensions = { x: 20, y: 50 };
        this.color = '#FA0';
        this.socketId = socketId;
        this.name = name;
        this.position = position;
        this.dimensions = dimensions;
        this.color = color;
    }
    return Player;
}());
exports.default = Player;
