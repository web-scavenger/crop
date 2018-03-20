var addNewImgBtn = document.getElementById('add__new--img');// button for upload new file
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var cutButton = document.querySelector('.cut__btn');
var canvasImgPath; // new img path for canvas
var startPointX = 0; // start canvas position X
var startPointY = 0; // start canvas position Y
var startPoint = 0;
var endPointX = 80; // 
var endPointY = 80; //
var retreat = 80;
var retreatTop = 80; // retreat for crop frame
var retreatLeft = 80; // retreat for crop frame
var retreatRight = 80; // retreat for crop frame
var retreatBottom = 80; // retreat for crop frame
// min size for cutter frame. 20% of dwnld img
var minWidth = 0;
var minHeight = 0;
var percent = 5;
// test
// var leftRetreat = 0;
// var topRetreat = 0;
var canvasWidth;
var canvasHeight;
var mouseDown = false;

cutButton.addEventListener('click', cutImage);


addNewImgBtn.addEventListener("change", downloadNewImg);
//dwld image form input to canvas
function downloadNewImg(event) {

    var input = event.target;
    var reader = new FileReader();

    reader.onload = function () {
        var dataURL = reader.result;
        var output = document.getElementById('upload__img');
        output.classList.remove('display__none');
        output.src = dataURL;
        canvasImgPath = output;
        output.onload = function () {
            console.log(output.offsetHeight + ' / ' + output.offsetWidth)
            frameCutter(output, output.offsetHeight, output.offsetWidth);
            output.classList.add('display__none');

        }

    };
    reader.readAsDataURL(input.files[0]);


}

//draw image to canvas & draw crop frame
function frameCutter(canvasImgPath, height, width) {

    canvas.width = width;
    canvas.height = height;
    minHeight = canvas.height/percent;
    minWidth = canvas.width/percent;
    
    // test
    canvasHeight = height;
    canvasWidth = width;


    ctx.drawImage(canvasImgPath, 0, 0);

    ctx.beginPath();
    ctx.setLineDash([10, 15]);
    
    // start
    ctx.moveTo(startPointX + retreat, startPointY + retreat); 
    // top
    ctx.lineTo(canvas.width - retreat, startPointY + retreat);

    //right
    ctx.lineTo(canvas.width - retreat, canvas.height - retreat);

    // bottom
    ctx.lineTo(startPointX + retreat, canvas.height - retreat);

    //left
    ctx.lineTo(startPointX + retreat, startPointY + retreat);
    // ctx.strokeStyle="#222222";
    // ctx.fillStyle = "#2222223d";
    ctx.stroke();

    putLine();



}



function putLine() {


    canvas.addEventListener('mousemove', function (event) {
    
        if (event.offsetX > startPointX + retreatLeft - 4 && event.offsetX < startPointX + retreatLeft + 4 && event.offsetY > startPointY + retreatLeft && event.offsetY < canvasHeight - retreatLeft) {


            canvas.style.cursor = 'e-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveLeftLine, false);
            }

        } else if (event.offsetY > startPointY + retreatTop - 4 && event.offsetY < startPointY + retreatTop + 4 && event.offsetX > startPointX + retreatTop && event.offsetX < canvasWidth) {
            canvas.style.cursor = 'n-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveTopLine, false);
            }
        } else if (event.offsetX > canvasWidth - endPointX - 4 && event.offsetX < canvasWidth - endPointX + 4 && event.offsetY > startPointY && event.offsetY < canvasHeight - 80) {
            canvas.style.cursor = 'w-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveRightLine, false);
            }

        } else if (event.offsetY > canvasHeight - endPointY - 4 && event.offsetY < canvasHeight - endPointY + 4 && event.offsetX < canvasWidth - 80 && event.offsetX > startPointX) {
            canvas.style.cursor = 's-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveBottomLine, false);
            }

        } else if(event.offsetX > startPointX + retreatLeft + 4 && event.offsetX < canvasWidth - endPointX - 4 && event.offsetY > startPointY + retreatTop + 4 && event.offsetY < canvasHeight - endPointY - 4){
            canvas.style.cursor = 'move';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveCutterFrame);
            }

        } else {
            canvas.style.cursor = 'default';
            mouseDown = false;
            canvas.removeEventListener('mousedown', moveLeftLine);
            canvas.removeEventListener('mousedown', moveTopLine);
            canvas.removeEventListener('mousedown', moveRightLine);
            canvas.removeEventListener('mousedown', moveBottomLine);
            canvas.removeEventListener('mousedown', moveCutterFrame);
        }
    })
}


function moveLeftLine(event) {
    // canvas.style.cursor = 'e-resize';
    canvas.onmousemove = function (event) {

        if (event.offsetX > canvasWidth - endPointX  - minWidth) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'e-resize';
            // leftRetreat = event.offsetX - retreat;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(canvasImgPath, 0, 0);
            ctx.beginPath();
            ctx.moveTo(event.offsetX, startPointY + retreatTop);

            ctx.lineTo(canvasWidth - endPointX, startPointY + retreatTop);

            ctx.lineTo(canvasWidth - endPointX, canvasHeight - endPointY);

            ctx.lineTo(event.offsetX, canvasHeight - endPointY);

            ctx.lineTo(event.offsetX, startPointY + retreatTop);
            ctx.stroke();
            // putLine();
            startPointX = event.offsetX;
            retreatLeft = 0;
            

        }

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveLeftLine);

    }
}

function moveTopLine() {
    canvas.onmousemove = function (event) {
        
        if (event.offsetY > canvasHeight - endPointY - minHeight) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'n-resize';
            // topRetreat = event.offsetX - retreat;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(canvasImgPath, 0, 0);
            ctx.beginPath();

            // start
            ctx.moveTo(startPointX + retreatLeft, startPointY + retreatTop);
            // top
            ctx.lineTo(canvasWidth - endPointX, startPointY + retreatTop);
            // ctx.fillRect(canvas.width - retreat - 5, startPoint + retreat -5, 10, 10);
            //right
            ctx.lineTo(canvasWidth - endPointX, canvasHeight - endPointY);

            // bottom
            ctx.lineTo(startPointX + retreatLeft, canvasHeight - endPointY);

            //left
            ctx.lineTo(startPointX + retreatLeft, startPointY + retreatTop);
            ctx.stroke();
            // putLine();
            startPointY = event.offsetY;
            retreatTop = 0;
            

        }
        

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveLeftLine);

    }
}

function moveRightLine() {
    canvas.onmousemove = function (event) {

        if (event.offsetX < startPointX + retreatLeft + minWidth) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'w-resize';
            // topRetreat = event.offsetX - retreat;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(canvasImgPath, 0, 0);
            ctx.beginPath();

            // start

            // top
            ctx.moveTo(startPointX + retreatLeft, startPointY + retreatTop);

            ctx.lineTo(event.offsetX - retreatRight, startPointY + retreatTop);

            ctx.lineTo(event.offsetX - retreatRight, canvasHeight - endPointY);

            ctx.lineTo(startPointX + retreatLeft, canvasHeight - endPointY);

            ctx.lineTo(startPointX + retreatLeft, startPointY + retreatTop);

            ctx.stroke();
            // putLine();
            // retreatRight = event.offsetX;

            retreatRight = 0;
            endPointX = canvasWidth - event.offsetX
            


        }

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveRightLine);

    }
}

function moveBottomLine() {
    canvas.onmousemove = function (event) {

        if (event.offsetY < startPointY + retreatTop + minHeight) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 's-resize';
            retreatBottom = 0;
            // topRetreat = event.offsetX - retreat;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(canvasImgPath, 0, 0);
            ctx.beginPath();

            // start

            // top
            ctx.moveTo(startPointX + retreatLeft,  startPointY + retreatTop);
        
            ctx.lineTo(canvasWidth - endPointX, startPointY + retreatTop);
           
            ctx.lineTo(canvasWidth - endPointX, event.offsetY + retreatBottom);

         
            ctx.lineTo(startPointX + retreatLeft, event.offsetY - retreatBottom);

           
            ctx.lineTo(startPointX + retreatLeft, startPointY + retreatTop);

            ctx.stroke();
            // putLine();
            // retreatRight = event.offsetX;

            
            endPointY = canvasHeight - event.offsetY
           


        }

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveBottomLine);

    }
}

function moveCutterFrame(){
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(canvasImgPath, 0, 0);

    // ctx.beginPath();
    // ctx.setLineDash([10, 15]);
    console.log(startPointY + retreatTop);
    console.log(startPointX + retreatLeft);
    console.log(endPointX);
    console.log(endPointY);
    
   

            
}


function cutImage(){
    var sliceLeftX = startPointX + retreatLeft;
    var sliceLeftY = startPointY + retreatTop;
    var sliceWidth = canvasWidth - retreatLeft - startPointX - endPointX;
    var sliceHeight = canvasHeight - startPointY - endPointY;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvasImgPath, sliceLeftX, sliceLeftY, sliceWidth,  sliceHeight, startPoint, startPoint, canvasWidth, canvasHeight);
    
}

