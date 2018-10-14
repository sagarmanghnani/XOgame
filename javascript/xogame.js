//Pubnub object initialization
var subscribeKey = 'sub-c-d7ac8e5e-c9f3-11e8-80d1-72aadab1d7f1';
var publishKey = 'pub-c-ef1c9928-afb2-4ecf-bcb3-249c675e31f5';
var check;
var isX = true;
var movesX = [];
var movesY = [];
let occupiedMoves = [];
var uuid = PubNub.generateUUID();
console.log(uuid + "uuid");
var pubnub = new PubNub({
    subscribeKey: subscribeKey,
    publishKey: publishKey,
    ssl: true,
    uuid: uuid
});

var channel = 'xogame16';

//adding listening event
pubnub.addListener({

    message: function(m) {
        console.log(m);
        movesX = m.message.movesX;
        movesY = m.message.movesY;
        occupiedMoves = m.message.occupiedMoves;
        console.log("isX coming");
        console.log(isX);
    },
    presence: function(presenceEvent) {
        console.log(isX);
        check = presenceEvent; 
        console.log("presenseEvent");
        console.log(presenceEvent.occupancy );
        if(presenceEvent.action === 'join' && presenceEvent.uuid === uuid)
        {
            if(presenceEvent.occupancy  < 2)
            {
                alert("waiting for opponent");
            }
            else if(presenceEvent.occupancy  === 2)
            {
                isX = false;
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
               occupiedMoves:occupiedMoves
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
               console.log("message published ", response.timetoken)
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
            
            //doubt How cell property are accessible till now after the loop has ended
            var cell = row.insertCell(j);
            cell.addEventListener('click', function(e){
                let position = i*3+ j;
                console.log(movesX);
                if(isX)
                {
                    var l = movesX.push(position);
                    console.log(movesX);
                }
                else
                {
                    movesY.push(position);
                }
                occupiedMoves.push(position);
                publishMessage()
            })
            
            cell.innerHTML = "0";
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



