import React,{useState} from 'react';
import style from './Register.module.scss';
import {toast} from "react-toastify";
import Return from "../../components/Return/Return";
const Register = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.username || !userData.email || !userData.password || !userData.confirmPassword) {
            toast("Veuillez remplir tous les champs")
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            toast("Les mots de passe ne correspondent pas")
            return;
        }
        try{
            const response = await fetch (process.env.REACT_APP_API_URL + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (response.status === 201) {
                toast.success("Utilisateur créé")
            } else if (response.status === 409) {
                toast.error("Email déjà utilisé")
            } else {
                toast("Erreur lors de la création de l'utilisateur")
                console.log(process.env.REACT_APP_API_URL);
            }
        } catch (error) {
            console.error("Error in /register:", error.message);
            console.log(error);
        }
    }
    return (
        <div>
            <Return />
            <div className={style.Register}>
                <div className={style.container}>
                    <form onSubmit={handleSubmit}>
                        <h1>Register</h1>
                        <div className={style.form_group}>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="username" id="username" placeholder="username" onChange={handleInputChange}/>
                        </div>
                        <div className={style.form_group}>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" placeholder="Email" onChange={handleInputChange}/>
                        </div>
                        <div className={style.form_group}>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" placeholder="Password" onChange={handleInputChange}/>
                        </div>
                        <div className={style.form_group}>
                            <label htmlFor="password">Confirm Password</label>
                            <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" onChange={handleInputChange}/>
                        </div>
                        <div className={style.form_group}>
                            <button type="submit">Register</button>
                            <p>Déjà un compte ? <a href="/">Connectez-vous</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;