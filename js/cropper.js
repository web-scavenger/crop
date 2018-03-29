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

    frameOutside()

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
                canvas.addEventListener('mousedown', moveTopLeftLine, false);
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
            canvas.removeEventListener('mousedown', moveTopLeftLine);
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

function moveTopLeftLine(event) {

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

            ctx.lineTo(canvasWidth - endPointX, eY);

            ctx.lineTo(canvasWidth - endPointX, canvasHeight - endPointY);

            ctx.lineTo(eX, canvasHeight - endPointY);

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
        canvas.removeEventListener('mousedown', moveTopLeftLine);

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


    var imageLeftLegUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACXCAYAAADZGIPVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAMgmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOk1pY3Jvc29mdFBob3RvPSJodHRwOi8vbnMubWljcm9zb2Z0LmNvbS9waG90by8xLjAvIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUxZDg4Y2I0LThlYzQtZjc0MS1hODM4LTA1ODIyOTQ2MWQ0YiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjFlZDYwZDRlLTQ4MjMtMzQ0Zi1hMTFiLWFhMzdmMjY4M2Y3ZSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSI4RkUwODM4OUY0RkIyNkMxQjNDMzQyQjZERkY1NUYwRiIgcGhvdG9zaG9wOkxlZ2FjeUlQVENEaWdlc3Q9IkQ0MUQ4Q0Q5OEYwMEIyMDRFOTgwMDk5OEVDRjg0MjdFIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTAzLTI5VDE1OjI2OjU5KzAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wMy0yOVQxNjo0NDozNiswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wMy0yOVQxNjo0NDozNiswMzowMCIgdGlmZjpJbWFnZVdpZHRoPSIzMjY0IiB0aWZmOkltYWdlTGVuZ3RoPSIyNDQ4IiB0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb249IjIiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6U2FtcGxlc1BlclBpeGVsPSIzIiB0aWZmOlhSZXNvbHV0aW9uPSI5Ni8xIiB0aWZmOllSZXNvbHV0aW9uPSI5Ni8xIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkV4aWZWZXJzaW9uPSIwMjIxIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIzMjY0IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMjQ0OCI+IDxkYzp0aXRsZT4gPHJkZjpBbHQ+IDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+QnJpc2EgVmVyZGUgR3Jhbml0ZSBTbGFiIEhvbmVkPC9yZGY6bGk+IDwvcmRmOkFsdD4gPC9kYzp0aXRsZT4gPGRjOmRlc2NyaXB0aW9uPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5CcmlzYSBWZXJkZSBHcmFuaXRlIFNsYWIgSG9uZWQ8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOmRlc2NyaXB0aW9uPiA8ZGM6c3ViamVjdD4gPHJkZjpCYWc+IDxyZGY6bGk+QnJpc2EgVmVyZGUgR3Jhbml0ZSBTbGFiIEhvbmVkPC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9kYzpzdWJqZWN0PiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkZjJhZDJlNi03YjkyLTc2NDQtYThiYi01NmZmMzM2NTdmYTYiIHN0RXZ0OndoZW49IjIwMTgtMDMtMjlUMTU6MzU6MzcrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvanBlZyB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjdhNTZlMzNiLTcyYzAtZGI0NS05ZWE0LTQ0MmY3Mzc0NDVkNCIgc3RFdnQ6d2hlbj0iMjAxOC0wMy0yOVQxNTozNTozNyswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTFkODhjYjQtOGVjNC1mNzQxLWE4MzgtMDU4MjI5NDYxZDRiIiBzdEV2dDp3aGVuPSIyMDE4LTAzLTI5VDE2OjQ0OjM2KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3Mp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';
    var imageRightLegUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACXCAYAAADZGIPVAAAACXBIWXMAAAsTAAALEwEAmpwYAAALt2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOk1pY3Jvc29mdFBob3RvPSJodHRwOi8vbnMubWljcm9zb2Z0LmNvbS9waG90by8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdhNTZlMzNiLTcyYzAtZGI0NS05ZWE0LTQ0MmY3Mzc0NDVkNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmVlNjdkMGY2LWY0ZTgtNzk0NC05OTMzLTMyZTUxMzU3MDFjMCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSI4RkUwODM4OUY0RkIyNkMxQjNDMzQyQjZERkY1NUYwRiIgcGhvdG9zaG9wOkxlZ2FjeUlQVENEaWdlc3Q9IkQ0MUQ4Q0Q5OEYwMEIyMDRFOTgwMDk5OEVDRjg0MjdFIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHRpZmY6SW1hZ2VXaWR0aD0iMzI2NCIgdGlmZjpJbWFnZUxlbmd0aD0iMjQ0OCIgdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPSIyIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlNhbXBsZXNQZXJQaXhlbD0iMyIgdGlmZjpYUmVzb2x1dGlvbj0iOTYvMSIgdGlmZjpZUmVzb2x1dGlvbj0iOTYvMSIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpFeGlmVmVyc2lvbj0iMDIyMSIgZXhpZjpDb2xvclNwYWNlPSIxIiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMzI2NCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjI0NDgiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTAzLTI5VDE1OjI2OjU5KzAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wMy0yOVQxNTozNTozNyswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wMy0yOVQxNTozNTozNyswMzowMCI+IDxkYzp0aXRsZT4gPHJkZjpBbHQ+IDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+QnJpc2EgVmVyZGUgR3Jhbml0ZSBTbGFiIEhvbmVkPC9yZGY6bGk+IDwvcmRmOkFsdD4gPC9kYzp0aXRsZT4gPGRjOmRlc2NyaXB0aW9uPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5CcmlzYSBWZXJkZSBHcmFuaXRlIFNsYWIgSG9uZWQ8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOmRlc2NyaXB0aW9uPiA8ZGM6c3ViamVjdD4gPHJkZjpCYWc+IDxyZGY6bGk+QnJpc2EgVmVyZGUgR3Jhbml0ZSBTbGFiIEhvbmVkPC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9kYzpzdWJqZWN0PiA8TWljcm9zb2Z0UGhvdG86TGFzdEtleXdvcmRYTVA+IDxyZGY6QmFnPiA8cmRmOmxpPkJyaXNhIFZlcmRlIEdyYW5pdGUgU2xhYiBIb25lZDwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvTWljcm9zb2Z0UGhvdG86TGFzdEtleXdvcmRYTVA+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmRmMmFkMmU2LTdiOTItNzY0NC1hOGJiLTU2ZmYzMzY1N2ZhNiIgc3RFdnQ6d2hlbj0iMjAxOC0wMy0yOVQxNTozNTozNyswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL2pwZWcgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6N2E1NmUzM2ItNzJjMC1kYjQ1LTllYTQtNDQyZjczNzQ0NWQ0IiBzdEV2dDp3aGVuPSIyMDE4LTAzLTI5VDE1OjM1OjM3KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20g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';


    var imageLeftLeg = new Image();
    var imageRightLeg = new Image();
    var imageLeftLegUrl;

    imageLeftLeg.src = 'file:///C:/Users/elena/OneDrive/Desktop/crop-master/js/left_stick.png';
    console.log(imageLeftLeg.src)
    
    var reader = new FileReader();

    reader.onload = function(){
        console.log(this.result)
    }

    reader.toDataURL(imageLeftLeg.src, 1)
    


    





    // imageLeftLeg.src = imageLeftLegUrl;
    imageRightLeg.src = imageRightLegUrl;


    imageRightLeg.onload = function () {

        ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
        ctxPr.drawImage(canvasImgPath, sliceLeftX, sliceLeftY, sliceWidth, sliceHeight, startPoint, startPoint, sliceWidth, sliceHeight - (originalImgHeight / 25));

        ctxPr.drawImage(imageLeftLeg, sliceWidth * 0.2, sliceHeight - (originalImgHeight / 25), originalImgWidth / 20, originalImgHeight / 25);
        ctxPr.drawImage(imageRightLeg, sliceWidth - sliceWidth * 0.2, sliceHeight - (originalImgHeight / 25), originalImgWidth / 20, originalImgHeight / 25);

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


