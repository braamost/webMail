import "./style.css";
import React, { useState } from "react";
import {Link} from "react-router-dom"
function SignUp() {
    const [isLogin , setIsLogin] = useState(true)
    return (
        <>
        <section>
        <div className="form-box">
            <div className="form-value">
                {(isLogin)
                &&
                (   <form>
                    <h2>Login</h2>
                    <div className="inputbox">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input type="email" required />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="inputbox">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type="password" required />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="forget">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <label>
                            <a href="#">Forgot password?</a>
                        </label>
                    </div>
                    <button type="submit">Log in</button>
                    <div className="register">
                        <p>Don't have an account? <button onClick={()=>(setIsLogin(false))} >Register</button></p>
                    </div>
                    <Link to="/Home">
                        <button>Go to Home Page</button>
                    </Link>
                </form>)
                }
                {(!isLogin)
                &&
                (   <form>
                    <h2>Register</h2>
                    <div className="inputbox">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input type="email" required />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="inputbox">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type="text" required />
                        <label htmlFor="text">User Name</label>
                    </div>
                    <div className="inputbox">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input type="text" required />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="inputbox">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type="text" inputmode="numeric" pattern="[0-9\s]{13,19}" autocomplete="cc-number" maxlength="19" required />
                        <label htmlFor="phone">Telephone</label>
                    </div>
                    <button type="submit">Create new account</button>
                    <div className="register">
                        <p>have an account? <button onClick={()=>(setIsLogin(true))}>Login</button> </p>
                    </div>
                    <div className="home">
                       <Link to="/Home">
                        <button >Go to Home Page</button>
                    </Link> 
                    </div>    
                </form>)
                }
            </div>
        </div>
        </section>
        </>
    );
}

export default SignUp;
