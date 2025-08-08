import React from 'react'
import { useState } from 'react'
import './CSS/LogInSignUp.css'
const LogInSignUp = () => {
  const [state,setState]=useState("login");
   const [formdata, setformdata] = useState({
    username:"",
    email:"",
    password:""
   })
      const handleOnchange=(e) => {
         return setformdata({...formdata,[e.target.name]:e.target.value});
      }

      const login =async () => {
        console.log("login",formdata);
         let responseData;
        await fetch('http://localhost:4000/login',{
          method:'POST',
          headers:{
            Accept:'application/form-data',
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formdata)
        }).then((res)=>res.json()).then((data)=>{
          responseData=data;
        })

      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token)
        window.location.replace('/')
      }
      else{
        alert(responseData.errors)
      }
      }

      const signup=async() => {
        console.log("signup",formdata)
        let responseData;
        await fetch('http://localhost:4000/signup',{
          method:'POST',
          headers:{
            Accept:'application/form-data',
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formdata)
        }).then((res)=>res.json()).then((data)=>{
          responseData=data;
        })

      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token)
        window.location.replace('/')
      }
      else{
        alert(responseData.errors)
      }
      }
      

  return (
    <div className='login-signup'>
      <div className='login-signup-container'>
      <h2>{state}</h2>
      {state==="signup"?<input type="text" name='username' value={formdata.username} onChange={handleOnchange} placeholder='Your name' />:<></>}
      <input type="text" name='email' value={formdata.email} onChange={handleOnchange} placeholder='Email address'/>
      <input type="password" name='password' value={formdata.password} onChange={handleOnchange} placeholder='Password' />
      <button onClick={()=>{state==="login"?login():signup()}}>Continue</button>
      <div className='loginsignUp_footer_text'>
        {state==="signup"?<p>Already have an account?<span onClick={()=>{setState("login")}}>Login  here</span></p>:<p>Create new  account?<span onClick={()=>{setState("signup")}}>click here</span></p>}
      <div className="input">
        <input type="checkbox"  />
      <p>By continuing ,i agree to the terms of use & privacy policy</p>
      </div>
      </div>
      </div>
    </div>
  )
}

export default LogInSignUp
