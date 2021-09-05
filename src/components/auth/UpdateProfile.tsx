import React, { FormEventHandler, useRef, useState } from "react";
import { Card, Form, Alert, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";

export default function UpdateProfile() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { currentUser, updatePassword, updateEmail } = useAuth();

    setTimeout(() => {
        passwordRef.current?.focus();   
    });
    
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        try {
            if (!emailRef || !passwordRef || !passwordConfirmRef)
                throw new Error("No refs");
            if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current)
                throw new Error("No currents");

            if (passwordRef.current.value !== passwordConfirmRef.current.value) {
                return setError("Passwords do not match");
            }

            if (!currentUser) throw new Error("Login required");

            setError("");
            setLoading(true);
            
            const promises: Promise<any>[] = []

            if (emailRef.current.value !== currentUser.email)
                promises.push(updateEmail(emailRef.current.value));

            if (passwordRef.current.value)
                promises.push(updatePassword(passwordRef.current.value));
                
            Promise.all(promises)
                .then(() => {
                    history.push("/profile")
                })
                .catch((e) => {
                    setError("Failed to update: " + e.message)
                })
                .finally(() => {
                    setLoading(false)
                })

        } catch (e) {
            setError("Failed to update profile: " + e.message)
        }
    }

    return (
        <CenteredContainer>
            <Helmet>
                <title>Update Profile | Google Drive Clone with Firebase</title>
            </Helmet>
            <Card>
                <Card.Body>
                <h2 className="text-center mb-4 ">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultValue={currentUser ? currentUser.email ? currentUser.email : "" : ""} />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
                        </Form.Group>

                        <Form.Group id="password-confirm">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
                        </Form.Group>

                        <Button disabled={loading} className="w-100 mt-4" type="submit">Update</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/profile">Cancel</Link>
            </div>
        </CenteredContainer>
    )
}