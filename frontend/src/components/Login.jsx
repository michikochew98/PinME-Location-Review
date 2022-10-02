import './login.css';
import axios from 'axios';
import { CancelOutlined, Room } from '@material-ui/icons';
import { useState, useRef } from 'react';

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
    const [failure, setFailure] = useState(false);
    const rgsName = useRef();
    const rgsPassword = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: rgsName.current.value,
            password: rgsPassword.current.value,
        }
        
        try{
            const res = await axios.post('/users/login',user);
            myStorage.setItem("user", res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setFailure(false);
        }catch(err){
            setFailure(true);
        }
    }
  return (
    <div className='loginContainer'>
        <div className='loginLogo'>
            <Room />
            PinME
        </div>
        <form onSubmit={handleSubmit}>
            <input type='text' placeholder='username' ref={rgsName}/>
            <input type='password' placeholder='password' ref={rgsPassword}/>
            <button className='loginBtn'>Login</button>
            {failure&&<span className='failure'> Something went wrong...</span>}
        </form>
        <CancelOutlined className='loginCancel' onClick={() => setShowLogin(false)}/>
    </div>
  )
}
