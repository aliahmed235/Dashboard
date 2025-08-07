import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState({});

    const onSubmit = (ev) => {
        ev.preventDefault();

        setErrors({}); // Clear previous errors

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            email: [response.data.message],
                        });
                    }
                }
            });
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Login into your account</h1>

                    {Object.keys(errors).length > 0 && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    )}

                    <input ref={emailRef} type="email" placeholder="Email" required />
                    <input ref={passwordRef} type="password" placeholder="Password" required />
                    <button type="submit" className="btn btn-block">Login</button>

                    <p className="message">
                        Not Registered? <Link to="/signup">Create an Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
