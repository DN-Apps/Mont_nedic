import React from 'react';

function Register() {


    return (
        <form >
            <h2>Registrieren</h2>
            <input placeholder="Benutzername" />
            <input placeholder="E-Mail" />
            <input type="password" placeholder="Passwort" />
            <button type="submit">Registrieren</button>
        </form>
    );
}

export default Register;
