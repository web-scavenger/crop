var addNewImgBtn = document.getElementById('add__new--img');// button for upload new file

var canvas = document.getElementById('canvas');
var canvasPreview = document.getElementById('canvas__preview');

var ctx = canvas.getContext('2d');
var ctxPr = canvasPreview.getContext('2d');
var cutButton = document.getElementById('preview__btn');

document.querySelector('.back__btn').addEventListener('click', function () {
    document.querySelector('.preview__block').style.display = 'none';
})

var canvasImgPath; // new img path for canvas
var startPointX = 0; // start canvas position X
var startPointY = 0; // start canvas position Y
var startPoint = 0;
var endPointX = 0; // 
var endPointY = 0; //

// min size for cutter frame. 20% of dwnld img
var minWidth = 0;
var minHeight = 0;
var percent = 5;
var imagePercent = 0.55;
var imagePercentHeight = 0.6;

var pointRect; // frame points rects size
var lineWidth; // frame width

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var mouseDown = false;
var moveToY;
var moveToX;

var originalImgWidth;
var originalImgHeight;


var compress_canvas_width;
var compress_canvas_height;

var imageName;


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
    imageName = input.files[0].name;


}

//draw image to canvas & draw crop frame
function frameCutter(canvasImgPath, height, width) {

    document.getElementById('preview__btn').removeAttribute('disabled');

    originalImgWidth = width;
    originalImgHeight = height;

    canvas.width = originalImgWidth;
    canvas.height = originalImgHeight;

    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    pointRect = originalImgWidth / 50;
    lineWidth = originalImgWidth / 250;

    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    minHeight = canvas.height / percent;
    minWidth = canvas.width / percent;


    startPointX = canvasWidth * 0.05; // start canvas position X
    startPointY = canvasWidth * 0.05; // start canvas position Y

    endPointX = canvasWidth * 0.05; // 
    endPointY = canvasWidth * 0.05; //



    ctx.drawImage(canvasImgPath, 0, 0, originalImgWidth, originalImgHeight);
    

    

    ctx.beginPath();


    // start

    ctx.fillStyle = '#0893d2';
    ctx.moveTo(startPointX, startPointY);

    // top
    ctx.lineTo(canvas.width - endPointY, startPointY);

    //right
    ctx.lineTo(canvas.width - endPointX, canvas.height - endPointY);

    // bottom
    ctx.lineTo(startPointX, canvas.height - endPointX);

    //left
    ctx.lineTo(startPointX, startPointY);

    // frameOutside()

    ctx.setLineDash([7, 5]);
    ctx.fillStyle = '#0893d2';
    ctx.strokeStyle = '#0893d2';
    ctx.lineWidth = lineWidth;
    ctx.stroke();


    putLine();

    // console.log((canvasWidth - startPointX - startPointX) / 2)

    ctx.fillStyle = '#0893d2';
    ctx.fillRect(startPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
    ctx.fillRect(canvas.width - endPointY - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
    ctx.fillRect(canvas.width - endPointX - pointRect / 2, canvas.height - endPointY - pointRect / 2, pointRect, pointRect);
    ctx.fillRect(startPointX - pointRect / 2, canvas.height - endPointX - pointRect / 2, pointRect, pointRect);


    ctx.fillStyle = '#54545499';
    ctx.fillRect(0, 0, originalImgWidth, originalImgHeight);
    ctx.globalCompositeOperation = 'copy';



    compress_canvas_width = document.getElementById('canvas').offsetWidth;
    compress_canvas_height = document.getElementById('canvas').offsetHeight;


}


function putLine() {


    canvas.addEventListener('mousemove', function (event) {

        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;

        if (eX > startPointX - 6 && eX < startPointX + 6 && eY > startPointY + 20 && eY < canvasHeight - endPointY - 6) {


            canvas.style.cursor = 'e-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveLeftLine, false);
            }

        }
        else if (eY > startPointY - 10 && eY < startPointY + 19 && eX > startPointX - 10 && eX < startPointX + 19) {

            canvas.style.cursor = 'nw-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveTopLeftLinePerspective, false);
            }
        } else if (eY > startPointY - 6 && eY < startPointY + 6 && eX > startPointX + 4 && eX < canvasWidth - endPointX - 6) {
            canvas.style.cursor = 'n-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveTopLine, false);
            }
        } else if (eY > startPointY - 10 && eY < startPointY + 10 && eX > canvasWidth - endPointX - 4 && eX < canvasWidth - endPointX + 34) {

            canvas.style.cursor = 'sw-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveTopRightLine, false);
            }
        } else if (eX > canvasWidth - endPointX && eX < canvasWidth - endPointX + 34 && eY > startPointY + 15 && eY < canvasHeight - endPointY - 10) {
            canvas.style.cursor = 'w-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveRightLine, false);
            }

        } else if (eX > canvasWidth - endPointX - 4 && eX < canvasWidth - endPointX + 32 && eY < canvasHeight - endPointY + 32 && eY > canvasHeight - endPointY - 6) {

            canvas.style.cursor = 'se-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveRightBottomLine, false);
            }

        } else if (eY > canvasHeight - endPointY - 2 && eY < canvasHeight - endPointY + 32 && eX < canvasWidth - endPointX - 6 && eX > startPointX + 20) {
            canvas.style.cursor = 's-resize';

            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveBottomLine, false);
            }

        } else if (eX > startPointX - 10 && eX < startPointX + 20 && eY > canvasHeight - endPointY - 20 && eY < canvasHeight - endPointY + 20) {
            canvas.style.cursor = 'ne-resize';

            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveLeftBottomLine, false);
            }

        } else if (eX > startPointX + 8 && eX < canvasWidth - endPointX - 8 && eY > startPointY + 8 && eY < canvasHeight - endPointY - 8) {
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
            canvas.removeEventListener('mousedown', moveTopLeftLinePerspective);
            canvas.removeEventListener('mousedown', moveTopLine);
            canvas.removeEventListener('mousedown', moveTopRightLine);
            canvas.removeEventListener('mousedown', moveRightLine);
            canvas.removeEventListener('mousedown', moveRightBottomLine);
            canvas.removeEventListener('mousedown', moveBottomLine);
            canvas.removeEventListener('mousedown', moveLeftBottomLine);
            canvas.removeEventListener('mousedown', moveCutterFrame);
        }
    })
}


function moveLeftLine(event) {

    canvas.onmousemove = function (event) {
        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        if (eX > canvasWidth - endPointX - minWidth) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'e-resize';

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);

            ctx.beginPath();
            ctx.moveTo(eX, startPointY);

            ctx.lineTo(canvasWidth - endPointX, startPointY);

            ctx.lineTo(canvasWidth - endPointX, canvasHeight - endPointY);

            ctx.lineTo(eX, canvasHeight - endPointY);

            ctx.lineTo(eX, startPointY);
            frameOutside();

            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(eX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(eX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);

            startPointX = eX;

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

function moveTopLeftLinePerspective(event) {
    var staticX = startPointX;
    var staticY = startPointY;
    canvas.onmousemove = function (event) {
        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
        
        if (eX > canvasWidth - endPointX - minWidth) {
            ctx.closePath()
        }
        else {

            
            canvas.style.cursor = 'nw-resize';

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);
            
            ctx.beginPath();
            ctx.moveTo(eX, eY);

            ctx.lineTo(canvasWidth - endPointX, staticY);

            ctx.lineTo(canvasWidth - endPointX, canvasHeight - endPointY);

            ctx.lineTo(staticX, canvasHeight - endPointY);

            ctx.lineTo(eX, eY);
            frameOutside();

            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(eX - pointRect / 2, eY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, eY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(eX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);

            startPointX = eX;
            startPointY = eY;

        }

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveTopLeftLinePerspective);

    }
}

function moveTopLine() {
    canvas.onmousemove = function (event) {
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
        if (eY > canvasHeight - endPointY - minHeight) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'n-resize';

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);

            ctx.beginPath();

            // start
            ctx.moveTo(startPointX, startPointY);
            // top
            ctx.lineTo(canvasWidth - endPointX, startPointY);

            //right
            ctx.lineTo(canvasWidth - endPointX, canvasHeight - endPointY);

            // bottom
            ctx.lineTo(startPointX, canvasHeight - endPointY);

            //left
            ctx.lineTo(startPointX, startPointY);
            frameOutside();

            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(startPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);

            startPointY = eY;

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

function moveTopRightLine() {
    canvas.onmousemove = function (event) {
        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
        if (eY > canvasHeight - endPointY - minHeight) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'sw-resize';

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);

            ctx.beginPath();

            // start
            ctx.moveTo(startPointX, startPointY);
            // top
            ctx.lineTo(canvasWidth - endPointX, startPointY);

            //right
            ctx.lineTo(canvasWidth - endPointX, canvasHeight - endPointY);


            ctx.lineTo(startPointX, canvasHeight - endPointY);


            ctx.lineTo(startPointX, startPointY);
            frameOutside();

            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(startPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);

            startPointY = eY;
            endPointX = canvasWidth - eX;

        }


    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveTopRightLine);

    }
}

function moveRightLine() {
    canvas.onmousemove = function (event) {
        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        if (eX < startPointX + minWidth) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'w-resize';

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);

            ctx.beginPath();

            // start

            // top
            ctx.moveTo(startPointX, startPointY);

            ctx.lineTo(eX, startPointY);

            ctx.lineTo(eX, canvasHeight - endPointY);

            ctx.lineTo(startPointX, canvasHeight - endPointY);

            ctx.lineTo(startPointX, startPointY);

            frameOutside();
            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(eX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(eX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(startPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);

            endPointX = canvasWidth - eX;



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

function moveRightBottomLine() {
    canvas.onmousemove = function (event) {
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        if (eY < startPointY + minHeight) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'se-resize';


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);

            ctx.beginPath();

            ctx.moveTo(startPointX, startPointY);

            ctx.lineTo(eX, startPointY);

            ctx.lineTo(eX, eY);


            ctx.lineTo(startPointX, eY);


            ctx.lineTo(startPointX, startPointY);

            frameOutside();
            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(eX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(eX - pointRect / 2, eY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(startPointX - pointRect / 2, eY - pointRect / 2, pointRect, pointRect);

            endPointX = canvasWidth - eX;
            endPointY = canvasHeight - eY;

        }

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveRightBottomLine);

    }
}

function moveBottomLine() {
    canvas.onmousemove = function (event) {
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
        if (eY < startPointY + minHeight) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 's-resize';


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);

            ctx.beginPath();

            ctx.moveTo(startPointX, startPointY);

            ctx.lineTo(canvasWidth - endPointX, startPointY);

            ctx.lineTo(canvasWidth - endPointX, eY);


            ctx.lineTo(startPointX, eY);

            ctx.lineTo(startPointX, startPointY);

            frameOutside();
            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, eY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(startPointX - pointRect / 2, eY - pointRect / 2, pointRect, pointRect);

            endPointY = canvasHeight - eY;

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

function moveLeftBottomLine(event) {

    canvas.onmousemove = function (event) {
        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
        if (eX > canvasWidth - endPointX - minWidth) {
            ctx.closePath()
        }
        else {
            canvas.style.cursor = 'ne-resize';

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);

            ctx.beginPath();
            ctx.moveTo(eX, startPointY);

            ctx.lineTo(canvasWidth - endPointX, startPointY);

            ctx.lineTo(canvasWidth - endPointX, canvasHeight - endPointY);

            ctx.lineTo(eX, canvasHeight - endPointY);

            ctx.lineTo(eX, startPointY);
            frameOutside();

            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(eX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(eX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);

            startPointX = eX;
            endPointY = canvasHeight - eY;

        }

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveLeftBottomLine);

    }
}

function moveCutterFrame() {
    var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
    var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
    var startClickPointX = eX;
    var startClickPointY = eY;

    var counterStartPointX = 0;
    var counterStartPointY = 0;
    var counterEndPointX = 0;
    var counterEndPointY = 0;
    counterStartPointX = startPointX;
    counterStartPointY = startPointY;
    counterEndPointX = endPointX;
    counterEndPointY = endPointY;
    canvas.onmousemove = function (event) {
        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
        moveToX = eX - startClickPointX;
        moveToY = eY - startClickPointY;

        if (startPointX < 5 || startPointY < 5 || endPointX < 5 || endPointY < 5) {
            ctx.closePath();

        }
        else {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);
            ctx.beginPath();
            var sliceLeftX = startPointX;
            var sliceLeftY = startPointY;
            var sliceWidth = canvasWidth - startPointX - endPointX;
            var sliceHeight = canvasHeight - startPointY - endPointY;

            ctx.rect(sliceLeftX, sliceLeftY, sliceWidth, sliceHeight);

            frameOutside();
            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - endPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(startPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);


        }
        startPointX = counterStartPointX + moveToX;
        startPointY = counterStartPointY + moveToY;
        endPointX = counterEndPointX - moveToX;
        endPointY = counterEndPointY - moveToY;

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
    document.querySelector('.preview__block').style.display = 'block';


    var coecifX = originalImgWidth / (canvasWidth);
    var coecifY = originalImgHeight / (canvasHeight);


    var sliceLeftX = ((originalImgWidth * (Math.floor(100 * startPointX) / canvasWidth)) / 100);
    var sliceLeftY = ((originalImgHeight * (Math.floor(100 * startPointY) / canvasHeight)) / 100);
    var sliceWidth = originalImgWidth - sliceLeftX - (Math.floor(originalImgWidth * ((100 * endPointX) / canvasWidth) / 100));
    var sliceHeight = originalImgHeight - sliceLeftY - (Math.floor(originalImgHeight * ((100 * endPointY) / canvasHeight) / 100));


    canvasPreview.width = sliceWidth;
    canvasPreview.height = sliceHeight;

    canvasPreview.style.width = '100%';
    canvasPreview.style.height = 'auto';



    var imageLeftLeg = new Image();
    var imageRightLeg = new Image();
  
    
    imageLeftLeg.src = 'left_stick.png';
    imageLeftLeg.crossOrigin = "Anonymous";

    imageRightLeg.src = 'right_stick.png';
    imageRightLeg.crossOrigin = "Anonymous";
    

    console.log(sliceHeight, sliceWidth, sliceWidth - sliceWidth * 0.2);
    imageRightLeg.onload = function () {

        ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
        ctxPr.drawImage(canvasImgPath, sliceLeftX, sliceLeftY, sliceWidth, sliceHeight, startPoint, startPoint, sliceWidth, sliceHeight - (originalImgHeight / 25));

        ctxPr.drawImage(imageLeftLeg, sliceWidth * 0.2, sliceHeight - (originalImgHeight / 25), originalImgWidth / 20, originalImgHeight / 25);
        ctxPr.drawImage(imageRightLeg, sliceWidth - sliceWidth * 0.25, sliceHeight - (originalImgHeight / 25), originalImgWidth / 20, originalImgHeight / 25);

        var prUrl = canvasPreview.toDataURL("image/jpeg");

        document.querySelector('.download__btn--block').style.display = 'block';
        document.getElementById('prev__cut__image__url').setAttribute('href', prUrl);
        document.getElementById('prev__cut__image__url').download = imageName;

    }


}

function frameOutside() {
    ctx.restore();
    ctx.fillStyle = "#22222285";

    // top
    ctx.fillRect(startPoint, startPoint, canvasWidth, startPointY);
    // left
    ctx.fillRect(startPoint, startPointY, startPointX, canvasHeight);
    //bottom
    ctx.fillRect(startPointX, canvasHeight - endPointY, canvasWidth, endPointY);
    // right
    ctx.fillRect(canvasWidth - endPointX, startPointY, endPointX, canvasHeight - startPointY - endPointY);

}


