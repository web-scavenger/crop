var addNewImgBtn = document.getElementById('add__new--img');// button for upload new file

var canvas = document.getElementById('canvas');
var canvasPreview = document.getElementById('canvas__preview');

var test_canvas = document.getElementById('test__canvas');

var ctx = canvas.getContext('2d');
var ctxPr = canvasPreview.getContext('2d'); 

var ctxTest = test_canvas.getContext('2d');
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

var leftPointX;
var leftPointY;
var rightPointX;
var rightPointY;
var rightBottomPointX;
var rightBottomPointY;
var leftBottomPointX;
var leftBottomPointY;

var sliceWidth;
var sliceHeight;
var sliceWidthTest;



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

    var retreat = canvasWidth * 0.05;

    leftBottomPointX = retreat;
    leftBottomPointY = retreat;

    leftPointX = retreat;
    leftPointY = retreat;

    rightPointX = retreat;
    rightPointY = retreat;

    rightBottomPointX = retreat;
    rightBottomPointY = retreat;




    ctx.drawImage(canvasImgPath, 0, 0, originalImgWidth, originalImgHeight);


    ctx.beginPath();


    // start

    ctx.fillStyle = '#0893d2';
    ctx.moveTo(leftPointX, leftPointY);

    // top
    ctx.lineTo(canvas.width - rightPointX, rightPointY);

    //right
    ctx.lineTo(canvas.width - rightBottomPointX, canvas.height - rightBottomPointY);

    // bottom
    ctx.lineTo(leftBottomPointX, canvas.height - leftBottomPointY);

    //left
    ctx.lineTo(leftPointX, leftPointY);



    ctx.setLineDash([7, 5]);
    ctx.fillStyle = '#0893d2';
    ctx.strokeStyle = '#0893d2';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.closePath();

    putLine();


    // console.log((canvasWidth - startPointX - startPointX) / 2)

    frameOutside();

    ctx.fillStyle = '#0893d2';
    ctx.fillRect(leftPointX - pointRect / 2, leftPointY - pointRect / 2, pointRect, pointRect);
    ctx.fillRect(canvasWidth - rightPointX - pointRect / 2, rightPointY - pointRect / 2, pointRect, pointRect);
    ctx.fillRect(canvasWidth - rightBottomPointX - pointRect / 2, canvasHeight - rightBottomPointY - pointRect / 2, pointRect, pointRect);
    ctx.fillRect(leftBottomPointX - pointRect / 2, canvasHeight - leftBottomPointY - pointRect / 2, pointRect, pointRect);



    compress_canvas_width = document.getElementById('canvas').offsetWidth;
    compress_canvas_height = document.getElementById('canvas').offsetHeight;


}



function putLine() {


    canvas.addEventListener('mousemove', function (event) {

        var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
        var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;

        if (eY > leftPointY - 10 && eY < leftPointY + 19 && eX > leftPointX - 10 && eX < leftPointX + 19) {

            canvas.style.cursor = 'nw-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveTopLeftLinePerspective, false);
            }
        } else if (eY > rightPointY - 10 && eY < rightPointY + 10 && eX > canvasWidth - rightPointX - 4 && eX < canvasWidth - rightPointX + 34) {

            canvas.style.cursor = 'sw-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveTopRightLinePerspective, false);
            }
        } else if (eX > canvasWidth - rightBottomPointX - 4 && eX < canvasWidth - rightBottomPointX + 32 && eY < canvasHeight - rightBottomPointY + 32 && eY > canvasHeight - rightBottomPointY - 6) {

            canvas.style.cursor = 'se-resize';
            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveRightBottomLinePerspective, false);
            }

        } else if (eX > leftBottomPointX - 10 && eX < leftBottomPointX + 20 && eY > canvasHeight - leftBottomPointY - 20 && eY < canvasHeight - leftBottomPointY + 20) {
            canvas.style.cursor = 'ne-resize';

            event.preventDefault();
            mouseDown = true;
            if (mouseDown) {
                canvas.addEventListener('mousedown', moveLeftBottomLinePerspective, false);
            }

        }
        //  else if (eX > leftPointX + 8 && eX < canvasWidth - rightPointX - 8 && eY > leftPointY + 8 && eY < canvasHeight - rightPointY - 8) {
        //     canvas.style.cursor = 'move';
        //     event.preventDefault();
        //     mouseDown = true;
        //     if (mouseDown) {
        //         canvas.addEventListener('mousedown', moveCutterFrame);
        //     }

        // }
        else {
            canvas.style.cursor = 'default';
            mouseDown = false;

            canvas.removeEventListener('mousedown', moveTopLeftLinePerspective);

            canvas.removeEventListener('mousedown', moveTopRightLinePerspective);

            canvas.removeEventListener('mousedown', moveRightBottomLinePerspective);

            canvas.removeEventListener('mousedown', moveLeftBottomLinePerspective);
            // canvas.removeEventListener('mousedown', moveCutterFrame);
        }
    })
}




function moveTopLeftLinePerspective(event) {

    perspectiveStartPointY = startPointY;

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

            ctx.lineTo(canvasWidth - rightPointX, rightPointY);

            ctx.lineTo(canvasWidth - rightBottomPointX, canvasHeight - rightBottomPointY);

            ctx.lineTo(leftBottomPointX, canvasHeight - leftBottomPointY);

            ctx.lineTo(eX, eY);


            ctx.stroke();
            frameOutside();
            ctx.fillStyle = '#0893d2';
            ctx.fillRect(eX - pointRect / 2, eY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - rightPointX - pointRect / 2, rightPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - rightBottomPointX - pointRect / 2, canvasHeight - rightBottomPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(leftBottomPointX - pointRect / 2, canvasHeight - leftBottomPointY - pointRect / 2, pointRect, pointRect);

            leftPointX = eX;
            leftPointY = eY;

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



function moveTopRightLinePerspective() {
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
            ctx.moveTo(leftPointX, leftPointY);
            // top
            ctx.lineTo(canvasWidth - rightPointX, rightPointY);

            //right
            ctx.lineTo(canvasWidth - rightBottomPointX, canvasHeight - rightBottomPointY);


            ctx.lineTo(leftBottomPointX, canvasHeight - leftBottomPointY);


            ctx.lineTo(leftPointX, leftPointY);

            ctx.stroke();
            frameOutside();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(leftPointX - pointRect / 2, leftPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - rightPointX - pointRect / 2, rightPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - rightBottomPointX - pointRect / 2, canvasHeight - rightBottomPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(leftBottomPointX - pointRect / 2, canvasHeight - leftBottomPointY - pointRect / 2, pointRect, pointRect);

            rightPointY = eY;
            rightPointX = canvasWidth - eX;

        }


    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveTopRightLinePerspective);

    }
}


function moveRightBottomLinePerspective() {
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
            ctx.moveTo(leftPointX, leftPointY);

            ctx.lineTo(canvasWidth - rightPointX, rightPointY);

            ctx.lineTo(canvasWidth - rightBottomPointX, canvasHeight - rightBottomPointY);

            ctx.lineTo(leftBottomPointX, canvasHeight - leftBottomPointY);

            ctx.lineTo(leftPointX, leftPointY);


            ctx.stroke();

            frameOutside();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(leftPointX - pointRect / 2, leftPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - rightPointX - pointRect / 2, rightPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - rightBottomPointX - pointRect / 2, canvasHeight - rightBottomPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(leftBottomPointX - pointRect / 2, canvasHeight - leftBottomPointY - pointRect / 2, pointRect, pointRect);

            rightBottomPointX = canvasWidth - eX;
            rightBottomPointY = canvasHeight - eY;

        }

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveRightBottomLinePerspective);

    }
}



function moveLeftBottomLinePerspective(event) {

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
            ctx.moveTo(leftPointX, leftPointY);

            ctx.lineTo(canvasWidth - rightPointX, rightPointY);

            ctx.lineTo(canvasWidth - rightBottomPointX, canvasHeight - rightBottomPointY);

            ctx.lineTo(leftBottomPointX, canvasHeight - leftBottomPointY);

            ctx.lineTo(leftPointX, leftPointY);

            ctx.stroke();
            frameOutside();

            ctx.fillStyle = '#0893d2';
            ctx.fillRect(leftPointX - pointRect / 2, leftPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - rightPointX - pointRect / 2, rightPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(canvasWidth - rightBottomPointX - pointRect / 2, canvasHeight - rightBottomPointY - pointRect / 2, pointRect, pointRect);
            ctx.fillRect(leftBottomPointX - pointRect / 2, canvasHeight - leftBottomPointY - pointRect / 2, pointRect, pointRect);

            leftBottomPointX = eX;
            leftBottomPointY = canvasHeight - eY;

        }

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        ctx.closePath();
        mouseDown = false;
        canvas.removeEventListener('mousedown', moveLeftBottomLinePerspective);

    }
}

// function moveCutterFrame() {
//     var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
//     var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
//     var startClickPointX = eX;
//     var startClickPointY = eY;

//     var counterStartPointX = 0;
//     var counterStartPointY = 0;
//     var counterEndPointX = 0;
//     var counterEndPointY = 0;
//     counterStartPointX = startPointX;
//     counterStartPointY = startPointY;
//     counterEndPointX = endPointX;
//     counterEndPointY = endPointY;
//     canvas.onmousemove = function (event) {
//         var eX = (originalImgWidth * (100 * event.offsetX) / compress_canvas_width) / 100;
//         var eY = (originalImgHeight * (100 * event.offsetY) / compress_canvas_height) / 100;
//         moveToX = eX - startClickPointX;
//         moveToY = eY - startClickPointY;

//         if (startPointX < 5 || startPointY < 5 || endPointX < 5 || endPointY < 5) {
//             ctx.closePath();

//         }
//         else {

//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(canvasImgPath, 0, 0, canvasWidth, canvasHeight);
//             ctx.beginPath();
//             var sliceLeftX = leftPointX;
//             var sliceLeftY = leftPointY;
//             var sliceWidth = canvasWidth - leftPointX - rightPointX;
//             var sliceHeight = canvasHeight - leftPointY - rightPointY;

//             ctx.rect(sliceLeftX, sliceLeftY, sliceWidth, sliceHeight);

//             ctx.stroke();
//             frameOutside();

//             ctx.fillStyle = '#0893d2';
//             ctx.fillRect(startPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
//             ctx.fillRect(canvasWidth - endPointX - pointRect / 2, startPointY - pointRect / 2, pointRect, pointRect);
//             ctx.fillRect(canvasWidth - endPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);
//             ctx.fillRect(startPointX - pointRect / 2, canvasHeight - endPointY - pointRect / 2, pointRect, pointRect);


//         }
//         startPointX = counterStartPointX + moveToX;
//         startPointY = counterStartPointY + moveToY;
//         endPointX = counterEndPointX - moveToX;
//         endPointY = counterEndPointY - moveToY;

//     }
//     canvas.onmouseup = function () {

//         canvas.style.cursor = 'default';
//         canvas.onmousemove = null;
//         ctx.closePath();
//         mouseDown = false;
//         canvas.removeEventListener('mousedown', moveCutterFrame);

//     }

// }



function cutImage() {
    document.querySelector('.preview__block').style.display = 'block';

    var coecifX = originalImgWidth / (canvasWidth);
    var coecifY = originalImgHeight / (canvasHeight);


    var sliceLeftX = ((originalImgWidth * (Math.floor(100 * startPointX) / canvasWidth)) / 100);
    var sliceLeftY = ((originalImgHeight * (Math.floor(100 * startPointY) / canvasHeight)) / 100);
    sliceWidth = originalImgWidth - sliceLeftX - (Math.floor(originalImgWidth * ((100 * endPointX) / canvasWidth) / 100));
    sliceHeight = originalImgHeight - sliceLeftY - (Math.floor(originalImgHeight * ((100 * endPointY) / canvasHeight) / 100));

    

    
    

    var b = Math.pow((leftBottomPointY -  rightPointY), 2);
    var g = Math.pow((canvasWidth -  leftBottomPointX -  rightBottomPointX), 2);
    var a = Math.sqrt(b + g);
    var d = (canvasHeight - leftPointY - leftBottomPointY);
    var c = (canvasHeight - rightPointY - rightBottomPointY)

  
    sliceWidthTest = a * (c / d);
 

    canvasPreview.width = sliceWidthTest;
    canvasPreview.height = sliceHeight + originalImgHeight / 25 + 30;
    canvasPreview.style.width = '100%';
    canvasPreview.style.height = 'auto';

    test_canvas.width = sliceWidthTest;
    test_canvas.height = sliceHeight;
    test_canvas.style.width = '100%';
    test_canvas.style.height = 'auto';
  

    //test code

    mapTriangle(ctxTest,
        leftPointX, leftPointY, canvasWidth - rightBottomPointX, canvasHeight - rightBottomPointY, leftBottomPointX, canvasHeight - leftBottomPointY,
        0, 0, sliceWidthTest, canvasPreview.height, 0, canvasPreview.height
    );

    // eliminate slight space between triangles
    ctxTest.translate(-1, 1);

    // unwarp the top-right triangle of the warped polygon
    mapTriangle(ctxTest,
        leftPointX, leftPointY, canvasWidth - rightPointX, rightPointY, canvasWidth - rightBottomPointX, canvasHeight - rightBottomPointY,
        0, 0, sliceWidthTest, 0, sliceWidthTest, canvasPreview.height
    );



}


function mapTriangle(ctx, p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p_0_x, p_0_y, p_1_x, p_1_y, p_2_x, p_2_y) {
    
    // break out the individual triangles x's & y's
    var x0 = p_0_x, y0 = p_0_y;
    var x1 = p_1_x, y1 = p_1_y;
    var x2 = p_2_x, y2 = p_2_y;
    var u0 = p0_x, v0 = p0_y;
    var u1 = p1_x, v1 = p1_y;
    var u2 = p2_x, v2 = p2_y;

    // save the unclipped & untransformed destination canvas
    ctx.save();

    // clip the destination canvas to the unwarped destination triangle
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();

    // Compute matrix transform
    var delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
    var delta_a = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
    var delta_b = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
    var delta_c = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
    var delta_d = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
    var delta_e = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
    var delta_f = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;

    // Draw the transformed image
    ctx.transform(
        delta_a / delta, delta_d / delta,
        delta_b / delta, delta_e / delta,
        delta_c / delta, delta_f / delta
    );

    // bottom legs
    var imageLeftLeg = new Image();
    var imageRightLeg = new Image();

    imageLeftLeg.src = 'left_stick.png';
    imageLeftLeg.crossOrigin = "Anonymous";

    imageRightLeg.src = 'right_stick.png';
    imageRightLeg.crossOrigin = "Anonymous";
    
    ctx.fillStyle = '#ffffff';

    ctx.drawImage(canvasImgPath, 0, 0 );
    
    var prDataUrl = test_canvas.toDataURL("image/jpeg");
    var previewDataImage = new Image();

    
    previewDataImage.onload = function () {
        ctxPr.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
        
        ctxPr.fillStyle = '#ffffff';
        ctxPr.fillRect(0, 0, canvasPreview.width, canvasPreview.height);
        ctxPr.drawImage(previewDataImage, startPoint + 20, startPoint + 20, sliceWidthTest - 40, sliceHeight - 30);

        ctxPr.drawImage(imageLeftLeg, sliceWidthTest * 0.2, sliceHeight - 10, sliceWidthTest / 20, originalImgHeight / 25);
        ctxPr.drawImage(imageRightLeg, sliceWidthTest - sliceWidthTest * 0.25, sliceHeight - 10, sliceWidthTest / 20, originalImgHeight / 25);

        var prUrl = canvasPreview.toDataURL("image/jpeg");

        document.querySelector('.download__btn--block').style.display = 'block';
        document.getElementById('prev__cut__image__url').setAttribute('href', prUrl);
        document.getElementById('prev__cut__image__url').download = imageName;

    }
    previewDataImage.src = prDataUrl;
    ctx.restore();
}


function frameOutside() {
    // ctx.restore();
    ctx.fillStyle = "#22222285";
    // ctx.strokeStyle = 'none';

    // top
    ctx.beginPath();

    ctx.moveTo(startPoint, startPoint);
    ctx.lineTo(canvasWidth, startPoint);
    ctx.lineTo(canvasWidth, rightPointY);
    ctx.lineTo(canvasWidth - rightPointX, rightPointY);
    ctx.lineTo(canvasWidth - rightPointX, rightPointY);
    ctx.lineTo(leftPointX, leftPointY);
    ctx.lineTo(leftPointX, leftPointY)
    ctx.lineTo(startPoint, leftPointY)
    ctx.lineTo(startPoint, startPoint)

    ctx.fill()

    // left

    ctx.beginPath();

    ctx.moveTo(startPoint, leftPointY);
    ctx.lineTo(leftPointX, leftPointY);
    ctx.lineTo(leftBottomPointX, canvasHeight - leftBottomPointY);
    ctx.lineTo(leftBottomPointX, canvasHeight);
    ctx.lineTo(startPoint, canvasHeight);
    ctx.lineTo(startPoint, leftPointY);


    ctx.fill();

    //bottom

    ctx.beginPath();

    ctx.moveTo(leftBottomPointX, canvasHeight);
    ctx.lineTo(leftBottomPointX, canvasHeight - leftBottomPointY);
    ctx.lineTo(canvasWidth - rightBottomPointX, canvasHeight - rightBottomPointY);
    ctx.lineTo(canvasWidth, canvasHeight - rightBottomPointY);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(leftBottomPointX, canvasHeight);


    ctx.fill();

    //right

    ctx.beginPath();

    ctx.moveTo(canvasWidth - rightBottomPointX, canvasHeight - rightBottomPointY);
    ctx.lineTo(canvasWidth, canvasHeight - rightBottomPointY);
    ctx.lineTo(canvasWidth, rightPointY);
    ctx.lineTo(canvasWidth - rightPointX, rightPointY);
    ctx.lineTo(canvasWidth - rightBottomPointX, canvasHeight - rightBottomPointY)


    ctx.fill()




}


