import "./style.css";
import React from "react";

function SignUp() {
    return (
        <>
        <section>
        <div className="form-box">
            <div className="form-value">
                <form>
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
                        <p>Don't have an account? <a href="#">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
        </section>
        </>
    );
}

export default SignUp;
