//Pubnub object initialization
var subscribeKey = 'sub-c-d7ac8e5e-c9f3-11e8-80d1-72aadab1d7f1';
var publishKey = 'pub-c-ef1c9928-afb2-4ecf-bcb3-249c675e31f5';
var check;
var isX = true;
var movesX = [];
var movesY = [];
let occupiedMoves = [];
var uuid = PubNub.generateUUID();
var pubnub = new PubNub({
    subscribeKey: subscribeKey,
    publishKey: publishKey,
    ssl: true,
    uuid: uuid
});
playedX = false;

var channel = 'xogame14';

//adding listening event
pubnub.addListener({

    message: function(m) {
        movesX = m.message.movesX;
        movesY = m.message.movesY;
        occupiedMoves = m.message.occupiedMoves;
        playedX = m.message.playedX;
        console.log(m.message);
        disableMoves(occupiedMoves);
        nameX(movesX);
        nameO(movesY);
        stopCheating();
    },
    presence: function(presenceEvent) {
        check = presenceEvent; 
        if(presenceEvent.action === 'join' && presenceEvent.uuid === uuid)
        {
            if(presenceEvent.occupancy  < 2)
            {
                alert("waiting for opponent");
            }
            else if(presenceEvent.occupancy  === 2)
            {
                isX = false;
                //current changes

                var getTable = document.getElementById("myTable");
                getTable.id = 'myTableY';

                //ends here
                alert("all players have came");
            }
            else if(presenceEvent.occupancy  > 2)
            {
                alert("players exceeded");
                pubnub.unsubscribe({
                    channels: [channel]
                })
            }
        }
    },

    status: function(event){
        if(event.category == "PNConnectedCategory")
        {
            console.log("connected");
            createTable();
            
        }
    }
});
//pubnub subscription

pubnub.subscribe({
    channels: [channel],
    withPresence: true
});
//exit the game
function exit()
{
   pubnub.unsubscribeAll(); 
}

//Pubnub message publishing

function publishMessage()
{
   pubnub.publish(
       {
           message: {
               movesX:movesX,
               movesY:movesY,
               occupiedMoves:occupiedMoves,
               playedX:playedX,
           },
           channel: channel
       },
       function(status, response){
           if(status.error)
           {
               console.log(status)
           }
           else
           {
               //console.log("message published ", response.timetoken)
           }
       }
   )
}

//it creates the table and attach the onclick eventlistener
function createTable()
{
    var table = document.getElementById('myTable');
    for(let i = 0;i<3;i++)
    {
        var row = table.insertRow(i);
        for(let j = 0;j<3;j++)
        {
            let position = i*3+ j;
            //doubt How cell property are accessible till now after the loop has ended
            var cell = row.insertCell(j);
            //
            cell.addEventListener('click', function(e){
                console.log("event handler working");
                
                console.log(movesX);
                if(isX)
                {
                    if(!playedX)
                    {
                        var l = movesX.push(position);
                        playedX = !playedX;
                        stopCheating();
                    }
                    
                    // playedX = !playedX;
                    //console.log(movesX);
                }
                else
                {
                    if(playedX)
                    {
                        movesY.push(position);
                        playedX = !playedX;
                        stopCheating();
                    }
                    
                    // playedX = !playedX;
                }
                occupiedMoves.push(position);
                publishMessage()
                disableMoves(occupiedMoves);
                nameX(movesX);
                nameO(movesY);
                
            })
            cell.id = `cell${position}`;
            cell.innerHTML = "0";
        }
    }
}

//it disables the moves made already by both the players
function disableMoves(occupiedMoves)
{
    let length = occupiedMoves.length;
    for(let k = 0;k<length;k++)
    {
        var disable = document.getElementById(`cell${occupiedMoves[k]}`);
        disable.classList.add('disable');
    }
}

//Now its time to name the moves of x 
function nameX(movesX)
{
    let length = movesX.length;
    for(let k = 0;k<length;k++)
    {
        var namex = document.getElementById(`cell${movesX[k]}`);
        namex.innerHTML = 'X';
    }
}

//naming the moves of player O

function nameO(movesY)
{
    let length = movesY.length;
    for(let k = 0;k<length;k++)
    {
        var namey = document.getElementById(`cell${movesY[k]}`);
        namey.innerHTML = 'O';
    }
}

//stop if player x or o has played their chances
function stopCheating()
{
    if(isX)
    {
        let table = document.getElementById("myTable");
        if(playedX)
        {
            table.classList.add("disable");
        }
        else
        {
            table.classList.remove("disable");
        }
    }
    else
    {
        let tableY = document.getElementById("myTableY");
        if(!playedX)
        {
            tableY.classList.add("disable");
        }
        else
        {
            tableY.classList.remove("disable");
        }
    }
}

// it loads createTable when page loads
window.onload = function () {
    //createTable();
   
};

window.addEventListener('close', function(e){
    alert("hello");
})



