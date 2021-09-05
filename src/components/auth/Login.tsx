import React, { FormEventHandler, useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";

export default function Login() {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const { logIn } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    setTimeout(() => {
        emailRef.current?.focus();
    })

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            
            if (!emailRef || !passwordRef)
                throw new Error("No refs")
            if (!emailRef.current || !passwordRef.current)
                throw new Error("No values")

            await logIn(emailRef.current.value, passwordRef.current.value);
            history.push("/");
        } catch (e: any) {
            setError("Failed to log in: " + e.message);
            // setError(e.message);
        }

        setLoading(false);
    }

    return (
        <CenteredContainer>
            <Helmet>
                <title>Log In | Google Drive Clone with Firebase</title>
            </Helmet>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4 ">Log In</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>

                        <Button disabled={loading} className="w-100 mt-4" type="submit">Log In</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-3">
                Don't have an account yet? <Link to="/signup">Sign Up</Link>
            </div>
        </CenteredContainer>
    )
}