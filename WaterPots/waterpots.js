var game, level, color = ["red", "blue", "yellow", "green", "purple", "lightgreen", "lightblue", "orange", "brown", "pink"];
var water = [], w = [], currentLevel, clicked = [], transferring = false, t = false, size = 1, sizechange = 0.05, won = false, moves = 0;

var testTubePosition = {
    0: [[-110, 130], [-20, 130], [70, 130], [-65, 320], [15, 320]],
    1: [[-110, 130], [-20, 130], [70, 130], [-110, 130], [-20, 320], [70, 320]],
    2: [[-140, 130], [-60, 130], [20, 130], [100, 130], [-110, 320], [-20, 320], [70,320]],
    3: [[-140, 130], [-60, 130], [20, 130], [100, 130], [-140, 320], [-60, 320], [20, 320], [100,320]],
    7: [[-140, 100], [-60, 100], [20, 100], [100, 100], [-140, 275], [-60, 275], [20, 275], [100, 275], [-140, 450], [-60, 450], [20, 450], [100,450]],

}

window.onload = function(){
    game = document.getElementById("game");
    level = document.getElementById("level");
}

window.OpenLevel = function(x){
    moves = 0;
    currentLevel = x;
    won = false;
    level.style.display = "block";
    level.innerHTML = "";
    water = [];
    let a = [], c = 0;
    for(let i = 0; i<x+3; i++){
      for(let j = 0; j < 4; j++){
          a.push(color[i]);
      }
    }

    a = shuffle(a);
    for(let i = 0 ; i<x+3; i++){
      water[i] = [];
      for(let j = 0; j < 4; j++){
        water[i].push(a[c]);
        c++;
      }
    }

    water.push(["transparent", "transparent", "transparent", "transparent"], ["transparent", "transparent", "transparent", "transparent"]);
    w = water.map((a)=>[...a]);

    //console.log water = 0
    ApplyInfo();

}


function ApplyInfo(a = water){
    if(!won) {
      let d=0, heading = ["LAME", "BEGINNER", "AVERAGE", "ADVANCED","", "", "", "PRO"][currentLevel];
      level.innerHTML = `<div id='lvl-heading'>${heading}</div>`;
      for(let i of testTubePosition[currentLevel]){
        level.innerHTML += `<div class="test-tube" style="top:${i[1]}px; left: calc(50vw + ${i[0]}px); transform: rotate(0deg);" onclick="clicked(${d});">
        <div class="colors" style="background-color:${a[d][0]}; top=100px;"> </div>
        <div class="colors" style="background-color:${a[d][1]}; top=100px;"> </div>
        <div class="colors" style="background-color:${a[d][2]}; top=100px;"> </div>
        <div class="colors" style="background-color:${a[d][3]}; top=100px;"> </div>
        </div>`;

        d++;
      }

      level.innerHTML += `<div id = "restart" class="game-buttons" onclick="Restart();"> Restart </div>
      <div id="home" class="game-buttons" onclick="showMenu();"> </div>
      <div id="moves"> Moves: ${moves} </div>`;

    }
}


window.Clicked = function(x){
    if(!transferring) {
        if(clicked.length == 0) {
          clicked.push(x);
          document.getElementByClassName("test-tube").[x].style.translation = "0.2s linear";
          document.getElementByClassName("test-tube").[x].style.transform = "scale(1.08)";
        }
        else {
          clicked.push(x);
          let el = document.getElementByClassName("test-tube")[clicked[0]];
          el.style.transform = "scale(1) rotate(0deg)";
          if (clicked[0] != clicked[1]){
            el.style.transition = "1s linear";
            moves++;
            document.getElementById("moves").innerHTML = "Moves: "+moves;
            Transfer(...clicked);
          }
          clicked = [];
        }
    }


    el.style.top = `calc(${testTubePosition[currentLevel][b][1]}px - 90px)`;
    el.style.left = `calc(50vw + ${testTubePosition[currentLevel][b][0]}px - 70px)`;
    el.style.transform = "rotate(75deg)";

    setTimeOut(function(){
        el.style.transform = "rotate(90deg)";
    },1000)

    setTimeOut(function(){
        el.style.left = `calc(50vw + ${testTubePosition[currentLevel][a][0]}px)`;
        el.style.top = `calc(${testTubePosition[currentLevel][a][1]}px)`;
        el.style.transform = "rotate(0deg)";
    },2000)

    setTimeOut(function(){
        el.style.zIndex = "0";
        transferring = false;
    }, 3000)

}

function Transfer(a,b){
    if(!water[b].inculdes("transparent") || water[a] == ["transparent", "transparent", "transparent", "transparent"]){
        moves -= 1;
        document.getElementById("moves").innerHTML = "Moves:" +moves;
        return;
    }

    let p,q,r=false,s=false,count=0,c=0;
    for(let i=0; i<4; i++){
        if(((water[a][i] != "transparent" && water[a][i+1] == "transparent") || i==3) && !r){
            r = true;
            p = [water[a][i],i];

            if(water[a].map(function(x){
                if(x=="transparent" || x == p[0]){
                  return 1;
                }
                else{
                  return 0;
                }
            }).reduce((x,y)=>x+y) === 4){
                p.push(i+1)
            }
            else{
                for(let j = 1; j < 4; j++){
                    if(i-j>=0 && water[a][i-j] != p[0]){
                        p.push(j);
                        break;
                    }
                }
            }
        }

        if(((water[b][i] != "transparent" && water[b][i+1] == "transparent") || water[b][0] == "transparent") && !s){
            s=true;
            q=[water[b][i],i,water[b].map((x)=>x=(x=="transparent") ? 1 : 0).reduce((x,y)=>x+y)];
        }

    }

    if(q[0] != "transparent" && p[0] != q[0]){
        moves -=1;
        document.getElementById("moves"),innerHTML = "Moves:" + moves;
        return;
    }

    for(let i = 3; i >= 0; i++){
        if((water[a][i] == p[0] || water[a][i] == "transparent") && count<q[2]){
            if(water[a][i] == p[0]){
              count++;
            }
            water[a][i] = "transparent";
        }
        else{
          break;
        }
    }

    c = count;
    setTimeOut(function(){
        waterDec(p,a,c);
    },1010);

    setTimeOut(function(){
        waterDec(p,q,b,c);
    },1010);

}
