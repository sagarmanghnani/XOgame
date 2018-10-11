//Pubnub object initialization
var subscribeKey = 'sub-c-d7ac8e5e-c9f3-11e8-80d1-72aadab1d7f1';
var publishKey = 'pub-c-ef1c9928-afb2-4ecf-bcb3-249c675e31f5';
var uuid;
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
        console.log(check);
        console.log(presenceEvent.occupancy);
        if(presenceEvent.occupancy < 2)
        {
            alert("player is needed to come yet");
        }
        else if(presenceEvent.occupancy === 2)
        {
            alert("required players are arrived");
        }

        else{
            alert("Players exceeded");
            pubnub.unsubscribe({
                channels: ['xogame'],
            });
            console.log(presenceEvent.occupancy);
        }
        
    }
});
//pubnub subscription
pubnub.subscribe({
    channels: ['xogame'],
    withPresence: true
});

//exit the game
function exit()
{
    pubnub.unsubscribeAll();
    console.log("unsubscribed");
}

//Pubnub message publishing
function publishMessage()
{
   pubnub.publish(
       {
           message: {
               player:"X"
           },
           channel: 'xogame'
       },
       function(status, message){
           console.log(status, message);
       }
   )
}

function createTable()
{
    var table = document.getElementById('myTable');
    for(let i = 0;i<3;i++)
    {
        var row = table.insertRow(i);
        for(let j = 0;j<3;j++)
        {
            
            var cells = row.insertCell(j);
            cells.addEventListener('click', function(e, i, j){
                
               let position = i*3 + j;
               console.log(position);
                alert("col clicked");
            })
            cells.innerHTML = "0";
            
        }
    }
}

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


