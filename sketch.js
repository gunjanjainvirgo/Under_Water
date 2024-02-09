var bg_img
var playbutton, aboutbutton
var gameState = 'wait'
var background1, background2
var player, player_img
var enemy, enemy1_img, enemy2_img, enemyGroup
var bullet, bullet_img
var score = 0
var heart, heart_img
var health = 200, max_health = 200
var enemy3_img, enemy4_img, enemy5_img;
var seashell, seashell_img;
var shootSound, checkPointSound, dieSound, winSound, background_music;


function preload() {

    bg_img = loadImage("assets/under_water.gif")
    background1 = loadImage("assets/Background 1.jpg")
    player_img = loadImage("assets/Diver.png")
    enemy1_img = loadImage("assets/fish1.png")
    enemy2_img = loadImage("assets/octopus2.png")
    bullet_img = loadImage("assets/bullet.png")
    heart_img = loadImage("assets/heart.png")
    background2 = loadImage("assets/background_9.png")
    enemy3_img = loadImage("assets/fish4.png")
    enemy4_img = loadImage("assets/eel.png")
    enemy5_img = loadImage("assets/shark1.png")
    seashell_img = loadImage("assets/seashell.png")

    shootSound = loadSound("assets/shoot.mp3")
    dieSound = loadSound("assets/die.mp3")
    checkPointSound = loadSound("assets/checkpoint.mp3")
    winSound = loadSound("assets/twinkle.mp3")
    //background_music = loadSound("assets/background_music.mp3")

}


function setup() {

    createCanvas(windowWidth, windowHeight)

    playbutton = createImg("assets/play_button.png")
    playbutton.position(270, 450)
    playbutton.size(400, 400)
    playbutton.hide()

    aboutbutton = createImg("assets/about_button.png")
    aboutbutton.position(750, 450)
    aboutbutton.size(400, 400)
    aboutbutton.hide()

    player = createSprite(400, 600)
    player.addImage("main", player_img)
    player.visible = false

    enemyGroup = new Group()
    bulletGroup = new Group()

    heart = createSprite(1200, 58);
    heart.addImage(heart_img);
    heart.scale = 0.2;
    heart.visible = false;

    seashell = createSprite(900, 250, 200, 20);
    seashell.addImage(seashell_img);
    seashell.scale = 0.5;
    seashell.visible = false;

}


function draw() {

    if (gameState === "wait") {


        background(bg_img)
        playbutton.show()
        aboutbutton.show()
        //background_music.play();
    }

    aboutbutton.mousePressed(() => {
        playbutton.hide();
        aboutbutton.hide();
        gameState = "about";
    })

    if (gameState == "about") {
        aboutgame();
    }

    playbutton.mousePressed(() => {
        playbutton.hide();
        aboutbutton.hide();
        gameState = "play";
    })

    if (gameState == "play") {
        //background_music.stop();
        background(background1)
        player.visible = true
        spawnEnemies()
        movement()
        healthlevel1()

        for (var i = 0; i < enemyGroup.length; i++) {
            if (bulletGroup.isTouching(enemyGroup.get(i))) {
                score += 5;
                enemyGroup.get(i).remove()
                bulletGroup.destroyEach()
            }
        }

        for (var i = 0; i < enemyGroup.length; i++) {
            if (player.isTouching(enemyGroup.get(i))) {
                dieSound.play();
                health -= 20
                enemyGroup.get(i).remove()
                bulletGroup.destroyEach()
            }
        }

        if (health <= 0) {
            dieSound.play()

            gameState = "gameOver";

        }

        if (gameState == "gameOver") {

            enemyGroup.destroyEach()
            bulletGroup.destroyEach()
            player.visible = false;

            lost();
        }

        if (health > 0 && score >= 20) {

            gameState = "nextlevelinfo"
            bulletGroup.destroyEach()
            player.visible = false
            enemyGroup.destroyEach();
            checkPointSound.play()

        }

        if (gameState == "nextlevelinfo") {

            nextlevelpopup();

        }

    }

    if (gameState == "level2") {
        background(background2)
        player.visible = true
        spawnEnemiesLevel2()
        movement()
        healthlevel1()

        for (var i = 0; i < enemyGroup.length; i++) {
            if (bulletGroup.isTouching(enemyGroup.get(i))) {
                score += 5;
                enemyGroup.get(i).remove()
                bulletGroup.destroyEach()
            }
        }

        for (var i = 0; i < enemyGroup.length; i++) {
            if (player.isTouching(enemyGroup.get(i))) {
                dieSound.play();
                health -= 20
                enemyGroup.get(i).remove()
                bulletGroup.destroyEach()
            }
        }

        if (score >= 50 && health >= 0) {
            gameState = "highScore"
            bulletGroup.destroyEach()
            player.visible = false
            enemyGroup.destroyEach();
            checkPointSound.play()

        }

        if (gameState == "highScore") {
            //player.visible = false
            //gameState = "seashellunlocked"
            seashellpopup();

        }
    }

    if (gameState == "seashellunlocked") {
        //console.log("seashell");
        //checkPointSound.stop();
        background(background2)
        player.visible = true
        //spawnEnemiesLevel2()
        // movement()
        healthlevel1()
        seashell.visible = true;
        movement2()
        enemyGroup.destroyEach()
        bulletGroup.destroyEach()

        // if (seashell.y == 500) {

        //     seashell.velocityY = -20;
        //     seashell.y -= 20;


        // }

        // if (seashell.y == 80) {

        //     seashell.y = seashell.y + 20;
        //     seashell.velocityY = 20;
        // }


        //gameState = "level2"
        // }

        if (player.isTouching(seashell)) {
            winSound.play();
            player.velocityY = 0;
            seashell.visible = false;
            gameState = "win"
        }
    }


    if (gameState == "win") {

        enemyGroup.destroyEach()
        bulletGroup.destroyEach()
        player.visible = false;
        win()

    }


    if (health <= 0) {


        gameState = "gameOver";

    }

    if (gameState == "gameOver") {

        enemyGroup.destroyEach()
        bulletGroup.destroyEach()
        player.visible = false;

        lost();
    }

    if (gameState == "play" || gameState == "nextlevelinfo" || gameState == "level2" || gameState == "gameOver" || gameState == "win" || gameState == "seashellunlocked" || gameState=="highScore") {
        fill("black");
        textSize(30);
        text("SCORE: " + score, 50, 51);
    }

    drawSprites()

}

function aboutgame() {

    swal({
        title: "About Game === How to Play!!",
        text: "Dive into the ocean as scuba diver for a fishing scavenger.\n Kill the enemies. Use Arrow keys to move up and down and space bar to shoot.",
        textAlign: "center",
        imageUrl: "assets/Splashscreen.gif",
        imageSize: "200x200",
        confirmButtonText: "Let's swim!",
        confirmButtonColor: "blue",
    },

        function () {
            gameState = "wait"
        }
    )

}

function spawnEnemies() {

    if (frameCount % 100 == 0) {

        var randy = Math.round(random(50, 600))
        enemy = createSprite(width, randy);
        enemy.scale = 0.25
        enemy.velocityX = -8;

        var randimg = Math.round(random(1, 2))
        switch (randimg) {

            case 1:
                enemy.addImage(enemy1_img)
                enemy.setCollider("rectangle", 0, 0, 250, 300)
                break;

            case 2:
                enemy.addImage(enemy2_img)
                enemy.setCollider("rectangle", 0, 0, enemy.width, enemy.height)
                break;

            default: break;

        }

        enemy.depth = player.depth;
        player.depth = player.depth + 1;

        enemyGroup.add(enemy);

    }

}

function spawnEnemiesLevel2() {

    if (frameCount % 80 == 0) {

        var randy = Math.round(random(50, 500))
        enemy = createSprite(width, randy);
        enemy.scale = 0.5
        enemy.velocityX = -10;

        var randimg = Math.round(random(1, 3))
        switch (randimg) {

            case 1:
                enemy.addImage(enemy3_img)
                enemy.scale = 0.3
                enemy.setCollider("rectangle", 0, 0, 250, 300)
                break;

            case 2:
                enemy.addImage(enemy4_img)
                enemy.setCollider("rectangle", 0, 0, enemy.width, enemy.height)
                break;

            case 3:
                enemy.addImage(enemy5_img)
                enemy.setCollider("rectangle", 0, 0, enemy.width, enemy.height)
                break;

            default: break;

        }

        enemy.depth = player.depth;
        player.depth = player.depth + 1;

        enemyGroup.add(enemy);

    }

}


function movement() {

    if (player.y <= 60) {
        player.y = 60
    }

    if (player.y >= 550) {
        player.y = 550
    }

    if (keyDown("UP_ARROW")) {
        player.y = player.y - 5;
    }

    if (keyDown("DOWN_ARROW")) {
        player.y = player.y + 5;
    }

}

function spawnBullets() {

    bullet = createSprite(player.x + 11, player.y + 11, 20, 20);
    bullet.addImage(bullet_img);
    bullet.scale = 0.15;
    bullet.velocityX = 15;

    bullet.depth = player.depth;
    player.depth = player.depth + 1;

    bulletGroup.add(bullet);

}

function keyReleased() {
    if (keyCode === 32) {
        shootSound.play();
        spawnBullets();
    }
}

function healthlevel1() {

    heart.visible = true;

    stroke("black")
    strokeWeight(2)
    noFill()
    rect(1200, 50, max_health, 20)

    noStroke()
    fill("red")
    rect(1200, 50, health, 20)

}

function lost() {

    swal({
        title: "You LOST!",
        imageUrl: "assets/game_over.png",
        imageSize: "300x300",
        confirmButtonText: "Try Again",
        confirmButtonColor: "blue",
    },
        function () {
            window.location.reload();

        }

    )

}

function nextlevelpopup() {

    swal({
        title: "HURRAYY!! You have reached Level 2",
        text: "You defeated them:\n Make a score of 50 and collect the sea shell to win!\n Use Right arrow key to move ahead.",
        imageUrl: "assets/level_up.jpg",
        imageSize: "200x200",
        confirmButtonText: "Let's Win!",
        confirmButtonColor: "blue",
    },
        function () {

            gameState = "level2"
        }

    )

}

function win() {

    swal({
        title: "You Won!",
        text: "Congratulations you won the game! \n ",
        imageUrl: "assets/you-win1.png",
        imageSize: "200x200",
        confirmButtonText: "Restart",
        confirmButtonColor: "blue",
    },
        function () {
            window.location.reload();
        }

    )


}

function movement2() {

    if (player.y <= 60) {
        player.y = 60
    }

    if (player.y >= 550) {
        player.y = 550
    }

    if (keyDown("UP_ARROW")) {
        player.y = player.y - 5;
    }

    if (keyDown("DOWN_ARROW")) {
        player.y = player.y + 5;
    }

    if (keyDown("RIGHT_ARROW")) {
        player.x = player.x + 5;
    }

}


function seashellpopup() {

    swal({
        title: "SEASHELL UNLOCKED",
        text: "Congratulations! You made the high Score. Now collect the seashell!! \n ",
        imageUrl: "assets/seashell.png",
        imageSize: "200x200",
        confirmButtonText: "OK",
        confirmButtonColor: "brown",
    },
        function () {
            gameState = "seashellunlocked"
        }

    )

}