import React, { useEffect, useState } from 'react'
// import * as formik from 'formik';
import { app } from '../../firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
// import * as yup from 'yup';
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import { getFirestore, collection, getDocs, serverTimestamp, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
        
        const auth = getAuth(app);
        await signInWithEmailAndPassword(auth,email, password);
          console.log('Login successful!');
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/admin/dashboard');
          // You can redirect the user or perform additional actions after successful login
        } catch (error) {
          console.error('Login failed:', error.message);
        }
      };

      useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
          console.log("loggedin exists")
          navigate('/admin/dashboard')
          return;
        }
      }, []);

  return (
    <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center w-100">
        <div className="row justify-content-center w-100">
          <div className="col-md-8 col-lg-6 col-xxl-3">
            <div className="card mb-0">
              <div className="card-body">
                <div className='d-flex justify-content-center' style={{'marginBottom':'10px'}}>
                  <img src="https://firebasestorage.googleapis.com/v0/b/chefguard-5ca00.appspot.com/o/images%2Flogo.png?alt=media&token=e0d2877a-2920-4c6b-84f3-4ec89219885b" width="50" alt=""/>
                <h2 className="" style={{'marginBottom':'0', 'marginTop':'4px',fontWeight:'600', color:'#135b21'}}>CHEFGUARD</h2>
                </div>
                  <div className="mb-3">
                  <span className='importantStar'>* </span>
                    <label htmlFor="exampleInputEmail1" className="form-label">Username / Email</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                  <div className="mb-4">
                  <span className='importantStar'>* </span>
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)}/>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="form-check">
                      <input className="form-check-input primary" type="checkbox" value="" id="flexCheckChecked"/>
                      <label className="form-check-label text-dark" htmlFor="flexCheckChecked">
                        Remeber this Device
                      </label>
                    </div>
                    <a className="text-primary fw-bold" href="./index.html">Forgot Password ?</a>
                  </div>
                  <button type='button' className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2" onClick={handleLogin}>Sign In</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login