var addNewImgBtn = document.getElementById('add__new--img');// button for upload new file

var canvas = document.getElementById('canvas');
var canvasPreview = document.getElementById('canvas__preview');

var ctx = canvas.getContext('2d');
var ctxPr = canvasPreview.getContext('2d');
var cutButton = document.getElementById('preview__btn');

document.querySelector('.back__btn').addEventListener('click', function(){
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
var timeMoveToX = 0;

var originalImgWidth;
var originalImgHeight;

var windowWidth = 0;
var windowHeight = 0;

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
    ctx.fillRect(startPointX, startPointY, 10, 10);
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

    compress_canvas_width = document.getElementById('canvas').offsetWidth;
    compress_canvas_height = document.getElementById('canvas').offsetHeight;


}



function putLine() {


    canvas.addEventListener('mousemove', function (event) {

        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;


        if (eX > startPointX - 6 && eX < startPointX + 6 && eY > startPointY + 6 && eY < canvasHeight - endPointY - 6) {


            canvas.style.cursor = 'e-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveLeftLine, false);
            }

        }
        else if (eY > startPointY - 2 && eY < startPointY + 2 && eX > startPointX - 4 && eX < startPointX + 4) {

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
        } else if (eY > startPointY - 4 && eY < startPointY + 4 && eX > canvasWidth - endPointX - 4 && eX < canvasWidth - endPointX + 4) {

            canvas.style.cursor = 'sw-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveTopRightLine, false);
            }
        } else if (eX > canvasWidth - endPointX - 4 && eX < canvasWidth - endPointX + 4 && eY > startPointY + 6 && eY < canvasHeight - endPointY - 6) {
            canvas.style.cursor = 'w-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveRightLine, false);
            }

        } else if (eX > canvasWidth - endPointX - 4 && eX < canvasWidth - endPointX + 4 && eY < canvasHeight - endPointY + 6 && eY > canvasHeight - endPointY - 6) {
            
            canvas.style.cursor = 'se-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveRightBottomLine, false);
            }

        } else if (eY > canvasHeight - endPointY - 2  && eY < canvasHeight - endPointY + 2 && eX < canvasWidth - endPointX - 6 && eX > startPointX) {
            canvas.style.cursor = 's-resize';
            console.log(endPointY);
            console.log(canvasHeight);
            console.log(eY);
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveBottomLine, false);
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
            canvas.removeEventListener('mousedown', moveBottomLine);
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


            endPointX = canvasWidth - eX;
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

    ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
    ctxPr.drawImage(canvasImgPath, sliceLeftX, sliceLeftY, sliceWidth, sliceHeight, startPoint, startPoint, sliceWidth, sliceHeight);
    var prUrl = canvasPreview.toDataURL();
    document.querySelector('.btn').style.display = 'block';
    document.querySelector('.download__btn--block').style.display = 'block';
    document.getElementById('cut__image__url').setAttribute('href', prUrl);
    document.getElementById('prev__cut__image__url').setAttribute('href', prUrl);
    
    console.log(canvasWidth, canvasHeight)
    // if (window.innerHeight > window.innerWidth) {
        canvasPreview.width = compress_canvas_width;
        canvasPreview.height = compress_canvas_height;
    // }
    // else {
    //     canvasPreview.width = 500;
    //     canvasPreview.height = 300;
    // }

    var imageRightLeg = new Image();
    imageRightLeg.src = 'right_stick.png';
    imageRightLeg. crossOrigin = "anonymous";
    var imageLeftLeg = new Image();
    imageLeftLeg.src = 'left_stick.png';
    imageLeftLeg.crossOrigin  = "anonymous";

    imageRightLeg.onload = function () {
        ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
        ctxPr.drawImage(canvasImgPath, sliceLeftX, sliceLeftY, sliceWidth, sliceHeight, startPoint, startPoint, canvasPreview.width, canvasPreview.height - 20);
        
        ctxPr.drawImage(imageRightLeg, compress_canvas_width - compress_canvas_width * 0.2, compress_canvas_height-25);
        
    }
    imageLeftLeg.onload = function () {
        ctxPr.drawImage(imageLeftLeg, compress_canvas_width * 0.2, compress_canvas_height-25);
        prUrl = canvasPreview.toDataURL();
        console.log(prUrl);
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


