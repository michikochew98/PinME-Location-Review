import './register.css';
import axios from 'axios';
import { CancelOutlined, Room } from '@material-ui/icons';
import { useState, useRef } from 'react';

export default function Register({ setShowRegister }) {
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const newName = useRef();
    const newEmail = useRef();
    const newPassword = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: newName.current.value,
            email: newEmail.current.value,
            password: newPassword.current.value,
        }
        try{
            await axios.post('/users/register',newUser);
            setFailure(false);
            setSuccess(true);
        }catch(err){
            setFailure(true);
        }
    }
  return (
    <div className='registerContainer'>
        <div className='registerLogo'>
            <Room />
            PinME
        </div>
        <form onSubmit={handleSubmit}>
            <input type='text' placeholder='username' ref={newName}/>
            <input type='email' placeholder='email' ref={newEmail}/>
            <input type='password' placeholder='password' ref={newPassword}/>
            <button className='registerBtn'>Register</button>
            {success&&<span className='success'> Successfull. You can login now!</span>}
            {failure&&<span className='failure'> Something went wrong...</span>}
        </form>
        <CancelOutlined className='registerCancel' onClick={() => setShowRegister(false)}/>
    </div>
  )
}
