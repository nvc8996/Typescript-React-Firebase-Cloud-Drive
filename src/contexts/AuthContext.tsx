import React, { useContext, useState, useEffect, FC } from "react";
import { auth } from "../firebase";
import firebase from "firebase";

type User = firebase.User;

interface AuthContextInterface {
    currentUser: User | undefined;
    signUp: Function,
    logIn: Function,
    logOut: Function,
    resetPassword: Function,
    updateEmail: Function,
    updatePassword: Function
}

const AuthContext = React.createContext<AuthContextInterface>({} as AuthContextInterface);

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider: FC<{}> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User>();
    // const [loading, setLoading] = useState(true)

    function signUp(email: string, password: string) {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function logIn(email: string, password: string) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function logOut() {
        return auth.signOut();
    }

    function resetPassword(email: string) {
        return auth.sendPasswordResetEmail(email);
    }

    function updateEmail(email: string) {
        if (currentUser)
            return currentUser.updateEmail(email)
    }

    function updatePassword(password: string) {
        if (currentUser)
            return currentUser.updatePassword(password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged( user => {
            if (user) {
                setCurrentUser(user);
                // setLoading(false);
            } else {
                setCurrentUser(undefined);
                // setLoading(true);
            }
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signUp,
        logIn,
        logOut,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}