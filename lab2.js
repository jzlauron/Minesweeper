var cellArr;
var max_row = 0;
var max_col = 0;
var num_mines = 0;
var startTimer = false;
var timerID;
var timerVal;


function Cell(){
    this.row=0;
    this.column=0;
    this.display=false;
    this.mine-false;
    this.count=0;
}

Cell.prototype.Show = Show;
Cell.prototype.Bind = Bind;

function Show(){

    let ID =this.row + ","+this.column;
    if(this.display==false)
        return 1;

    let sCell=document.getElementById(ID);
    sCell.style.backgroundColor="White";


    if(this.mine==true)
     {
        if(screen.width > 800)
        sCell.innerHTML = '<img src="images/bomb.png" width="28px" height="28px">';
        else
        sCell.innerHTML = '<img src="images/bomb.png" width="8px" height="8px">';
     }

     else if(this.count != 0)
     {
        sCell.innerHTML = this.count;
     }
     return 0;
    }


function Bind(){

    let column = this.column;
    let row = this.row;
        
    document.getElementById(this.row + ',' + this.column).onclick = function()
    {       
        if(document.getElementById('text').innerHTML == "You Lost, Restart?" )
            return;

        if(document.getElementById('text').innerHTML == "You Won! Restart?"  )
            return;

        if(document.getElementById('med').style.display == 'inline-block')
            return;

        if (!startTimer) {
            timerID = window.setInterval(TimerTick, 10);
            startTimer = true;
            timerVal = 0;
            }   

        if(event.shiftKey)
        {
            if(cellArr[column][row].mine != true)
                Result(0);
            cellArr[column][row].display = true;
            ShowGrid();
            return;
        }
        Check(column,row);
        ShowGrid();

        if(cellArr[column][row].mine == true)
            Result(0);
    }
}


function NewGame(){

    //create array
    cellArr = new Array(max_col);
    for(let x = 0; x < max_col; x++)
        {
            cellArr[x] = new Array(max_row);
            for(let y = 0; y < max_row; y++)
            {
                let temp = new Cell();
                temp.row = y;
                temp.column = x;
                cellArr[x][y] = temp;            
            }
        }
    // pput mines in the array   
    let mineCount = 0;
    while(mineCount != num_mines)
        {
            rndCell = RandomCell();
            if(rndCell.mine == true)
            {
                continue; 
            }
            rndCell.mine = true;
            mineCount++;
        }
    //count
    for(let x = 0; x < max_col; x++)
        {
            for(let y = 0; y < max_row; y++)
            {
                cellArr[x][y].count = CountClose(x,y);
            }
        }
        NewGrid();
        BindGrid();
}
function NewGrid(){
    let newTable = '';
    for(let y = 0; y < max_row; y++)
    {
        newTable += "<tr> ";
        for(let x = 0; x < max_col; x++)
        {
            newTable += "<td><button id='" + x + "," + y + "'></button></td>";
        }
        newTable += "</tr>";
    }
    document.getElementById('tablee').innerHTML = newTable;    
}
function ShowGrid(){
    let iCount = 0;
    for(let x = 0; x < max_col; x++)
    {
        for(let y = 0; y < max_row; y++)
        {
            iCount += cellArr[x][y].Show();
        }
    }   
    if(iCount == 0)
        End(1);
    
}

function BindGrid(){
    for(let x = 0; x < max_col; x++)
    {
        for(let y = 0; y < max_row; y++)
        {
            cellArr[x][y].Bind();
        }
    }
}
function RandomCell(){
    
    let rndx = Math.floor(Math.random() * max_row);
    let rndy = Math.floor(Math.random() * max_col);

    return cellArr[rndx][rndy];
}


function CountClose(cellX, cellY){
    
    let count = 0;
    for(let x = cellX - 1; x <= cellX + 1; x++)
    {
        for(let y = cellY - 1; y <= cellY + 1; y++)
        {
            if(x < 0 || y < 0 || x >= max_col || y >= max_row)
                continue;
            if(cellArr[x][y].mine == true)
                count++;            
        }
    }
    return count;
}

function Check(x, y){
    
    if(x < 0 || y < 0 || x >= max_col || y >= max_row)
        return;
    if(cellArr[x][y].display == true)
        return;
    if(cellArr[x][y].count > 0)
    {
        cellArr[x][y].display = true;
        return;
    }
    //recursion
    else
    {
        cellArr[x][y].display = true;
        Check(x + 1, y);
        Check(x - 1, y);
        Check(x, y + 1);
        Check(x, y - 1);
    }
    
}



function Create(){
        StopTime();
        timerVal=0;
        var button = document.querySelector('#start');
        let text = document.getElementById('text');
        let rules = document.getElementById('rules');
        button.innerHTML = 'Easy';
        if(button.value == 'start'){
            text.innerHTML = "Select Difficulty!";
            button.value = 'easy';
            
            button.innerHTML = 'Easy';
            document.getElementById('med').style.display = 'inline-block';
            document.getElementById('hard').style.display = 'inline-block';
            return;
        } 
        rules.style.display = 'none';
        if(this.value == "med")
        {
            max_row = 12;
            max_col = 12;
            num_mines = 16;

            text.innerHTML = "Medium Mode";
        }
        else if(this.value == "hard")
        {
            max_row = 15;
            max_col = 15;
            num_mines = 50;
            text.innerHTML = "Hard Mode";
        }
        else
        {
            max_col = 9;
            max_row = 9;
            num_mines = 6;     
            text.innerHTML = "Easy Mode";       
        }

        document.querySelector("#mines").innerHTML = "Number of Mines: " + num_mines.toString();
        document.querySelector("#timer").innerHTML = "Time count(s): 0";
        button.value = "start";
        button.innerHTML="Restart"
        
        document.getElementById('med').style.display = 'none';
        document.getElementById('hard').style.display = 'none';

        NewGame();
}

function Result(State)
{    var button = document.querySelector('#start');
    let text = document.getElementById('text');
    let rules = document.getElementById('rules');
    if(State == 0)
    {
        document.getElementById('text').innerHTML = "You Lost, Restart?"                 
    }
    else
    {
        document.getElementById('text').innerHTML = "You Won! Restart?" 
    } 
    StopTime();
    button.value = "start";
    document.getElementById('med').style.display = 'none';
    document.getElementById('hard').style.display = 'none';
    button.innerHTML="Restart"
    
}
function TimerTick() {
    timerVal++;
    document.querySelector("#timer").innerHTML = "Time count(s): " + (timerVal / 100).toFixed(0);
  }
function StopTime() {
    startTimer = false;
    window.clearInterval(timerID);
  }
window.onload=function(){
    document.querySelector("#start").onclick = Create;
    document.querySelector('#med').onclick = Create;
    document.querySelector('#hard').onclick = Create;
}