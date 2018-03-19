var addNewImgBtn = document.getElementById('add__new--img');// button for upload new file
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasImgPath; // new img path for canvas
var startPoint = 0; // start canvas position
var retreat = 80; // retreat for crop frame



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


    ctx.drawImage(canvasImgPath, 0, 0);

    ctx.beginPath();
    ctx.setLineDash([10, 15]);
    // start
    ctx.moveTo(startPoint + retreat, startPoint + retreat);
    // ctx.lineTo(startPoint + retreat, startPoint + retreat);
    // ctx.fillRect(startPoint + retreat - 5, startPoint + retreat -5, 10, 10);
    // top
    ctx.lineTo(canvas.width - retreat, startPoint + retreat);
    // ctx.fillRect(canvas.width - retreat - 5, startPoint + retreat -5, 10, 10);
    //right
    ctx.lineTo(canvas.width - retreat, canvas.height - retreat);
    // ctx.fillRect(canvas.width - retreat - 5, canvas.height - retreat -5, 10, 10);
    // bottom
    ctx.lineTo(startPoint + retreat, canvas.height - retreat);
    // ctx.fillRect(startPoint +retreat - 5, canvas.height - retreat -5, 10, 10);
    //left
    ctx.lineTo(startPoint + retreat, startPoint + retreat);
    ctx.stroke();
    putLine(startPoint + retreat, canvas.width, canvas.height)



}


//function that change cursor whet it at the line
function putLine(startPoint, width, height) {

    canvas.addEventListener('mousemove', function (event) {

        if (event.offsetX > startPoint - 4 && event.offsetX < startPoint + 4 && event.offsetY > startPoint && event.offsetY < height) {
            canvas.style.cursor = 'e-resize';
            canvas.addEventListener('mousedown', moveLeftLine);
        } else if (event.offsetY > startPoint - 4 && event.offsetY < startPoint + 4 && event.offsetX > startPoint && event.offsetX < width) {
            canvas.style.cursor = 'n-resize';
        } else if (event.offsetX > width - 84 && event.offsetX < width - 76 && event.offsetY > startPoint && event.offsetY < height - 80) {
            canvas.style.cursor = 'w-resize';

        } else if (event.offsetY > height - 84 && event.offsetY < height - 76 && event.offsetX < width - 80 && event.offsetX > startPoint) {
            canvas.style.cursor = 's-resize';
        } else {
            canvas.style.cursor = 'default';
        }
    })
}


function moveLeftLine(event) {
    canvas.style.cursor = 'e-resize';
    canvas.onmousemove = function (event) {
        canvas.style.cursor = 'e-resize';
        if (event.offsetX > canvas.width - 200) {
            ctx.closePath()
        }
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.width);

            ctx.drawImage(canvasImgPath, 0, 0);
            ctx.beginPath();
            ctx.moveTo(startPoint + event.offsetX, startPoint + retreat);

            // ctx.lineTo(startPoint + retreat + event.offsetX, startPoint + retreat);
            // ctx.fillRect(startPoint + retreat - 5, startPoint + retreat -5, 10, 10);

            ctx.lineTo(canvas.width - retreat, startPoint + retreat);
            // ctx.fillRect(canvas.width - retreat - 5, startPoint + retreat -5, 10, 10);

            ctx.lineTo(canvas.width - retreat, canvas.height - retreat);
            // ctx.fillRect(canvas.width - retreat - 5, canvas.height - retreat -5, 10, 10);

            ctx.lineTo(startPoint + event.offsetX, canvas.height - retreat);
            // ctx.fillRect(startPoint +retreat - 5, canvas.height - retreat -5, 10, 10);

            ctx.lineTo(startPoint + event.offsetX, startPoint + retreat);
            ctx.stroke();
        }

    }

    canvas.onmouseup = function () {
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
    }
}

