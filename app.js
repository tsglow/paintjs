/*
주의
canvas 사이즈는 두 가지다. 웹페이지에서 보여지는 겉보기 사이즈와, canvas내부의 pixel사이즈. 
ctx 는 그 pixel들을 칠해서 라인을 만든다. 
css에서 설정하면 겉보기 사이즈로만 결정되기 때문에 
태그에 직접 width height 값으로 써주거나, 스크립트에 넣어야 한다.
*/


/*
canvas 와 ctx 기본 설정
*/
const canvas = document.getElementById("jsCanvas");
    canvas.width = 800;
    canvas.height = 600;
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);        
const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.lineWidth = 2.5;
    ctx.fillRect(0, 0, 800, 600);




/*
기본 상수들
color : 색상 파레트
strokeRage : 붓 굻기
canvasFillColor : 캔버스 배경색 -> fillcolor로 바꿀것
inpuText : text입력
*/
const colors = document.getElementsByClassName("controls_color");
    Array.from(colors).forEach(color => color.addEventListener("click", changeColor));
const ControlBtns = document.getElementById("ctrlBtns");
const strokeRange = document.getElementById("jsRange");
    strokeRange.addEventListener("input", changeStrokeRange); // input 대신 mouseup도 가능
const canvasFillColor = document.getElementById("jsCanvasFill");
    canvasFillColor.addEventListener("click", changeCanvasColor);
const inputTextBtn = document.getElementById("jsText");
    inputTextBtn.addEventListener("click", inputTextForm);

/*
기본 변수들. 이후 false 와 true로 계속 바뀌어가며 사용됨
painting : 붓을 그리기 상태로 하느냐 아니냐
fillcolor  : 파레트를 클릭 했을 때, 그 색상으로 fill 할것인지 아닌지
wirtetext : text버튼을 클릭 했을 때, 그리기 기능을 off 하기 위함
*/
let painting = false;
let fillColor = false;
let writeText = false;




/*
stopPainting(), StartPainting()
호출되면 painting 값을 바꾸는 함수들
*/
function stopPainting(){
    painting = false;
}
function startPainting(){
    painting = true;
}


/*
onMouseMove() 
mousemove 이벤트를 받아와서,
Part A : 마우스 커서의 x, y 좌표를 상수 x, y 화 한다
Part B : painting 이 false 일 땐 마우스 커서 beginpath를 반복하되 계속 커서의 x, y 좌표로 시작점을 바꾼다.
Part C : painting 이 true 이고 writetext 가 false이면 Part B에서 만든 시작점부터 커서를 따라 계속 path를 그린다.
*/
function onMouseMove(event){
    const x = event.offsetX;  // Part A
    const y = event.offsetY;
    if(!painting){  // Part B
        //console.log("creating path in ", x, y); path 가 생성되는걸 보려면 주석 해제
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if(!writeText) { // Part C
        ctx.lineTo(x, y);
        ctx.stroke();        
    }
}

/*
라인취소 기능용 함수
canvas 에 자체적으로 do undo 기능이 있음 찾아서 넣을 것
}
*/


/*
changeColor()
Part A : 색깔 버튼을 클릭 하면 해당 버튼의 backgroundColor 를 newcolor로 할당
Part B : ctx.strokeStyle의 색을 newcolor로
Part C : fill 기능용 추가 부분. 만약 fillcolor 가 true면, 색버튼을 클릭 했을 때 fillstyle 도 newcolor로 변경하고 캔버스를 fillRect한다
        canvasBg의 innner text를 fill 로 되돌리고 다시 fillcolor을 false로 . 
*/

function changeColor(event){
    const newcolor = event.target.style.backgroundColor; //Part A
    ctx.strokeStyle = newcolor;  //Part B
    if (fillColor === true)  {  //Part C
        ctx.fillStyle = newcolor;
        ctx.fillRect(0, 0, 800, 600);
        canvasFillColor.innerText = "fill";
        fillColor = false;

    }
}

/*
changeStrokeRange()
Part A : rage 바에 input 이벤트가 발생하면 그때의 value를 받아와서 newRange로 한다
Part B : 붓의 굵기를 newRange값으로 바꾼다
*/
function changeStrokeRange(event){
    const newRange = event.target.value; 
    ctx.lineWidth = newRange
}


/*
changeCanvasColor()
Part A : Fill 버튼을 클릭하면 fillColor 을 true로 만들고 innterText를 "select the color to fill"로 한다
*/

function changeCanvasColor(event){    
    fillColor = true;
    canvasFillColor.innerText = "select the color to fill";
}


function textToCanvas(event){
    event.preventDefault();    
    // ctx.fillText(currentText, 0, 0)    
}


/* inputTextsForm()
Part A : writeText 값을 true로 변경하고 text 버튼을 form 으로 바꾼다.
Part B : 바꾼 폼에 input 박스를 넣는다
*/

function inputTextForm(event){
    writeText = true;      // Part A
    const replaceTextBtn = event.target; 
    const inputForm = document.createElement("form");
        inputForm.id = "tempForm";        
    ControlBtns.replaceChild(inputForm, replaceTextBtn);
    const temForm = document.getElementById("tempForm");
    const inputBox = document.createElement("input"); // Part B
        inputBox.type = "text";
    temForm.appendChild(inputBox); 
    temForm.addEventListener("submit", textToCanvas);
        const temInput = temForm.querySelector("input");
     
}    
  



/*
text 입력을 가능하게 하려면
1. text버튼을 누르면 text 버튼이 form input으로, 커서 형태는 I 로 변경, painting은 false, writeText는 true 
2. form input에는 "숫자(폰트사이즈), 내용"으로 입력
3. 인풋창에 text를 적고(text상수가 됨) 엔터를 누른 다음 클릭하면, 클릭한 위치에  ctx.filltext (텍스트 상수, 좌표상수)실행
*/