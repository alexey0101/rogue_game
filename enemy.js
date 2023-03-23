var Enemy = (function() {
    var health;
    var attack;

    var line;
    var column;

    function Enemy(health, attack) { // enemy constructor
        this.health = health;
        this.attack = attack;
    }

    Enemy.prototype.setHealth = function(health) { // set enemy health
        this.health = health;
        var $element = $(`div[line="${this.line}"][column="${this.column}"]`);
        $element.find('.health').css('width', this.health + '%');
    };

    Enemy.prototype.getHealth = function() {   // get enemy health
        return this.health;
    };

    Enemy.prototype.getAttack = function() {  // get enemy attack
        return this.attack;
    };

    Enemy.prototype.getLine = function() { // get enemy line
        return this.line;
    };

    Enemy.prototype.getColumn = function() { // get enemy column
        return this.column;
    };

    Enemy.prototype.setLine = function(lineNumber) { // set enemy line
        this.line = lineNumber;
    };

    Enemy.prototype.setColumn = function(columnNumber) { // set enemy column
        this.column = columnNumber;
    };

    Enemy.prototype.delete = function(enemies) { // remove enemy from map
        var $enemy = $(`div[line="${this.line}"][column="${this.column}"]`);
        $enemy.removeClass('tileE');
        $enemy.removeClass('flipped');
        $enemy.children().remove(); // remove health bar
        enemies.splice(enemies.indexOf(this), 1);
    };

    Enemy.prototype.attackPlayer = function(player) { // attack hero if enemy is near
        if (Math.abs(player.getLine() - this.line) + Math.abs(this.column - player.getColumn()) <= 1) {
            console.log(`You get ${this.attack} damage!`);
            player.setHealth(player.getHealth() - this.attack);
            if (player.getHealth() <= 0) {
                return window.location.reload();
            }
            return true;
        }

        return false;
    };

    Enemy.prototype.move =  function (line, column, flip) { // move enemy
        var $enemy = $(`div[line="${this.line}"][column="${this.column}"]`);
        var $element = $(`div[line="${line}"][column="${column}"]`).not('.tileW').not('.tileE').not('.tileP').not('.tileHP').not('.tileSW');
        if ($element.length > 0) { // if there is no wall, enemy, hero, sword, potion or other enemie
            $enemy.removeClass('tileE');
            $enemy.removeClass('flipped');

            $element.addClass('tileE');
            if (flip) { // flip enemy if needed
                $element.addClass('flipped');
            }
            $element.append($enemy.children().clone());
            $enemy.children().remove();
            this.line = line;
            this.column = column;
        }
    };

    return Enemy;
})();