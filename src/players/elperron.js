/**
 * Created by Roberto Alvarez on 7/29/2015.
 */var utils = require('../lib/utils.js'),
    currentDirection = 0,
    oldBestAmo = null,
    directions = {
        1: 'north',
        2: 'east',
        3: 'south',
        4: 'west'
    },
    turnsComplete = 0,
    ElPerron = {
        info: {
            name: 'ElPerron',
            style: 7
        },
        ai: (playerState, enemiesStates, gameEnvironment) => {
            var directionToTarget,
                /**
                 * Devuelve la dirección del amo mas cercano en base a la posición actual de la
                 * nave
                 * @returns {*}
                 */
                getBestAmmo = () => {
                    var myPosition = playerState.position,
                        distanceMin = 22,
                        ammoMin = null;
                    for (var amIndex in gameEnvironment.ammoPosition) {
                        var ammo = gameEnvironment.ammoPosition[amIndex];
                        var difXbyMe = Math.abs(myPosition[1] - ammo[1]),
                            difYbyMe = Math.abs(myPosition[0] - ammo[0]),
                            distanceByMe = difXbyMe + difYbyMe;

                        if (distanceByMe < distanceMin) {
                            distanceMin = distanceByMe;
                            ammoMin = ammo;
                        }
                    }

                    return ammoMin;
                },
                /**
                 * Devuelve número de enemigos vivos
                 * @returns {number}
                 */
                getCountEnemiesAlive = () => {
                    var countEnemies = 0;

                    for (var enIndex in enemiesStates) {
                        var enemy = enemiesStates[enIndex];

                        if (enemy.isAlive) {
                            countEnemies++;
                        }
                    }

                    return countEnemies;
                },
                /**
                 * Devuelve si la nave esta posicionada en el mismo lugar que el ammo
                 * @param ammo
                 * @returns {boolean}
                 */
                isOnAmmo = (ammo) => {
                    if (ammo == null) {
                        return false;
                    }
                    return ammo[0] == playerState.position[0] &&
                        ammo[1] == playerState.position[1];
                };

            // Hasta la vista baby !!!
            if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
                return 'shoot';
            }

            if (playerState.ammo == 0 || turnsComplete == 1) {
                var toPosition = getBestAmmo();

                // Si tengo los suficientes disparos para eliminar a todos los enemigos
                // me dirijo hacia ellos
                if (playerState.ammo >= getCountEnemiesAlive()) {
                    toPosition = enemiesStates[0].position;
                }

                directionToTarget = utils.getDirection(playerState.position, toPosition);

                if (isOnAmmo(oldBestAmo)) {
                    turnsComplete = 0;
                }

                // Guardo referencia de la posicion a la que me dirigi anteriormente
                oldBestAmo = toPosition;

                // Si ya se movio, cambio mi dirección
                if (directionToTarget !== playerState.direction) {
                    return directionToTarget;
                }

                return 'move';
            }
            else {
                // Si tiene armas lo hago girar
                currentDirection++;
                if (currentDirection > 4) {
                    currentDirection = 1;
                    turnsComplete++;
                }

                return directions[currentDirection];
            }

            return utils.randomMove();
        }
    };

module.exports = ElPerron;
