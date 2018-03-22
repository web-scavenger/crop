var addNewImgBtn = document.getElementById('add__new--img');// button for upload new file

var canvas = document.getElementById('canvas');
var canvasPreview = document.getElementById('canvas__preview');

var ctx = canvas.getContext('2d');
var ctxPr = canvasPreview.getContext('2d');
var cutButton = document.querySelector('.cut__btn');
var canvasImgPath; // new img path for canvas
var startPointX = 80; // start canvas position X
var startPointY = 80; // start canvas position Y
var startPoint = 0;
var endPointX = 80; // 
var endPointY = 80; //
var retreat = 0;
var retreatTop = 0; // retreat for crop frame
var retreatLeft = 0; // retreat for crop frame
var retreatRight = 0; // retreat for crop frame
var retreatBottom = 0; // retreat for crop frame
// min size for cutter frame. 20% of dwnld img
var minWidth = 0;
var minHeight = 0;
var percent = 5;
var imagePercent = 0.8;

var canvasWidth = this.innerWidth;
var canvasHeight = this.innerHeight;
var mouseDown = false;
var moveToY;
var moveToX;
var timeMoveToX = 0;

var originalImgWidth;
var originalImgHeight;

var windowWidth = 0;
var windowHeight = 0;


cutButton.addEventListener('click', cutImage);

window.addEventListener('resize', function(){
    canvasWidth = this.innerWidth;
    canvasHeight = this.innerHeight;
    frameCutter(canvasImgPath, canvasHeight, canvasWidth);
})


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
    
    originalImgWidth = width;
    originalImgHeight = height;
    // canvas.width = width;
    // canvas.height = height;
    canvas.width = canvasWidth * imagePercent;
    canvas.height = canvasHeight * imagePercent;
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    minHeight = canvas.height / percent;
    minWidth = canvas.width / percent;
    console.log(canvasWidth, canvasHeight)
    // test
    // canvasHeight = height;
    // canvasWidth = width;
    startPointX = 80; // start canvas position X
    startPointY = 80; // start canvas position Y

    endPointX = 80; // 
    endPointY = 80; //




    ctx.drawImage(canvasImgPath, 0, 0, canvasWidth ,canvasHeight);

    ctx.beginPath();


    // start
    ctx.moveTo(startPointX, startPointY);
    // top
    ctx.lineTo(canvas.width - endPointY, startPointY);

    //right
    ctx.lineTo(canvas.width - endPointX, canvas.height - endPointY);

    // bottom
    ctx.lineTo(startPointX + retreat, canvas.height - endPointX);

    //left
    ctx.lineTo(startPointX + retreat, startPointY + retreat);

    frameOutside()
    ctx.restore();
    ctx.setLineDash([10, 15]);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.stroke();
   
    putLine();
    // addOverlay();



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

        } else if (event.offsetX > startPointX + retreatLeft + 4 && event.offsetX < canvasWidth - endPointX - 4 && event.offsetY > startPointY + retreatTop + 4 && event.offsetY < canvasHeight - endPointY - 4) {
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

        if (event.offsetX > canvasWidth - endPointX - minWidth) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'e-resize';
            // leftRetreat = event.offsetX - retreat;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth ,canvasHeight);

            ctx.beginPath();
            ctx.moveTo(event.offsetX, startPointY + retreatTop);

            ctx.lineTo(canvasWidth - endPointX, startPointY + retreatTop);

            ctx.lineTo(canvasWidth - endPointX, canvasHeight - endPointY);

            ctx.lineTo(event.offsetX, canvasHeight - endPointY);

            ctx.lineTo(event.offsetX, startPointY + retreatTop);
            frameOutside();

            ctx.stroke();
            // addOverlay();
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

            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth ,canvasHeight);

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
            frameOutside();
            // addOverlay();
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
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth ,canvasHeight);

            ctx.beginPath();

            // start

            // top
            ctx.moveTo(startPointX + retreatLeft, startPointY + retreatTop);

            ctx.lineTo(event.offsetX - retreatRight, startPointY + retreatTop);

            ctx.lineTo(event.offsetX - retreatRight, canvasHeight - endPointY);

            ctx.lineTo(startPointX + retreatLeft, canvasHeight - endPointY);

            ctx.lineTo(startPointX + retreatLeft, startPointY + retreatTop);

            frameOutside();
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

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth ,canvasHeight);

            ctx.beginPath();

            // start

            // top
            ctx.moveTo(startPointX + retreatLeft, startPointY + retreatTop);

            ctx.lineTo(canvasWidth - endPointX, startPointY + retreatTop);

            ctx.lineTo(canvasWidth - endPointX, event.offsetY + retreatBottom);


            ctx.lineTo(startPointX + retreatLeft, event.offsetY - retreatBottom);


            ctx.lineTo(startPointX + retreatLeft, startPointY + retreatTop);

            frameOutside();
            ctx.stroke();

            endPointY = canvasHeight - event.offsetY;

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

function moveCutterFrame() {
    var startClickPointX = event.offsetX;
    var startClickPointY = event.offsetY;

    var counterStartPointX = 0;
    var counterStartPointY = 0;
    var counterEndPointX = 0;
    var counterEndPointY = 0;
    counterStartPointX = startPointX;
    counterStartPointY = startPointY;
    counterEndPointX = endPointX;
    counterEndPointY = endPointY;
    canvas.onmousemove = function (event) {

        moveToX = event.offsetX - startClickPointX;
        moveToY = event.offsetY - startClickPointY;
        if (startPointX < 5) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth ,canvasHeight);
            ctx.beginPath();
            var sliceLeftX = startPointX;
            var sliceLeftY = startPointY;
            var sliceWidth = canvasWidth - startPointX - endPointX;
            var sliceHeight = canvasHeight - startPointY - endPointY;

            ctx.rect(sliceLeftX, sliceLeftY, sliceWidth, sliceHeight);

            frameOutside();
            ctx.stroke();

            startPointX = startPointX + 5;
            startPointY = counterStartPointY + moveToY;
            endPointX = counterEndPointX - moveToX;
            endPointY = counterEndPointY - moveToY;

        }
        else {
            console.log()
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth ,canvasHeight);
            ctx.beginPath();
            var sliceLeftX = startPointX;
            var sliceLeftY = startPointY;
            var sliceWidth = canvasWidth - startPointX - endPointX;
            var sliceHeight = canvasHeight - startPointY - endPointY;

            ctx.rect(sliceLeftX, sliceLeftY, sliceWidth, sliceHeight);

            frameOutside();
            ctx.stroke();

            startPointX = counterStartPointX + moveToX;
            startPointY = counterStartPointY + moveToY;
            endPointX = counterEndPointX - moveToX;
            endPointY = counterEndPointY - moveToY;
        }





    }
    canvas.onmouseup = function () {

        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveCutterFrame);

    }

}



function cutImage() {
    // startPointX = startPointX * 1.5;
    // startPointY = startPointY * 1.25;
    var originaStartPointX = startPointX * 1.25;
    var originaStartPointY = startPointY * 1.25;
    var originaEndPointX = endPointX * 1.25;
    var originaEndPointY = endPointY * 1.25;

    
    
    var sliceLeftX = originaStartPointX + retreatLeft;
    var sliceLeftY = originaStartPointY + retreatTop;
    var sliceWidth = originalImgWidth - retreatLeft - originaStartPointX - originaEndPointX;
    var sliceHeight = originalImgHeight - originaStartPointY - retreatTop - originaEndPointY;

    canvasPreview.width = canvasWidth;
    canvasPreview.height = canvasHeight;

    ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
    ctxPr.drawImage(canvasImgPath, sliceLeftX, sliceLeftY, sliceWidth, sliceHeight, startPoint, startPoint, sliceWidth, sliceHeight);

}

function frameOutside() {
    ctx.restore();
    ctx.fillStyle = "#22222285";

    // top
    ctx.fillRect(startPoint, startPoint, canvasWidth, startPointY + retreatTop);
    // left
    ctx.fillRect(startPoint, retreatTop + startPointY, startPointX + retreatLeft, canvasHeight);
    //bottom
    ctx.fillRect(retreatLeft + startPointX, canvasHeight - endPointY, canvasWidth, endPointY);
    // right
    ctx.fillRect(canvasWidth - endPointX, retreatTop + startPointY, retreatRight + endPointX, canvasHeight - retreatTop - startPointY - endPointY);

}


