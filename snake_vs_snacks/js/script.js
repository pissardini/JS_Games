/*
#
# Copyright (c) 2020 R.Pissardini <rodrigo AT pissardini DOT com>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
#The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
*/


let canvas        = document.getElementById ("snake");
let context       = canvas.getContext ("2d");
let box           = 32;
let snake         = [];
let direction     = "right";
let score         = 0;
let speed         = 200;
let border        = false;
let poisons       = false;
let mfood         = false;
let params        = new URLSearchParams(location.search);
const food_limit  = 5;

if (parseInt(params.get('border'))==1) border = true; 
if (parseInt(params.get('poisons'))==1) poisons = true; 
if (parseInt(params.get('food'))==1) mfood = true; 

//create head snake 

snake [0] = {
    x: 8 * box,
    y: 8 * box
}


//create foods 
let foods = [];

if (mfood==true){
    let food = null;
    for(let i=0;i<food_limit;i++) {
        food = {
            x: Math.floor(Math.random() * 15 + 1) * box,
            y: Math.floor(Math.random() * 15 + 1) * box
        };
        foods.push(food); 
    }
    
} else { 
        let food = {
            x: Math.floor(Math.random() * 15 + 1) * box,
            y: Math.floor(Math.random() * 15 + 1) * box
        };
        foods.push(food); 
}

//create poison

let poison = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

let poison_trick = 0;

//draw background 

function drawBG(){
    context.fillStyle = "#2F4F4F";
    context.fillRect(0, 0, 16 * box, 16 * box); //rectangle
    context.strokestyle="black";
    context.strokeRect(0, 0, 16 * box, 16 * box);
}

//draw Snake
function drawSnake(){

    //draw head of the snake

    context.fillStyle   = "#FFD700";
    context.strokestyle = "black";

    context.fillRect(snake[0].x,
                     snake[0].y,
                     box,
                     box);
    context.strokeRect(snake[0].x,
                     snake[0].y,
                     box,
                     box);

    //draw body of the snake
    for(let i=1; i<snake.length; i++) {
        context.fillStyle = "#228B22";
        context.fillRect(snake[i].x,
                         snake[i].y,
                         box,
                         box);

        context.strokeRect(snake[i].x,
                         snake[i].y,
                         box,
                         box);
    }
}

function drawFood(){
    context.fillStyle   = "blue";
    context.strokestyle = "darkblue";

    foods.forEach(function(item){
        console.log(foods);
        context.fillRect(item.x, item.y, box, box);
        context.strokeRect(item.x, item.y, box, box);        
    });
    console.log("End");
}

function drawPoison(){
    context.fillStyle   = "red";
    context.strokestyle = "darkred";
    context.fillRect(poison.x, poison.y, box, box);
    context.strokeRect(poison.x, poison.y, box, box);
}


document.addEventListener('keydown', update);

function update(event) {
    if(event.keyCode == 37 && direction != "right") direction = "left";
    if(event.keyCode == 38 && direction != "down") direction = "up";
    if(event.keyCode == 39 && direction != "left") direction = "right";
    if(event.keyCode == 40 && direction != "up") direction = "down";
}

function end_game(){ 
            clearInterval(game);
            alert('Game Over');
            document.location.reload();
}

function without_borders(){
    if(snake[0].x > 15 * box && direction == "right") snake[0].x = 0;
    if(snake[0].x < 0 && direction == "left") snake[0].x = 16 * box;
    if(snake[0].y > 15 * box && direction == "down") snake[0].y = 0;
    if(snake[0].y < 0  && direction == "up") snake[0].y = 16 * box;    
}


function with_borders(){
    if(snake[0].x > 15 * box && direction == "right") end_game();
    if(snake[0].x < 0 && direction == "left") end_game();
    if(snake[0].y > 15 * box && direction == "down") end_game();
    if(snake[0].y < 0  && direction == "up") end_game();    
}


function Game(){
    
    if (border==false) without_borders();
    else with_borders();

    for (let i=1; i < snake.length; i++) {
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) end_game();
    }

    drawBG ();
    drawSnake();
    drawFood();
    if (poisons==true) drawPoison();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "right") snakeX += box;
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "down") snakeY += box;

    //food 

    let flag = 0;
    foods.forEach(function(item,index){

     if(snakeX == item.x && snakeY == item.y) {
            if (speed>=150) {
                score  += 10;
            }else if (speed>=100 && speed<150){
                score +=20;
            }else if (speed>=50 && speed<100){
                score +=30;
            }else if (speed>=25 && speed<50){
                score +=40;
            }else{
                score +=50;
            }
            document.getElementById('score').innerHTML = score;
            foods.splice(index, 1);

            let food = {
            x: Math.floor(Math.random() * 15 + 1) * box,
            y: Math.floor(Math.random() * 15 + 1) * box
            }

            foods.push(food);

            if (speed > 0) speed = speed - 20;
            else speed = 1;

            flag = 1;
        }

    });

    if (flag==0) snake.pop();

   
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
    
    //poison

    if (poison_trick==1) end_game();
    if(snakeX == poison.x && snakeY == poison.y) poison_trick = 1;

}


function start(){
        document.location.reload();
}

document.getElementById("start").onclick = function() {
    start();
    };


let game = setInterval(Game,  speed);

