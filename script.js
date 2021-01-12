 const grid=document.querySelector('.grid');
 let squares= Array.from(document.querySelectorAll('.grid div'));
 const scoreDisplay=document.getElementById('score');
 const startBtn=document.getElementById('start-button');

 const width=10;
 let nextRandom=0;
 let timerId;
 let score=0;
 const colors=[
   'orange',
   'red',
   'purple',
   'green',
   'blue'
 ];

 //make it go faster as more elements are made
 let speed=0;
 let totalNum=0;

//console.log(squares.length);
/* forEach allows us to apply a function to each element of an array
Syntax : arrayName.forEach(nameOfElement=>{
  //function
}) */

const lTetromino= [
  [1,width+1,width*2+1,2],
  [width,width+1,width+2,width*2+2],
  [1,width+1,width*2+1,width*2],
  [width,width*2,width*2+1,width*2+2]
];
 
const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ];

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ];

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ];

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let currentPos=4;
let currentRot=0;
//randomly selecting 
let random=Math.floor(Math.random()*theTetrominoes.length);

let current=theTetrominoes[random][currentRot];

//drawing the Tetromino
function draw(){
  current.forEach(index=>{
    squares[currentPos+index].classList.add('tetromino')
    squares[currentPos+index].style.backgroundColor=colors[random];
  })
}

//undrawing
function undraw(){
  current.forEach(index=>{
    squares[currentPos+index].classList.remove('tetromino')
    squares[currentPos+index].style.backgroundColor='';
    }
  
  )
}

//movedown function
//timerId=setInterval(moveDown,500);

//assign functions to keycodes
function control(e){
  if(e.keyCode===37){
    moveLeft();
  }
  else if(e.keyCode===38){
    rotate();
  }
  else if(e.keyCode===39){
    moveRight();
  }
  else if(e.keyCode===40){
    moveDown();
  }
}
//attaching a keypress listener to the whole doc
document.addEventListener('keyup',control);


//movedown function
function moveDown(){
  undraw();
  currentPos+=width;
  draw();
  freeze();
}

//freeze functoin
function freeze(){
  if(current.some(index=>squares[currentPos+index+width].classList.contains('taken'))){
    current.forEach(index=>squares[currentPos+index].classList.add("taken"));
  
  random=nextRandom;
  nextRandom=Math.floor(Math.random()*theTetrominoes.length);
  current=theTetrominoes[random][currentRot];
  currentPos=4;
  draw();
  displayShape();
  addScore();
  
  //my code
  speed+=30-totalNum;
  totalNum++;
  clearInterval(timerId);
  timerId=setInterval(moveDown,600-speed);
  //
  gameOver();


  }
}

//prevent movement if they are at either edge
function moveLeft(){
  undraw();
  const isAtLeftEdge= current.some(index=>(currentPos + index)%width===0);
  if(!isAtLeftEdge){
    currentPos-=1;
  }
  
  if(current.some(index=>squares[currentPos+index].classList.contains('taken'))){
    currentPos+=1;
  }
  
  draw();
}

//same as moveLeft but right
function moveRight(){
  undraw();
  const isAtRightEdge= current.some(index=>(currentPos + index)%width===width-1);
  if(!isAtRightEdge){
    currentPos+=1;
  }
  
  if(current.some(index=>squares[currentPos+index].classList.contains('taken'))){
    currentPos-=1;
  }
  
  draw();
}

//rotate the tetromino
function rotate(){
  undraw();
  currentRot++;
  if(currentRot===current.length){
    currentRot=0;
  } //return to beginning
  current=theTetrominoes[random][currentRot];
  draw();
}

//showing next tetromino
const displaySquares=document.querySelectorAll('.mini-grid div');
const displayWidth=4;
const displayIndex=0;

//the tetrominos w/o rotations
const upNext=[
  [1,displayWidth+1,displayWidth*2+1,2],
 [0,displayWidth,displayWidth+1,displayWidth*2+1],
[1,displayWidth,displayWidth+1,displayWidth+2],
  [0,1,displayWidth,displayWidth+1],
  [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]
];

//display next shape
function displayShape(){
  displaySquares.forEach(square=>{
    square.classList.remove('tetromino')
    square.style.backgroundColor=''
  });
  upNext[nextRandom].forEach(index=>{
    displaySquares[displayIndex+index].classList.add('tetromino')
    displaySquares[displayIndex+index].style.backgroundColor=colors[nextRandom]
  });
}

//add function to button
startBtn.addEventListener('click',()=>{
  if(timerId){
    clearInterval(timerId);
    timerId=null;


  }
  else{
    draw();
    timerId=setInterval(moveDown,500);
    nextRandom=Math.floor(Math.random()*theTetrominoes.length);
    displayShape();
  }
})

//add score
function addScore(){
  for(let i=0;i<199;i+=width){
    const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
  
  if(row.every(index=>squares[index].classList.contains('taken'))){
    score+=10;
    scoreDisplay.innerHTML=score;
    row.forEach(index=>{
      squares[index].classList.remove('taken');
      squares[index].classList.remove('tetromino');
      squares[index].style.backgroundColor='';
    })
    const squaresRemoved=squares.splice(i,width);
    squares = squaresRemoved.concat(squares);
    squares.forEach(cell=>grid.appendChild(cell));
  }
  }
}

//game over 
function gameOver(){
  if(current.some(index=>squares[currentPos+index].classList.contains('taken'))){
    scoreDisplay.innerHTML='Game Over!';
    clearInterval(timerId);
  }
}