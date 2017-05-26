
// nos marca los pulsos del juego
window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame        ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        window.oRequestAnimationFrame       ||
        window.msRequestAnimationFrame      ||
		//lamada a tiempo de función con 1000 y 60
        function ( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
//crea una array que remueve las imagenes que se crean
arrayRemove = function (array, from) {
    var rest = array.slice((from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

var game = (function () {

    // Variables globales a la aplicacion
    var canvas,
        ctx,
        buffer,
        bufferctx,
		asteroid,// si se aplicaran
        player,
        evil,
        playerShot,
        bgMain,
        bgBoss,
        evilSpeed = 1,
        totalEvils = 7,
        playerLife = 3,
        shotSpeed = 5,
        playerSpeed = 5,
        evilCounter = 0,
        youLoose = false,
        congratulations = false,
        minHorizontalOffset = 100,
        maxHorizontalOffset = 400,
        evilShots = 5,   // disparos que tiene el malo al principio
        evilLife = 3,    // vidas que tiene el malo al principio (se van incrementando)
        finalBossShots = 30,
         finalBossLife = 12,
        totalBestScoresToShow = 5, // las mejores puntuaciones que se mostraran
        playerShotsBuffer = [],
        evilShotsBuffer = [],
        evilShotImage,
        playerShotImage,
        playerKilledImage,
		asteroidImage,
		asteroidKilledImage,
		//Animacion de los enemigos
        evilImages = {
            animation : [],
            killed : new Image()
        },
		//Animacion del jefe final
        bossImages = {
            animation : [],
            killed : new Image()
        },
		//si la tecla esta presioanda
        keyPressed = {},
		//las teclas que se van a utilizar
        keyMap = {
            left: 37,
            right: 39,
			up:38,
			down:40,
            fire: 32     // tecla espacio
        },
        nextPlayerShot = 0,
        playerShotDelay = 250,
        now = 0;

    function loop() {
        update();
        draw();
    }
  //carga las imagenes
    function preloadImages () {
		//carga 8 imagenes de animacion del jefe 
        for (var i = 1; i <= 8; i++) {
            var evilImage = new Image();
            evilImage.src = 'images/malo' + i + '.png';
            evilImages.animation[i-1] = evilImage;
            var bossImage = new Image();
            bossImage.src = 'images/jefe' + i + '.png';
            bossImages.animation[i-1] = bossImage;
        }
		//cuando el malo se muere
        evilImages.killed.src = 'images/malo_muerto.png';
		//cuando el jefe se muere
        bossImages.killed.src = 'images/jefe_muerto.png';
		//imagen inciial de la pantalla 1
        bgMain = new Image();
        bgMain.src = 'images/fondovertical.png';
		//imagen de la pantalla del jefe final
        bgBoss = new Image();
        bgBoss.src = 'images/fondovertical_jefe.png';
		//imagen del disparo del bueno
        playerShotImage = new Image();
        playerShotImage.src = 'images/disparo_bueno.png';
		//imagen del disparo del malo
        evilShotImage = new Image();
        evilShotImage.src = 'images/disparo_malo.png';
		//imagen del bueno muerto
        playerKilledImage = new Image();
        playerKilledImage.src = 'images/bueno_muerto.png';
		// si se aplicaran
		asteroidImage=new Image();
		asteroidImage.src='images/asteroid.png';
		

    }

    function init() {
 //inicia la funcion de carga de la imagenes
        preloadImages();

        
//incia el canvas
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext("2d");
//tamalo del canvas
        buffer = document.createElement('canvas');
        buffer.width = canvas.width;
        buffer.height = canvas.height;
		//definciión de contexto en 2D
        bufferctx = buffer.getContext('2d');
//CREACION DEL JUGADOR CON VIDA EN 0
        player = new Player(playerLife, 0);
		//CONTADOR DEL MALO 1
        evilCounter = 1;
		//CREACION DEL MALO
        createNewEvil();
		
		createNewAsteroid();
//FUNCION PARA MOSTRAR LA VIDA Y EL PUNTAJE
        showLifeAndScore();

        addListener(document, 'keydown', keyDown);
        addListener(document, 'keyup', keyUp);
//ANIMACION DEL FRAME DEL MALO Y LUEGO DEL JEFE
        function anim () {
            loop();
            requestAnimFrame(anim);
        }
        anim();
    }

	function createNewAsteroid() {
         asteroid = new Image();
         asteroid.src = 'images/asteroid.png';		
	   var settings = {
            marginBottom : 10,
            defaultHeight : 66
        };
		
		asteroid.posX = (canvas.width / 2) - (asteroid.width / 2);
        asteroid.posY = canvas.height - (asteroid.height == 0 ? settings.defaultHeight : asteroid.height) - settings.marginBottom;
		return asteroid;
    }
	//FUNCIÓN QUE MUESTRA LA VIDA Y LOS PUNTOS
    function showLifeAndScore () {
		//DEFINCION DEL COLOR RGB
        bufferctx.fillStyle="rgb(255,255,255)";
		//DEFINICION DEL TIPO DE LETRA EL TAMAÑO Y EL CONTEXTO
        bufferctx.font="bold 16px Arial";
		//MOSTRAR LOS PUNTOS Y VIDAS EN LA POSICION DE PANTALLA CORRESPONDIENTE
        bufferctx.fillText("Puntos: " + player.score, canvas.width - 100, 20);
        bufferctx.fillText("Vidas: " + player.life, canvas.width - 100,40);
    }
//RANDOM DE UN RANGO
    function getRandomNumber(range) {
        return Math.floor(Math.random() * range);
    }
//JUGADOR RECIBE VIDA Y PUNTAJE
    function Player(life, score) {
        var settings = {
            marginBottom : 10,
            defaultHeight : 66
        };
		//CARGAR IMAGEN DEL BUENO
        player = new Image();
        player.src = 'images/bueno.png';
		//POSICION INCIAL DEL JUGADOR
        player.posX = (canvas.width / 2) - (player.width / 2);
        player.posY = canvas.height - (player.height == 0 ? settings.defaultHeight : player.height) - settings.marginBottom;
//VARIABLES DEL JUGADOR       
	   player.life = life;
        player.score = score;
        player.dead = false;
        player.speed = playerSpeed;
//DISPARO IGUAL A LA SIGUIENTE FUNCIÓN
        var shoot = function () {
            if (nextPlayerShot < now || now == 0) {
                playerShot = new PlayerShot(player.posX + (player.width / 2) - 5 , player.posY);
                playerShot.add();
                now += playerShotDelay;
                nextPlayerShot = now + playerShotDelay;
            } else {
                now = new Date().getTime();
            }
        };
//CUANDO se presionan las teclas
        player.doAnything =  function() {
            if (player.dead)
                return;
            if (keyPressed.left && player.posX > 5)
                player.posX -= player.speed;
            if (keyPressed.right && player.posX < (canvas.width - player.width - 5))
                player.posX += player.speed;
			if (keyPressed.up&& player.posY > 5)
               player.posY -= player.speed;
			if (keyPressed.down&& player.posY < (canvas.width - player.width - 5))
                player.posY += player.speed;
            if (keyPressed.fire)
				//DISPARAR
                shoot();
				
        };
//SI EL JUGADOR MUERE 
        player.killPlayer = function() {
            if (this.life > 0) {
                this.dead = true;
				//PUEDE SEGUIR RECIBIENDO DISPAROS
                evilShotsBuffer.splice(0, evilShotsBuffer.length);
				//PUEDE SEGUIR DISPARANDO
                playerShotsBuffer.splice(0, playerShotsBuffer.length);
				//CARGFAR IMAGEN DE JUGADOR MUERTO
                this.src = playerKilledImage.src;
				//CREAR A ALGUIEN MAS MALO
                createNewEvil();
				//FUNCION CUANDO PARA DISMINUIR LA VIDA DEL JUGADOR
                setTimeout(function () {
                    player = new Player(player.life - 1, player.score);
                }, 500);

            } else {
				//SI PIERDE MOSTRAR PUNTAJE FINAL
                showGameOver();
                youLoose = true;
				
            }
        };
//RETORNAR AL JUGADOR
        return player;
    }

    
    //FUNCION DE DISPAROS 
	function Shot( x, y, array, img) {
        this.posX = x;
        this.posY = y;
        this.image = img;
        this.speed = shotSpeed;
        this.identifier = 0;
        this.add = function () {
            array.push(this);
        };
        this.deleteShot = function (idendificador) {
            arrayRemove(array, idendificador);
        };
    }
//FUNCIÓN DE DISPAROS DEL JUGADOR
    function PlayerShot (x, y) {
        Object.getPrototypeOf(PlayerShot.prototype).constructor.call(this, x, y, playerShotsBuffer, playerShotImage);
        this.isHittingEvil = function() {
            return (!evil.dead && this.posX >= evil.posX && this.posX <= (evil.posX + evil.image.width) &&
                this.posY >= evil.posY && this.posY <= (evil.posY + evil.image.height));
        };
    }

    PlayerShot.prototype = Object.create(Shot.prototype);
    PlayerShot.prototype.constructor = PlayerShot;
//FUNCIÓN DE DISPAROS DE UN JEFE
    function EvilShot (x, y) {
        Object.getPrototypeOf(EvilShot.prototype).constructor.call(this, x, y, evilShotsBuffer, evilShotImage);
        this.isHittingPlayer = function() {
            return (this.posX >= player.posX && this.posX <= (player.posX + player.width)
                && this.posY >= player.posY && this.posY <= (player.posY + player.height));
        };
    }

    EvilShot.prototype = Object.create(Shot.prototype);
    EvilShot.prototype.constructor = EvilShot;
    /******************************* FIN DISPAROS ********************************/


    /******************************* ENEMIGOS *******************************/
    function Enemy(life, shots, enemyImages) {
        this.image = enemyImages.animation[0];
        this.imageNumber = 1;
        this.animation = 0;
        this.posX = getRandomNumber(canvas.width - this.image.width);
        this.posY = -50;
        this.life = life ? life : evilLife;
        this.speed = evilSpeed;
        this.shots = shots ? shots : evilShots;
        this.dead = false;

        var desplazamientoHorizontal = minHorizontalOffset +
            getRandomNumber(maxHorizontalOffset - minHorizontalOffset);
        this.minX = getRandomNumber(canvas.width - desplazamientoHorizontal);
        this.maxX = this.minX + desplazamientoHorizontal - 40;
        this.direction = 'D';
//CUANDO EL ENEMIGO MIERE SE CARGA LA IMAGEN DE MUERTO

        this.kill = function() {
            this.dead = true;
            totalEvils --;
            this.image = enemyImages.killed;
            verifyToCreateNewEvil();
        };

		//ACTUALIZA POSCICIONES DEL MALO
        this.update = function () {
            this.posY += this.goDownSpeed;
            if (this.direction === 'D') {
                if (this.posX <= this.maxX) {
                    this.posX += this.speed;
                } else {
                    this.direction = 'I';
                    this.posX -= this.speed;
                }
            } else {
                if (this.posX >= this.minX) {
                    this.posX -= this.speed;
                } else {
                    this.direction = 'D';
                    this.posX += this.speed;
                }
            }
			//ANIMACION DEL ENEMIGO
            this.animation++;
            if (this.animation > 5) {
                this.animation = 0;
                this.imageNumber ++;
                if (this.imageNumber > 8) {
                    this.imageNumber = 1;
                }
				//CARGA DE LAS ANIMACIONES DEL ENEMIGO
                this.image = enemyImages.animation[this.imageNumber - 1];
            }
        };
//TAMAÑO DEL CANVAS CON POSICION DE Y
        this.isOutOfScreen = function() {
            return this.posY > (canvas.height + 15);
        };
//DISPAROS DEL ENEMIGO
        function shoot() {
            if (evil.shots > 0 && !evil.dead) {
                var disparo = new EvilShot(evil.posX + (evil.image.width / 2) - 5 , evil.posY + evil.image.height);
                disparo.add();
                evil.shots --;
                setTimeout(function() {
                    shoot();
                }, getRandomNumber(3000));
            }
        }
		//DISPAROS ALEATORIOS
        setTimeout(function() {
            shoot();
        }, 1000 + getRandomNumber(2500));

      

    }
//MALO CON VIDAS Y DISPAROS
    function Evil (vidas, disparos) {
        Object.getPrototypeOf(Evil.prototype).constructor.call(this, vidas, disparos, evilImages);
        this.goDownSpeed = evilSpeed;
        this.pointsToKill = 5 + evilCounter;
    }
//CREAR ENEMIGO
    Evil.prototype = Object.create(Enemy.prototype);
    Evil.prototype.constructor = Evil;
//JEFE FINAL
    function FinalBoss () {
        Object.getPrototypeOf(FinalBoss.prototype).constructor.call(this, finalBossLife, finalBossShots, bossImages);
        this.goDownSpeed = evilSpeed/2;
        this.pointsToKill = 20;
    }
//CREAR JEFE
    FinalBoss.prototype = Object.create(Enemy.prototype);
    FinalBoss.prototype.constructor = FinalBoss;
    /******************************* FIN ENEMIGOS *******************************/
//SI LOS ENEMIGOS SON MAYORES A 0 CREAR UNO MAS SINO FELCIIDADES HA GANADO
    function verifyToCreateNewEvil() {
        if (totalEvils > 0) {
			//CANTIDAD DE ENEMIGOS OBTIENE NUMERO RANDOM
            setTimeout(function() {
                createNewEvil();
                evilCounter ++;
            }, getRandomNumber(3000));

        } else {
            setTimeout(function() {
				//GUARDA SCORE FINAL
                saveFinalScore();
                congratulations = true;
            }, 2000);

        }
    }
//SI EL TOTAL DE ENEMIGOS ES DIFERENTE A 1 AÑADIR ENEMIGOS MAS DIFICILES SINO MOSTRAR EL JEFE FINAL
    function createNewEvil() {
        if (totalEvils != 1) {
            evil = new Evil(evilLife + evilCounter - 1, evilShots + evilCounter - 1);
        } else {
            evil = new FinalBoss();
        }
    }
//SI SE CHOCA EL JUGADOR Y EL MALO
    function isEvilHittingPlayer() {
        return ( ( (evil.posY + evil.image.height) > player.posY && (player.posY + player.height) >= evil.posY ) &&
            ((player.posX >= evil.posX && player.posX <= (evil.posX + evil.image.width)) ||
                (player.posX + player.width >= evil.posX && (player.posX + player.width) <= (evil.posX + evil.image.width))));
    }
//COMPROBAR COLISIONES
    function checkCollisions(shot) {
        if (shot.isHittingEvil()) {
            if (evil.life > 1) {
                evil.life--;
            } else {
				//PUNTOS DEL PUNTAJE 
                evil.kill();
                player.score += evil.pointsToKill;
            }
			// BORRAR DISPARO
            shot.deleteShot(parseInt(shot.identifier));
            return false;
        }
        return true;
    }
//iniciar al jugador
    function playerAction() {
        player.doAnything();
    }

    function addListener(element, type, expression, bubbling) {
        bubbling = bubbling || false;
//añade compatibilidad con distintos tamaños
        if (window.addEventListener) { // Standard
            element.addEventListener(type, expression, bubbling);
        } else if (window.attachEvent) { // IE
            element.attachEvent('on' + type, expression);
        }
    }
//funcionde la tecla de abajo
    function keyDown(e) {
        var key = (window.event ? e.keyCode : e.which);
        for (var inkey in keyMap) {
            if (key === keyMap[inkey]) {
                e.preventDefault();
                keyPressed[inkey] = true;
            }
        }
    }
//funcion de la tecla de arriba
    function keyUp(e) {
        var key = (window.event ? e.keyCode : e.which);
        for (var inkey in keyMap) {
            if (key === keyMap[inkey]) {
                e.preventDefault();
                keyPressed[inkey] = false;
            }
        }
    }
//DIBUJAR
    function draw() {
        ctx.drawImage(buffer, 0, 0);
    }
//MUESTRA MENSAJE DE GAME OVER
    function showGameOver() {
        bufferctx.fillStyle="rgb(255,255,255)";
        bufferctx.font="bold 35px Arial";
        bufferctx.fillText("GAME OVER  ", canvas.width / 2 - 200, canvas.height / 2 - 30);
		bufferctx.fillText("PUNTOS: " + player.score, canvas.width / 2 - 200, canvas.height / 2);
        //bufferctx.fillText("VIDAS: " + player.life + " x 5", canvas.width / 2 - 200, canvas.height / 2 + 30);
        bufferctx.fillText("PUNTUACION TOTAL: " + getTotalScore(), canvas.width / 2 - 200, canvas.height / 2 + 60);
    }
//MUESTRA MENSAJE DE FELICITACIONES
    function showCongratulations () {
        bufferctx.fillStyle="rgb(255,255,255)";
        bufferctx.font="bold 22px Arial";
        bufferctx.fillText("YOU WIN!", canvas.width / 2 - 200, canvas.height / 2 - 30);
        bufferctx.fillText("PUNTOS: " + player.score, canvas.width / 2 - 200, canvas.height / 2);
        bufferctx.fillText("VIDAS: " + player.life + " x 5", canvas.width / 2 - 200, canvas.height / 2 + 30);
        bufferctx.fillText("PUNTUACION TOTAL: " + getTotalScore(), canvas.width / 2 - 200, canvas.height / 2 + 60);
    }
//obtiene el recor total y al vida del jugador le multiplica 5
    function getTotalScore() {
        return player.score + player.life * 5;
    }
//actualiza el fondo
    function update() {

        drawBackground();
//si congratualtions entonces muestre el mensaje
        if (congratulations) {
            showCongratulations();
            return;
        }
//si pierde entonce muestre el mensaje de que perdio
        if (youLoose) {
            showGameOver();
            return;
        }
//dibuja al jugador y al malo
        bufferctx.drawImage(player, player.posX, player.posY);
        bufferctx.drawImage(evil.image, evil.posX, evil.posY);

        updateEvil();
//si el disparo bueno toco al malo
        for (var j = 0; j < playerShotsBuffer.length; j++) {
            var disparoBueno = playerShotsBuffer[j];
            updatePlayerShot(disparoBueno, j);
        }

        if (isEvilHittingPlayer()) {
            player.killPlayer();
        } else {
			//si toco al jugaro
            for (var i = 0; i < evilShotsBuffer.length; i++) {
                var evilShot = evilShotsBuffer[i];
                updateEvilShot(evilShot, i);
            }
        }
//mostrar vida y puntaje
        showLifeAndScore();
//ejecutar jugador
        playerAction();
    }
//actualizar el disparo dle juagador
    function updatePlayerShot(playerShot, id) {
        if (playerShot) {
            playerShot.identifier = id;
            if (checkCollisions(playerShot)) {
                if (playerShot.posY > 0) {
				//si la posicion del disparo es mayor a 0, entonces iguale la posicion y con la velocidad
                    playerShot.posY -= playerShot.speed;
                    bufferctx.drawImage(playerShot.image, playerShot.posX, playerShot.posY);
                } else {
					//si llega al final del canavas eliminar el disparo
                    playerShot.deleteShot(parseInt(playerShot.identifier));
                }
            }
        }
    }
	
	//actualizar el disparo del malo

    function updateEvilShot(evilShot, id) {
        if (evilShot) {
            evilShot.identifier = id;
            if (!evilShot.isHittingPlayer()) {
                if (evilShot.posY <= canvas.height) {
					//si llega al fin del canavas genere uno nuevo
                    evilShot.posY += evilShot.speed;
                    bufferctx.drawImage(evilShot.image, evilShot.posX, evilShot.posY);
                } else {
					//si llega al fin desaparezca
                    evilShot.deleteShot(parseInt(evilShot.identifier));
                }
            } else {
				//matar al jugador
                player.killPlayer();
            }
        }
    }
//carga imagen del jefe final 
    function drawBackground() {
        var background;
        if (evil instanceof FinalBoss) {
            background = bgBoss;
        } else {
            background = bgMain;
        }
        bufferctx.drawImage(background, 0, 0);
    }
//actualiza al malo para convertirlo en jefe
    function updateEvil() {
        if (!evil.dead) {
			//si el jefe no esta muerto actualizelo
            evil.update();
            if (evil.isOutOfScreen()) {
				//si ya no esta en la pantalla el jefe ya esta muerto
                evil.kill();
            }
        }
    }

    
//iniciar init
    return {
        init: init
    }
})();