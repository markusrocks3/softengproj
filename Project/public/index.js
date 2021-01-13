 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBOOBgoZMM1T1qdskjF_f3qrRkomTFiKRE",
    authDomain: "coen3463-t7m3.firebaseapp.com",
    databaseURL: "https://coen3463-t7m3-default-rtdb.firebaseio.com",
    projectId: "coen3463-t7m3",
    storageBucket: "coen3463-t7m3.appspot.com",
    messagingSenderId: "636681316369",
    appId: "1:636681316369:web:b129ab1f5c7d488f8de9b0",
    measurementId: "G-85NDGJ22QX"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  const auth = firebase.auth();

// sign up
  function signUp(){
  
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    
    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));
    
    alert("Signed Up");

    document.getElementById("signOut").style.display = "block";
   }
   
   // sign in
   
   function signIn(){
    
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    
    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));
    
    
    
    
    
   }
   
   //upload
   function upload(){
    //get your image
    var image=document.getElementById('image').files[0];
 //post an item
    var post=document.getElementById('post').value;
    //get image name
    var imageName=image.name;
    //firebase storage reference
    //it is the path where your image will be stored
    var storageRef=firebase.storage().ref('images/'+imageName);
    //upload image to selected storage reference
    var uploadTask=storageRef.put(image);
    //to get the state of image uploading
    uploadTask.on('state_changed',function(snapshot){
         //get task progress by following code
         var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
         console.log("upload is "+progress+" done");
    },function(error){
      //handle error here
      console.log(error.message);
    },function(){
        //uploads here
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
          //data storage path
           firebase.database().ref('item/').push().set({
                 text:post,
                 imageURL:downloadURL
           },function(error){
               if(error){
                   alert("Error while uploading");
               }else{
                   alert("Successfully uploaded");
                  //reset
                   document.getElementById('post-form').reset();
                   getdata();
               }
           });
        });
    });

}

window.onload=function(){
    this.getdata();
}


function getdata(){
    firebase.database().ref('item/').once('value').then(function(snapshot){
      //get your posts div
      var posts_div=document.getElementById('posts');
      //remove all remaining data in that div
      posts.innerHTML="";
      //get data from firebase
      var data=snapshot.val();
      console.log(data);
      //now pass this data to our posts div
      //we have to pass our data to for loop to get one by one
      //we are passing the key of that post to delete it from database
      for(let[key,value] of Object.entries(data)){
        posts_div.innerHTML="<div class='col-sm-4 mt-2 mb-1'>"+
        "<div class='card'>"+
        "<img src='"+value.imageURL+"' style='height:250px;'>"+
        "<div class='card-body'><p class='card-text'>"+value.text+"</p>"+
        "<button class='btn btn-danger' id='"+key+"' onclick='delete_post(this.id)'>Delete</button>"+
        "</div></div></div>"+posts_div.innerHTML;
      }
    
    });
}

function delete_post(key){
    firebase.database().ref('item/'+key).remove();
    getdata();

}



//signout
   function signOut(){
    
    auth.signOut();
    document.getElementById("formContainer").style.display = "block";
    //hide account info
    document.getElementById("email").value ="";
    document.getElementById("password").value ="";
    document.getElementById("displayuser").innerHTML ="";
    document.getElementById("signOut").value ="none";
  }
   
   
   
   
   auth.onAuthStateChanged(function(user){
    if(user){
  
     var email = user.email;
     document.getElementById("formContainer").style.display = "none";
     document.getElementById("signOut").style.display = "block";
     document.getElementById("index").style.display = "block";

     //Take user to a different or home page
     //is signed in


    }else{
    
     //no user is signed in
     document.getElementById("index").style.display = "none";
     document.getElementById("signOut").style.display = "none";
     document.getElementById("formContainer").style.display ="block";
    }
    
   });