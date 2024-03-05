# Effect callbacks are synchronous to prevent race conditions.
### Error->
useEffect(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

### what i write
 useEffect(async()=>{

      if(!localStorage.getItem("chat-app-user")){
        navigate("/login");
      }else{
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      }
    
  },[])

## Reason->
In React, the useEffect hook expects its callback function to be synchronous for performance reasons. This means you should avoid directly using asynchronous operations like await inside the useEffect callback.

To resolve this issue, you need to wrap your asynchronous function inside the useEffect callback with a regular synchronous function and then call the asynchronous function from there. 

### solve
useEffect(()=>{
    async function setUser(){

      if(!localStorage.getItem("chat-app-user")){
        navigate("/login");
      }else{
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      }
    }  
    setUser();
  },[])


# After Register localStorage showing empty {}

### What i write
 const user = User.create({ 
        email,username,password:hashPassword,
    });
    console.log("userController register:");
    console.log(user);
    console.log("username,email,pass: ",username," ",email," ",password);
    console.log(user);

### Error in console
Database connected successfully...
userController register:
Promise { <pending> }
username,email,pass:  ritu   ru@gmail.com   r12345678
Promise { <pending> }
user,email,pass:  ritu   ru@gmail.com   r1234567


## Reason 
The reason  Promise { <pending> } instead of the user data is because the User.create() function returns a promise that is pending until the operation completes. In your code, User.create() is an asynchronous operation, and when you log user

### Solve
 const user = await User.create({ 
        email,username,password:hashPassword,
    });

## GET Method-> Failed to load resource: the server responded with a status of 404 (Not Found)

### before
router.get("/allusers:id",getAllUsers);
### after
router.get("/allusers/:id",getAllUsers);

srf / ni lagaya tha 😐


## Emoji is printing, value showing Undefined

### Solve 
emoji-picker-react class changed in new version to EmojiPickerReact, then it will work fine
and onEmojiClick(handleClick)  , will take handleClick(emoji,event) 