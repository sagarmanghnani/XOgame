//Pubnub object initialization
var subscribeKey = 'sub-c-d7ac8e5e-c9f3-11e8-80d1-72aadab1d7f1';
var publishKey = 'pub-c-ef1c9928-afb2-4ecf-bcb3-249c675e31f5';
var uuid;
var isX = true;
let movesX = [];
let movesY = [];
let occupiedMoves = [];
var pubnub = new PubNub({
    subscribeKey: subscribeKey,
    publishKey: publishKey,
    uuid: PubNub.generateUUID(),
    ssl: true,

})
;

//adding listening event
pubnub.addListener({
    status:function(statusEvent){
        if(statusEvent.category === 'PNConnectedCategory'){
            var newState = {
                name: 'kuch bhi',
                timestamp: new Date()
            }
            pubnub.setState({
                channels:['xogame'],
                state:newState
            })
        }
    },

    message: function(message) {
        console.log(message);
    },
    presence: function(presenceEvent) {
        check = presenceEvent;
        uuid = check.uuid;
       
        
    }
});
//pubnub subscription


//exit the game
function exit()
{
   pubnub.unsubscribe({
       channels:['xogame'],
       callback: function(){
          
       }
   }) 
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
           channel: 'xogame'
       },
       function(status, message){
           console.log(status, message);
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
                
                if(isX)
                {
                    movesX.push(position);
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

// Number of Subscribers
function numSubscriber()
{
    pubnub.hereNow({
        channels: ['xogame']
    },
    function (status, response){
        console.log("coming response");
        console.log(response);
        if(response.totalOccupancy < 2)
        {
            alert("player is needed to come yet");
            console.log("response.totalOccupancy = " + response.totalOccupancy)
        }

        else if(response.totalOccupancy === 2)
        {
            isX = false;
            alert("required players are arrived");
            console.log("response.totalOccupancy = " + response.totalOccupancy)
        }

        else{
            alert("Players exceeded");
            //exit();
            console.log("response.totalOccupancy = " + response.totalOccupancy);
            pubnub.unsubscribe({
                channels:['xogame']
            })
            return;
        }
        pubnub.subscribe({
            channels: ['xogame'],
            withPresence: true
        });

    }
    )
}
// it loads createTable when page loads
window.onload = function () {
    createTable();
    numSubscriber();
};

window.addEventListener('close', function(e){
    alert("hello");
})



//will be used later

// function Unsubscribe(){
//     try{
//         pubnub.unsubscribe({
//             channels: ['xogame']
//         });
//     } catch(err){
//         console.log("Failed to unsub");
//     }
// }

//will be used later
// function requestToserver()
// {
//     Unsubscribe();
//     var request = new XMLHttpRequest();
//     request.open('GET', "https://pubsub.pubnub.com/v2/presence/" + subscribeKey + "/channel/" + "xogame/leave?uuid=" + encodeURIComponent(uuid), true);
//     request.onload = function(){
//         var data = JSON.parse(this.response);
//         console.log(data);
//         alert(data);
//         alert("hello");
//     }
//     alert("hello");
// }

var check;


