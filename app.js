/*
canvas 사이즈는 두 가지다. 웹페이지에서 보여지는 겉보기 사이즈와, canvas내부의 pixel사이즈. 
ctx 는 그 pixel들을 칠해서 라인을 만든다. 
css에서 설정하면 겉보기 사이즈로만 결정되기 때문에 
태그에 직접 width height 값으로 써주거나, 스크립트에 넣어야 한다.

*/
const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("controls_color");
const strokeRange = document.querySelector("#jsRange");
const changeCanvasBg = document.getElementById("jsCanvasBg");
const inputText = document.getElementById("jsText")


canvas.width = 800;
canvas.height = 600;

ctx.strokeStyle = "black";
ctx.fillStyle = "black"
ctx.lineWidth = 2.5;


let painting = false;
let fillcolor = false;
let writeText = false;

function stopPainting(){
    painting = false;

}

function startPainting(){
    painting = true
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting){
        // console.log("creating path in ", x, y); path 가 생성되는걸 보려면 주석 해제
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if(!writeText) { // text 입력모드인지 아닌지 체크
        ctx.lineTo(x, y);
        ctx.stroke();        
        /* ctrl+z로 라인 취소하는 기능 : newestLine 상수를 부여하고, 다시 keypress이벤트를 감지하게 하고, 다른 함수로 방금 그려진 라인을 삭제
        const newestLine = ctx.stroke()
        newestLine.addEventListener(onkeypress)
        */
    }
}

/*
라인취소 기능용 함수
function cancelNewestLine(event){
}
*/


function onMouseDown(event){
    painting = true;
}

function changeColor(event){
    const newcolor = event.target.style.backgroundColor;
    ctx.strokeStyle = newcolor; 
    if (fillcolor === true)  {
        canvas.style.backgroundColor = newcolor;
        changeCanvasBg.innerText = "canvas color";
        fillcolor = false;

    }
}

function changeStrokeRange(event){
    const newRange = event.target.value; 
    ctx.lineWidth = newRange
}

function changeCanvasColor(event){    
    fillcolor = true;
    changeCanvasBg.innerText = "select canvas color"
    
}


function inputTextToCanvas(event){
    writeText = true;
        
}    
    


if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);    
}

if(strokeRange){
    strokeRange.addEventListener("mouseup", changeStrokeRange); // 니콜라스는 여기에 mouseup 대신 input을 씀
}

if(changeCanvasBg){
    changeCanvasBg.addEventListener("click", changeCanvasColor);
}

if(inputText){
    inputText.addEventListener("click", inputTextToCanvas);
}

Array.from(colors).forEach(color => color.addEventListener("click", changeColor));


/*
text 입력을 가능하게 하려면
1. text버튼을 누르면 커서가 바뀌고, painting 이 중단됨(writeText true)
2. text를 쓸 위치를 누르면 input 창이 열림 (좌표를 상수로 지정)
3. 인풋창에 text를 적고(text상수가 됨) 엔터를 누르면 ctx.filltext (텍스트 상수, 좌표상수)실행
*/