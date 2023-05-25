const express= require("express");
const app=express(); //to intialize the app
const server=require("http").Server(app)
//till here is the starting point of every single app by express you make 
const io =require("socket.io")(server)
const port=3001;

let users=[]



// Now whenever i log in to the home page of this server i should get 
app.get("/",(req,res)=>{
    res.send("hello zoom")
})


const addUser=(userName,roomId)=>{
    users.push({
        userName:userName,
        roomId:roomId
    })
}
const getRoomUser=(roomId)=>{
    return users.filter(user=>(user.roomId===roomId))

}
//userLeave() and as a parameter pass in the userName you want to leave 
const userLeave=(userName)=>{
    // now i am gonnna just filter myself out 
    users=users.filter(user=>user.userName != userName)
}



//whenever someone is connected 
io.on("connection",socket=>{
    console.log("someone gotta connected")
    //whenever someone joins my room which i specified
socket.on("join-room",({roomId,userName})=>{
    console.log("user joined room");
    console.log(userName);
    console.log(roomId)
    //now to fully joined this room we create a functinality 
    socket.join(roomId) 
    addUser(userName,roomId)

    //now when i joined the room i want to tell everybody else that i joine that specific room and thats what socket.to does 
    socket.to(roomId).emit("user-connected",userName)
    //i wanna keep the track of every user that connects to this room id and so we make an array called users 
     

    //now i m now connected and tell here are all the users connected to the specific room
    //io.to tells everybody including me and that here all the users we have are in this specific room 
    io.to(roomId).emit("all-users", getRoomUser(roomId))

    //and when we disconnect
    socket.on("disconnect",()=>{
        console.log("disconnected")
        //i m gonna leave this room and here socket means your socket    
        socket.leave(roomId);

        //before i do io.to.emit i have to remove the user means i have to remove myself so use userLeave function 
         userLeave(userName) 
        //i will joing again and tell everyone that here are the new user we got 

        io.to(roomId).emit("all-users",getRoomUser(roomId)); 

    })


})
})






server.listen(port,()=>{
    console.log("zoom listening on localhost:3001")
});


