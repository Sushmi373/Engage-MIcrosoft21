const socket = io("/");
const videogrid = document.getElementById("video-grid");//All the video streams of every user in the room will be stored in this grid
const myvideo = document.createElement("video");//for video of the peer
const username = prompt("Enter your name");//for display name of the user
const peer = new Peer(undefined, {
    host: "peer-js-server-by-akki.herokuapp.com",
    port: 443,
    secure: true,
});
const allpeers = {};

myvideo.classList.add("user-video");
// Muting our own audio so that we can't hear our own audio
myvideo.muted = true;
let myVideoStream;

//code to open webcam and send the stream to all other users using webRTC method

navigator.mediaDevices
    .getUserMedia({
        video: { facingMode: "user" },
        audio: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myvideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', (userID,Name) => {
        connectToNewUser(userID, stream);
        messages.innerHTML =
        messages.innerHTML +
        `<div class="message">
            <b><span style="color:#FF5800;font-style:oblique;font-weight: 700;"> ${ Name } joined the meet</span></b>
        </div>`;
    })

    // chat-box
    let chattext = $('input');
    let messages = document.querySelector(".messages");
    // Make 'enter' key submit message
    $('html').keydown((e) => {
            if (e.which == 13 && chattext.val().length !== 0) {
                // Emit message to server
                socket.emit('message', chattext.val());
                // Clear input
                chattext.val('');
        }
    })

//when user messages
    socket.on('createMessage',(message,Name) => {
        messages.innerHTML =
        messages.innerHTML +
        `<div class="message">
            <b><i class="fas fa-user-circle"></i><span> ${
            Name === username ? "You" : Name}</span>&emsp;<span style="color:#363636">${new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true})} </span>:</b><br/>
            <span>${message}</span>
        </div>`;
        scrollToBottom();
    })
})
    .catch((err) => alert(err.message));

//when user disconnects

socket.on("user-disconnected", (userID,Name) => {
    `<div class="message">
    <b><span style="color:#21FFD3;font-style:oblique;font-weight: 700;">${ Name } left the meet</span></b>
</div>`;
    if (allpeers[userID]) 
    {allpeers[userID].close();
        }
});

//when peer connects

peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id,username);
    console.log("connected to peer");
});


//function to connect to a new user

const connectToNewUser=(userID, stream) =>{
    var call = peer.call(userID, stream);
    console.log(call);
    var video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        console.log(userVideoStream);
        addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
        video.remove();
    });
    
    allpeers[userID] = call;
    
}

//function to add video stream of other user who joined in the room 

const addVideoStream = (videoU1, stream) =>{
    videoU1.srcObject = stream;
    videoU1.addEventListener("loadedmetadata", () => {
        videoU1.play();
    });
    videogrid.append(videoU1);

    //total no of users in one particular room
    let totalUsers = document.getElementsByTagName("video").length;
    if (totalUsers > 1) {
        for (let index = 0; index < totalUsers; index++) {
            document.getElementsByTagName("video")[index].style.width =
            100 / totalUsers + "%";
            document.getElementsByTagName("video")[index].style.height =
            100 / totalUsers + "%";
    }
  }
};

// Onclick button function to toggle the audio

const toggleAudioBtn = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

//display button when user audio is unmuted

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `;

    document.querySelector('.MuteButton').innerHTML = html;
}

//display button when user audio is on mute

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `;

    document.querySelector('.MuteButton').innerHTML = html;
}

//Onclick button function to toggle the video

const toggleVideoStream = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayButton();
    } else {
        setpauseButton();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

//display button when video is paused

const setPlayButton = () => {
    const html = `
    <i class="unmute fas fa-video-slash"></i>
    <span>Play Video</span>
    `;

    document.querySelector('.mainVideoButton').innerHTML = html;
}

//display button when video is playing

const setpauseButton = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Pause Video</span>
    `;

    document.querySelector('.mainVideoButton').innerHTML = html;
}


// scrollbar for chat box

const scrollToBottom = () => {
    let d = $('.chat-Window');
    d.scrollTop(d.prop("scrollHeight"));
}

// Onclick button function to pop up a chat-box

const showHideDiv=(chatdiv)=>{
   var closechatdiv=document.getElementById("closediv");
   var left = document.getElementById("left")
    if(chatdiv.value == "Yes"){
        closediv.style.display="none";
        left.style.flex = 1;
        closechatdiv.style.flex=0;
        chatdiv.style.color="white";
        chatdiv.value = "No";
    }
    else{

        closechatdiv.style.display = "flex";
        left.style.flex = 0.8;
        closechatdiv.style.flex=0.2;
        chatdiv.style.color="#00B0F0";
        chatdiv.value = "Yes";
             
    }
}

//Raising hand


const raiseHand=(raiseHand)=>{
    if(raiseHand.val==="yes"){
        raiseHand.style.color="#FFFFFF";
        raiseHand.val="no";
    }
    else{

        raiseHand.style.color="#FFFF00";
        raiseHand.val="yes";
        socket.emit('raise-hand');
    }

}

//Display hand raise in chat-box

socket.on('raiseHand', Name =>{
    $("ul").append(`<h6 style="color:#B82542;font-style:oblique;font-weight: 700;"><li class="message"><span> ${
    Name === username ? "You" : Name
    } raised hand ✋</span></li></h6>`);
})

// Invite people by copying meeting link

const MeetlinkButton = () => {
    navigator.clipboard.writeText(window.location.href).then(function() {
        alert("Meeting link has been copied to the clipboard! Send it to the people you want to have conversation with.");
    }, function(err) {
      alert('Failed to copy');
    });
};

//To change time and display current time on homepage 

function timer(){
    var currentTime = new Date()
   var hours = currentTime.getHours()
   var minutes = currentTime.getMinutes()
   var sec = currentTime.getSeconds()
   if (minutes < 10){
       minutes = "0" + minutes
   }
   if (sec < 10){
       sec = "0" + sec
   }
   var t_str = hours + ":" + minutes + ":" + sec + " ";
   if(hours > 11){
       t_str += "PM";
   } else {
      t_str += "AM";
   }
    document.getElementById('datetime').innerHTML = t_str;
    setTimeout(timer,1000);
}

//To exit the meeting and Prompt the user before leave the meeting

const exitmeet=()=> {
    const leaveRoom = confirm("Are you sure you want to leave the meeting?");
    if (leaveRoom) {
  window.open("leavemeet.html", "_self");
    }
 
}
