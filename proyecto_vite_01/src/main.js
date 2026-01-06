import Phaser from 'phaser';

// Clase principal del juego
class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        // Cargar imágenes
        this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
        this.load.image('ship', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
        this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullet.png');
        this.load.image('spider', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
    }

    create() {
        // Fondo
        this.add.image(400, 300, 'background');

        // Nave del jugador
        this.ship = this.physics.add.sprite(400, 550, 'ship');
        this.ship.setCollideWorldBounds(true); // Evitar que salga de la pantalla

        // Controles de la nave
        this.cursors = this.input.keyboard.createCursorKeys();

        // Grupo de balas
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10, // Máximo número de balas
        });

        // Crear la araña enemiga
        this.spider = this.physics.add.sprite(400, 100, 'spider');
        this.spider.setVelocity(100, 0); // Movimiento horizontal
        this.spider.setCollideWorldBounds(true);
        this.spider.setBounce(1); // Rebota al llegar al borde

        // Detectar colisiones entre balas y la araña
        this.physics.add.collider(this.bullets, this.spider, this.hitSpider, null, this);

        // Añadir texto para mostrar las puntuaciones
        this.score = 0;
        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
            fontSize: '20px',
            fill: '#fff',
        });

        // Disparar al presionar espacio
        this.input.keyboard.on('keydown-SPACE', this.shootBullet, this);
    }

    update() {
        // Movimiento de la nave
        if (this.cursors.left.isDown) {
            this.ship.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.ship.setVelocityX(200);
        } else {
            this.ship.setVelocityX(0);
        }
    }

    shootBullet() {
        // Crear una bala si hay disponible en el grupo
        const bullet = this.bullets.get(this.ship.x, this.ship.y - 20);

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = -300; // Velocidad hacia arriba
        }
    }

    hitSpider(bullet, spider) {
        // Destruir la bala
        bullet.disableBody(true, true);

        // Reducir la vida de la araña o eliminarla
        spider.disableBody(true, true);

        // Incrementar puntuación
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

        // Volver a hacer aparecer la araña tras un tiempo
        this.time.delayedCall(1000, () => {
            spider.enableBody(true, Phaser.Math.Between(100, 700), 100, true, true);
            spider.setVelocity(100, 0); // Reiniciar el movimiento
        });
    }
}

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false, // Cambiar a true si deseas ver los límites de los objetos
        },
    },
    scene: MainScene,
};

// Crear el juego
const game = new Phaser.Game(config);
