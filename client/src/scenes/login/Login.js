import React,{useState} from 'react';
import style from './Login.module.scss';
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.email || !credentials.password) {
             toast.error('Veuillez remplir tous les champs')
            return;
        }

        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            if (response.headers.get("content-type")?.includes("application/json")) {
                const data = await response.json();
                if (response.status === 200 && data.token) {
                    localStorage.setItem('token', data.token);
                    const roleResponse = await fetch(process.env.REACT_APP_API_URL + '/user-role', {
                        headers: {
                            'authorization': data.token
                        }
                    });
                    const roleData = await roleResponse.json();
                    const userRole = roleData.role;

                    if (userRole === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                } else {
                    alert(data.error || 'Invalid credentials');
                }
            } else {
                toast.error("Une erreur est survenue lors de la connexion")
            }
        } catch (error) {
           console.error(error);
        }
    };

    return (
        <div>
            <div className={style.Login}>
                <div className={style.container}>
                    <form onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        <div className={style.form_group}>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" placeholder="Email" onChange={handleInputChange}/>
                        </div>
                        <div className={style.form_group}>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" placeholder="Password" onChange={handleInputChange}/>
                        </div>
                        <div className={style.form_group}>
                            <button type="submit" >Login</button>
                            <p>Pas encore de compte ? <a href="/register"> Inscrivez-vous</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
