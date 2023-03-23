var Game = (function() {

    var gameField; // 2d array of 0 and 1 (0 - empty, 1 - wall)
    var $gameField; // jquery object of game field

    var linesNumber; // number of lines in game field
    var columnsNumber; // number of columns in game field

    var lastInputTime = 0; // last time when user pressed a button

    var player;

    var enemies = []; // array of enemies

    function Game() { // constructor    
        $gameField = $('.field');
    }

    Game.prototype.init = function(width, height) { // init game field

        player = new Player (100, 20); // create player

        linesNumber = height; // set number of lines and columns
        columnsNumber = width; 

        fillWalls();
        makeTrails(3, 5);
        makeRooms(5, 10, 3, 8);
        drawMap();
        spawnSwords(2);
        spawnPotions(10);
    };

    Game.prototype.start = function() { // start game
        console.log('Game started');
        spawnHero();
        spawnEnemies(10);
        
        window.setInterval(moveEnemies, 1000); // move enemies every 1 second
        window.addEventListener('keydown', handleInput); // handle user input
    };

    function handleInput(e) { // handle user input
        if (e.keyCode == 32) { // prevent space from scrolling page
            e.preventDefault();
        }
        if (Date.now() - lastInputTime > 200) {
            switch (e.keyCode) {
                case 65: // left - a
                    if (player.getColumn() > 0 && gameField[player.getLine()][player.getColumn() - 1] === 0) {
                        player.setFlip(true);
                        player.move(player.getLine(), player.getColumn() - 1);
                    }
                    break;
                case 87: // up - w
                    if (player.getLine() > 0 && gameField[player.getLine() - 1][player.getColumn()] === 0) {
                        player.move(player.getLine() - 1, player.getColumn());
                    }
                    break;
                case 83: // down - s
                    if (player.getLine() + 1 < linesNumber && gameField[player.getLine() + 1][player.getColumn()] === 0) {
                        player.move(player.getLine() + 1, player.getColumn());
                    }
                    break;
                case 68: // right - d
                    if (player.getColumn() + 1 < columnsNumber && gameField[player.getLine()][player.getColumn() + 1] === 0) {
                        player.setFlip(false);
                        player.move(player.getLine(), player.getColumn() + 1);
                    }
                    break;
                case 32: // space - attack
                    player.attackEnemies(enemies);
                    break;
            }
            lastInputTime = Date.now();
        }
    }

    function fillWalls() { // fill walls
        gameField = new Array(linesNumber).fill(1).map(function () { return new Array(columnsNumber).fill(1); });
    }

    function drawMap() { // draw map
        for (var i = 0; i < linesNumber; i++) {
            for (var j = 0; j < columnsNumber; j++) {
                if (gameField[i][j] === 1) {
                    $gameField.append(`<div line="${i}" column="${j}" class="tile tileW"></div>`);
                } else {
                    $gameField.append(`<div line="${i}" column="${j}" class="tile"></div>`);
                }
            }
        }
    }

    function makeTrails(min, max) { // make trails
        var x = Math.floor(Math.random() * (max - min + 1)) + min;
        var y = Math.floor(Math.random() * (max - min + 1)) + min;

        var xIndexes = [];
        var yIndexes = [];

        for (var i = 0; i < x; i++) {
            while (true) {
                var number = Math.floor(Math.random() * linesNumber);
                if (xIndexes.indexOf(number) === -1) {
                    xIndexes.push(number);
                    break;
                }
            }
        }
        for (i = 0; i < y; i++) {
            while (true) {
                var number = Math.floor(Math.random() * columnsNumber);
                if (yIndexes.indexOf(number) === -1) {
                    yIndexes.push(number);
                    break;
                }
            }
        }

        for (i = 0; i < xIndexes.length; i++) {
            for (var j = 0; j < columnsNumber; j++) {
                gameField[xIndexes[i]][j] = 0;
            }
        }
        for (i = 0; i < yIndexes.length; i++) {
            for (var j = 0; j < linesNumber; j++) {
                gameField[j][yIndexes[i]] = 0;
            }
        }
    }

    function makeRooms(numberMin, numberMax, sizeMin, sizeMax) { // make rooms
        var roomsNumber = Math.floor(Math.random() * (numberMax - numberMin + 1)) + numberMin;
        var rooms = [];

        for (var i = 0; i < roomsNumber; i++) {
            var room = {
                xSize: Math.floor(Math.random() * (sizeMax - sizeMin + 1)) + sizeMin,
                ySize: Math.floor(Math.random() * (sizeMax - sizeMin + 1)) + sizeMin,
                x: Math.floor(Math.random() * columnsNumber),
                y: Math.floor(Math.random() * linesNumber)
            };
            rooms.push(room);
        }

        for (i = 0; i < rooms.length; i++) {
            var room = rooms[i];
            
            for (var j = room.x; j < room.x + room.xSize; j++) {
                if (j >= columnsNumber) {
                    break;
                }
                for (var k = room.y; k < room.y + room.ySize; k++) {
                    if (k >= linesNumber) {
                        break;
                    }
                    gameField[k][j] = 0;
                }
            }
        }
    }

    function spawnSwords(maxNumber) { // spawn swords
        while (maxNumber > 0) {
            var line = Math.floor(Math.random() * (linesNumber));
            var column = Math.floor(Math.random() * (columnsNumber));
            while (gameField[line][column] != 0) {
                line = Math.floor(Math.random() * (linesNumber));
                column = Math.floor(Math.random() * (columnsNumber));
            }
        
            $(`div[line="${line}"][column="${column}"]`).addClass('tileSW');
            maxNumber--;
        }
    }

    function spawnPotions(maxNumber) { // spawn potions
        while (maxNumber > 0) {
            var line = Math.floor(Math.random() * (linesNumber));
            var column = Math.floor(Math.random() * (columnsNumber));
            while (gameField[line][column] != 0) {
                line = Math.floor(Math.random() * (linesNumber));
                column = Math.floor(Math.random() * (columnsNumber));
            }
        
            $(`div[line="${line}"][column="${column}"]`).addClass('tileHP');
            maxNumber--;
        }
    }

    function spawnHero() { // spawn hero
        while (true) {
            var line = Math.floor(Math.random() * (linesNumber));
            var column = Math.floor(Math.random() * (columnsNumber));
            if (gameField[line][column] === 0) {
                var $element = $(`div[line="${line}"][column="${column}"]`).not('.tileE').not('.tileHP').not('.tileSW');
                if ($element.length > 0) { // if there is no enemy or potion or sword
                    $element.addClass('tileP');
                    player.setLine(line);
                    player.setColumn(column);
                    $element.append(`<div class="health" style="width: ${player.getHealth()}%"></div>`);
                    break;
                }
            }
        }
    }

    function spawnEnemies(number) { // spawn enemies
        while (number > 0) {
            var line = Math.floor(Math.random() * (linesNumber));
            var column = Math.floor(Math.random() * (columnsNumber));
            while (gameField[line][column] != 0) {
                line = Math.floor(Math.random() * (linesNumber));
                column = Math.floor(Math.random() * (columnsNumber));
            }
        
            var $element = $(`div[line="${line}"][column="${column}"]`).not('.tileP').not('.tileHP').not('.tileSW').not('.tileE');
            if ($element.length > 0) { // if there is no hero, sword, potion or other enemie
                var enemy = new Enemy(100, 15);
                enemy.setLine(line);
                enemy.setColumn(column);

                $element.addClass('tileE');
                $element.append(`<div class="health" style="width: ${enemy.getHealth()}%"></div>`);

                enemies.push(enemy);
                number--;
            }
        }
    }

    function moveEnemies() { // move enemies
        enemies.forEach(function (enemy) {
            var direction = Math.floor(Math.random() * 4);
            if (!enemy.attackPlayer(player)) {
            switch (direction) {
                case 0:
                    enemy.move(enemy.getLine() - 1, enemy.getColumn(), false);
                    break;
                case 1:
                    enemy.move(enemy.getLine() + 1, enemy.getColumn(), false);
                    break;
                case 2:
                    enemy.move(enemy.getLine(), enemy.getColumn() - 1, true);
                    break;
                case 3:
                    enemy.move(enemy.getLine(), enemy.getColumn() + 1, false);
                    break;
            }
        }
        });
    }
    return Game;
}());