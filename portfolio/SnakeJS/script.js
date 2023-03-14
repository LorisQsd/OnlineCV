window.onload = function(){// Initialisation du Canvas
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;// Temps exprimé en millisecondes
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;// Définis la grille horizontale
    var heightInBlocks = canvasHeight/blockSize;// Définis la grille verticale
    var score;
    var timeOut;

    init();// Exec la fonction init

    function init(){// Nom standard pour les fonctions qui permettent d'initialiser
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);// liaison avec le body de notre fichier html
        ctx = canvas.getContext('2d');// Définis  la dimension
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4] ], "right");// Initialise Snakee
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas(){
        snakee.advance();

        if(snakee.checkCollision()){
            gameOver();
        }
        else{
            if(snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple = true;
                do{
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);// Permet de clear le canvas à chaque refresh
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas, delay);
        }    
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif ";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);// Affiche Game Over sur l'écran à la position donnée
        ctx.font = "bold 30px sans-serif ";
        ctx.strokeText("Appuyez sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyez sur la touche Espace pour rejouer", centreX, centreY - 120) ;
        ctx.restore();
    }

    function restart(){
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");// Initialise Snakee
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif ";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.fillText(score.toString(), centreX, centreY);// Affiche le score en bas à gauche du canvas
        ctx.restore();
    }

    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection){
            var allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                throw("Invalid Direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };
        this.checkCollision = function(){
            var wallCollision = false;// Initialisation de la variable en false. Va servir à passer en true sur un mur est touché.
            var snakeCollision = false;// Initialisation de la variable en false. Va servir à passer en true si le serpent se mord la queue.
            var head = this.body[0];// Définis où se situe la tête du serpent
            var rest = this.body.slice(1);// Définis le reste du corps du serpent
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){// Si collision horizontale ou verticale alors wallCollision est true.
                wallCollision = true;
            }
            for(var i = 0; i < rest.length ; i++){
                if(snakeX == rest[i][0] && snakeY === rest[i][1]){// Si la tête du serpent atteint la même valeur que le reste du corps du serpend alors snakeCollision est true
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat){// Est-ce que le serpent mange une pomme ? (dans l'argument on indique les coordonnées d'une pomme)
            var head = this.body[0];// On vérifie la position de la tête du serpent
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;// On peut ne pas mettre de crochets uniquement car il n'y a qu'une seule ligne
            else
                return false;
        }
    }

    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){// A chaque fois que la pomme est mangée, on la créé à nouveau dans une nouvelle position
            var newX = Math.round(Math.random() * (widthInBlocks - 1));// Math round permet d'arrondir le chiffre / Donne un chiffre aléatoire entre 0 et 29
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];// On donne la nouvelle position à la pomme
        };
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;

            for(var i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[0] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    document.onkeydown = function handleKeyDown(e){// Permet de reconnaître la touche pressée. (e) = event
        var key = e.keyCode;// Génère le code de la touche qui a été appuyée
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection= "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}