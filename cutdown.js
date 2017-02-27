/**
 * Created by hewei on 2017/2/22.
 */
var WINDOW_WIDTH = 768;
var WINDOW_HEIGHT = 576;
var RADIUS = 6;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 7;
const endTime = new Date(2017,1,27,18,0,0);//const 只读常量，月份从0-11
var curShowTimeSeconds = 0;
var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];



window.onload = function () {
    WINDOW_WIDTH = document.documentElement.clientWidth-20;
    WINDOW_HEIGHT = document.documentElement.clientHeight-20;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;
    MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurShowTimeSeconds();
    setInterval(function () {
        render(context);
        update();
    },50);

};
function getCurShowTimeSeconds() {
    //倒计时
    // var curTime = new Date();
    // var ret = endTime.getTime()-curTime.getTime();
    // ret = Math.round(ret/1000);//返回秒数
    // return ret>=0?ret:0;
    //時鐘
    var curTime = new Date();
    var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();

    return ret;
}
function update(){
    var nextShowTimeSeconds = getCurShowTimeSeconds();
    var nextHours = parseInt(nextShowTimeSeconds/3600);
    var nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60);
    var nextSeconds = parseInt(nextShowTimeSeconds%60);

    var curHours = parseInt(curShowTimeSeconds/3600);
    var curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60);
    var curSeconds = parseInt(curShowTimeSeconds%60);
    if(nextSeconds!=curSeconds){
        if(parseInt(curHours/10)!=parseInt(nextHours/10)){
            addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
        }
        if(parseInt(curHours%10)!=parseInt(nextHours%10)){
            addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
        }
        if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
            addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
        }
        if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
            addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
        }
        if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
            addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
        }
        if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
            addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updataBalls();
}
function updataBalls(){
    for(var i=0;i<balls.length;i++){
        balls[i].x +=balls[i].vx;
        balls[i].y +=balls[i].vy;
        balls[i].vy +=balls[i].g;
        if(balls[i].y>=WINDOW_HEIGHT-RADIUS){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = -balls[i].vy*0.75;
        }
    }
    //性能优化，超出画布的小球去掉，避免小球溢出
    var cnt = 0;
    for(var i=0;i<balls.length;i++){
        if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<WINDOW_WIDTH){
            balls[cnt++]=balls[i];
        }
    }
    while (balls.length>Math.min(300,cnt)){
        balls.pop();
    }
}
function addBalls(x,y,num) {
    for(var i=0;i<digit[num].length;i++)
        for(var j=0;j<digit[num][i].length;j++)
            if(digit[num][i][j]==1){
                var  aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
                    vy:-5,
                    color:colors[Math.floor(Math.random()*colors.length)]
                };

                balls.push(aBall);

            }

}
function render(cxt){
    //console.log(balls.length);
    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
    var hours = parseInt(curShowTimeSeconds/3600);
    var minutes = parseInt((curShowTimeSeconds-hours*3600)/60);
    var seconds = parseInt(curShowTimeSeconds%60);

    var colonDis = 0;
    var number = [hours/10,hours%10,minutes/10,minutes%10,seconds/10,seconds%10];
    for(var i=0;i<number.length;i++){
        randerDigit(MARGIN_LEFT+i*(15*(RADIUS+1))+colonDis,MARGIN_TOP,parseInt(number[i]),cxt);
        if(i!=number.length-1&&i%2!=0){
            randerDigit(MARGIN_LEFT+(i+1)*(15*(RADIUS+1))+colonDis,MARGIN_TOP,10,cxt);//显示：号
            colonDis+=(9*(RADIUS+1));
        }
    }
    for(var i=0;i<balls.length;i++) {
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
        cxt.closePath();
        cxt.fill();
    }

}
function randerDigit(x,y,num,cxt) {
    cxt.fillStyle = "rgb(0,102,153)";
    for(var i=0;i<digit[num].length;i++)
        for(var j=0;j<digit[num][i].length;j++)
            if(digit[num][i][j]==1){
                cxt.beginPath();
                //圆形像素
                cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
                //矩形像素
                // cxt.moveTo(x+j*2*(RADIUS+1)+1,y+i*2*(RADIUS+1)+1);
                // cxt.lineTo(x+j*2*(RADIUS+1)+1+2*RADIUS,y+i*2*(RADIUS+1)+1);
                // cxt.lineTo(x+j*2*(RADIUS+1)+1+2*RADIUS,y+i*2*(RADIUS+1)+1+2*RADIUS);
                // cxt.lineTo(x+j*2*(RADIUS+1)+1,y+i*2*(RADIUS+1)+1+2*RADIUS);
                cxt.closePath();
                cxt.fill();
            }

}