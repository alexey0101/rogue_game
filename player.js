var Player = (function() {
    var health;
    var attack;

    var line;
    var column;

    var flipped = false;

    function Player(health, attack) {
        this.health = health;
        this.attack = attack;
    }

    Player.prototype.getHealth = function() {
        return this.health;
    };

    Player.prototype.setHealth = function(healthNumber) {
        this.health = healthNumber;
        var $player = $('.tileP');
        $player.find('.health').css('width', this.health + '%');
    };

    Player.prototype.getAttack = function() {
        return this.attack;
    };

    Player.prototype.setAttack = function(attack) {
        this.attack = attack;
    };

    Player.prototype.getLine = function() {
        return this.line;
    };

    Player.prototype.getColumn = function() {
        return this.column;
    };

    Player.prototype.setLine = function(lineNumber) {
        this.line = lineNumber;
    };

    Player.prototype.setColumn = function(columnNumber) {
        this.column = columnNumber;
    };

    Player.prototype.setFlip = function(flip) {
        this.flipped = flip;
    };

    Player.prototype.getFlip = function() {
        return this.flipped;
    };

    Player.prototype.attackEnemies = function(enemies) {    
        this.attackEnemie(enemies, this.line - 1, this.column);
        this.attackEnemie(enemies, this.line, this.column - 1);
        this.attackEnemie(enemies, this.line, this.column + 1);
        this.attackEnemie(enemies, this.line + 1, this.column);
    };

    Player.prototype.move = function(line, column) { // move hero to given line and column
        var $player = $('.tileP');
        var $tile = $(`div[line="${line}"][column="${column}"]`);

        if (!$tile.hasClass('tileE')) { // if there is no enemy on tile
            if ($tile.hasClass('tileSW')) { // pick up sword
                this.attack += 15;
                $tile.removeClass('tileSW');
            }
            if ($tile.hasClass('tileHP')) { // pick up potion
                $tile.removeClass('tileHP');
                this.health = Math.min(100, this.health + 30);
            }

            $player.removeClass('tileP'); // remove player from current tile
            $player.removeClass('flipped'); 
            $player.children().remove(); // remove health bar

            if (this.flipped) { // flip player if needed
                $tile.addClass('flipped');
            }

            $tile.addClass('tileP').append(`<div class="health" style="width: ${this.health}%"></div>`); // add player to new tile

            this.line = line;
            this.column = column;
        }
    };

    Player.prototype.attackEnemie = function(enemies, line, column) { // attack enemie on given line and column
        var enemy = enemies.find(function(enemy) {
            return enemy.line === line && enemy.column === column;
        });

        if (enemy) {
            console.log(`Enemy hit: ${enemy.getHealth() - this.attack}`);
            enemy.setHealth(enemy.getHealth() - this.attack);
            if (enemy.getHealth() <= 0) {
                enemy.delete(enemies);
                console.log('Enemy killed!');
                if (enemies.length == 0) { // if there are no enemies left - player wins
                    alert('You win!');
                    window.location.reload();
                }
            }
        }
    }

    return Player;
})();