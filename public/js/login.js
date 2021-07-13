// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBpMUOUOhwWktM753F8ck-bAI9B8t58I0o",
    authDomain: "engage-aef74.firebaseapp.com",
    databaseURL: "https://engage-aef74-default-rtdb.firebaseio.com",
    projectId: "engage-aef74",
    storageBucket: "engage-aef74.appspot.com",
    messagingSenderId: "553587667967",
    appId: "1:553587667967:web:c51adabd7e0122b9a5edca",
    measurementId: "G-GDT3BN32RN"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  const auth= firebase.auth();
  
  function sendVerificationEmail(){
    var user = auth.currentUser;
    
    user.sendEmailVerification().then(function() {
    // Email sent.
      window.alert("Verification mail sent to : "+ user.email);
    }).catch(function(error) {
    // An error happened.
      window.alert("error : "+errorMessage);
    });
    }

  function logIn(){
    var userEmail = document.getElementById("email_field").value;
    var userPassword = document.getElementById("password_field").value;
    auth.signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message;
        window.alert("error : " +errorMessage);
        // ...
      });
  
  }
  function signUp(){
    var userEmail = document.getElementById("user_email").value;
    var userPassword = document.getElementById("user_password").value;
    auth.createUserWithEmailAndPassword(userEmail, userPassword).then(function(){
          sendVerificationEmail();
    }).catch(function(error) {
      // Handle Errors here.
      var errorMessage = error.message;
      // ...
      window.alert("error : "+errorMessage);
    });
    username();
    }


  auth.onAuthStateChanged(function(user) {
        if (user) {
            document.getElementById("user-div").style.display = "block";
            document.getElementById("login-div").style.display = "none";
            var user = firebase.auth().currentUser;
            if(user){
                var email_id = user.email;
                var verified = user.emailVerified;
        
                document.getElementById("user_para").innerHTML="Welcome User : " + email_id+"<br>Email verified : "+verified;
                if(verified){
                    window.location="./joinroom.html";
                }
                else{
                  window.open("./login.html")
                    alert("please verfiy emailID")}
              
             }
          // User is signed in.
        } else {
            document.getElementById("user-div").style.display = "none";
            document.getElementById("login-div").style.display = "block";
            
        
        }
        });
        
function logOut(){
    firebase.auth().signOut().then(function(){
      window.location="./login.html";
    });
          
}
function logout(){
  firebase.auth().signOut().then(function(){
    window.location="./login.html";
  });
        
}

// function logout(){
//   firebase.auth().signOut().then(function(){
//     window.location="./login.html";
//   });}
function username(){
    var name =document.getElementById('uname').value;
    var datab  = firebase.database().ref("users/"+firebase.auth().currentUser.uid);
    // var userInfo = datab.push();
    datab.set({
        username: name
    });
}
function retriveData(data){
    var id=auth.currentUser.uid;
    var ref=firebase.database().ref("users/"+id);
    ref.once("value").then(function(snapshot){
        var uname = snapshot.val().username;
    })
}
        