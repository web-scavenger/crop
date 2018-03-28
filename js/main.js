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

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var mouseDown = false;
var moveToY;
var moveToX;

var originalImgWidth;
var originalImgHeight;


var compress_canvas_width;
var compress_canvas_height;


cutButton.addEventListener('click', cutImage);

// window.addEventListener('resize', function(){
//     canvasWidth = this.innerWidth;
//     canvasHeight = this.innerHeight;
//     console.log( canvasHeight, canvasWidth)
//     frameCutter(canvasImgPath, canvasHeight, canvasWidth);
// })


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

    canvas.width = originalImgWidth;
    canvas.height = originalImgHeight;

    canvas.style.width = '100%';
    canvas.style.height = 'auto';



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
    // ctx.restore();
    ctx.setLineDash([7, 5]);
    ctx.fillStyle = '#0893d2';
    ctx.strokeStyle = '#0893d2';
    ctx.lineWidth = 7;
    ctx.stroke();


    putLine();

    console.log((canvasWidth - startPointX - startPointX) / 2)

    ctx.fillStyle = '#0893d2';
    ctx.fillRect(startPointX - 20, startPointY - 20, 40, 40);
    ctx.fillRect(canvas.width - endPointY - 20, startPointY - 20, 40, 40);
    ctx.fillRect(canvas.width - endPointX - 20, canvas.height - endPointY - 20, 40, 40);
    ctx.fillRect(startPointX - 20, canvas.height - endPointX - 20, 40, 40);

    ctx.fillRect((canvasWidth - startPointX - startPointX) / 2, startPointY - 10, 40, 20);
    
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

        }  else if (eX > startPointX + 8 && eX < canvasWidth - endPointX - 8 && eY > startPointY + 8 && eY < canvasHeight - endPointY - 8) {
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
            ctx.fillRect(eX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, canvasHeight - endPointY - 20, 40, 40);
            ctx.fillRect(eX - 20, canvasHeight - endPointY - 20, 40, 40);

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
            ctx.fillRect(eX - 20, eY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, eY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, canvasHeight - endPointY - 20, 40, 40);
            ctx.fillRect(eX - 20, canvasHeight - endPointY - 20, 40, 40);

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
            // addOverlay();
            ctx.stroke();
            // putLine();
            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, canvasHeight - endPointY - 20, 40, 40);
            ctx.fillRect(startPointX - 20, canvasHeight - endPointY - 20, 40, 40);

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

            // bottom
            ctx.lineTo(startPointX, canvasHeight - endPointY);

            //left
            ctx.lineTo(startPointX, startPointY);
            frameOutside();
            // addOverlay();
            ctx.stroke();
            // putLine();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, canvasHeight - endPointY - 20, 40, 40);
            ctx.fillRect(startPointX - 20, canvasHeight - endPointY - 20, 40, 40);

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
            ctx.fillRect(startPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(eX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(eX - 20, canvasHeight - endPointY - 20, 40, 40);
            ctx.fillRect(startPointX - 20, canvasHeight - endPointY - 20, 40, 40);

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

            // start

            // top
            ctx.moveTo(startPointX, startPointY);

            ctx.lineTo(eX, startPointY);

            ctx.lineTo(eX, eY);


            ctx.lineTo(startPointX, eY);


            ctx.lineTo(startPointX, startPointY);

            frameOutside();
            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(eX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(eX - 20, eY - 20, 40, 40);
            ctx.fillRect(startPointX - 20, eY - 20, 40, 40);

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

            // start

            // top
            ctx.moveTo(startPointX, startPointY);

            ctx.lineTo(canvasWidth - endPointX, startPointY);

            ctx.lineTo(canvasWidth - endPointX, eY);


            ctx.lineTo(startPointX, eY);


            ctx.lineTo(startPointX, startPointY);

            frameOutside();
            ctx.stroke();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(startPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, eY - 20, 40, 40);
            ctx.fillRect(startPointX - 20, eY - 20, 40, 40);

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
            ctx.fillRect(eX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, canvasHeight - endPointY - 20, 40, 40);
            ctx.fillRect(eX - 20, canvasHeight - endPointY - 20, 40, 40);

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
            ctx.fillRect(startPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, startPointY - 20, 40, 40);
            ctx.fillRect(canvasWidth - endPointX - 20, canvasHeight - endPointY - 20, 40, 40);
            ctx.fillRect(startPointX - 20, canvasHeight - endPointY - 20, 40, 40);


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

    ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
    ctxPr.drawImage(canvasImgPath, sliceLeftX, sliceLeftY, sliceWidth, sliceHeight, startPoint, startPoint, sliceWidth, sliceHeight);
    var prUrl = canvasPreview.toDataURL();
    document.querySelector('.download__btn--block').style.display = 'block';
        document.getElementById('prev__cut__image__url').setAttribute('href', prUrl);
    

    

    // canvasPreview.width = compress_canvas_width;
    // canvasPreview.height = compress_canvas_height;

    var imageRightLegUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAVCAYAAABVAo5cAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFwmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wMy0yN1QxMDo1MTo1MCswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wMy0yN1QxMDo1MTo1MCswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDMtMjdUMTA6NTE6NTArMDM6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MThkYmZjNTktODlhNC0wZTRjLTljOWItMmI3M2FiOTE1NjY5IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NGU5NjYwY2QtNjBlNS00MDQyLTg4NmYtZGFh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';
    var imageLeftLegUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAVCAYAAADB5CeuAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFwmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wMy0yN1QxMDo1NjoyOCswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wMy0yN1QxMDo1NjoyOCswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDMtMjdUMTA6NTY6MjgrMDM6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZTQ2ODZhNjAtNjgwYy1iMzQzLTg1ODktODQzYzM3MzYxODMxIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6N2YzYTlmNzYtYWRlZC03YzQ1LTgzNzQtYjdh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';


    var imageLeftLeg = new Image();
    var imageRightLeg = new Image()
    imageLeftLeg.src = imageLeftLegUrl;
    imageRightLeg.src = imageRightLegUrl;

   


    imageLeftLeg.onload = function () {
        ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
        ctxPr.drawImage(canvasImgPath, sliceLeftX, sliceLeftY, sliceWidth, sliceHeight, startPoint, startPoint, sliceWidth, sliceHeight - 20);

        ctxPr.drawImage(imageRightLeg, sliceWidth * 0.2, sliceHeight - 20);
        ctxPr.drawImage(imageLeftLeg, sliceWidth - sliceWidth * 0.2, sliceHeight - 20);
        var prUrl = canvasPreview.toDataURL();

        // document.querySelector('.btn').style.display = 'block';
        document.querySelector('.download__btn--block').style.display = 'block';
        document.getElementById('prev__cut__image__url').setAttribute('href', prUrl);
        // document.getElementById('cut__image__url').setAttribute('href', prUrl);
        // console.log(prUrl)
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


