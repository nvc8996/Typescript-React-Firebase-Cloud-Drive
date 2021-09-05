import { FormEventHandler, useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";

export default function SignUp() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const { signUp } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    setTimeout(() => {
        emailRef.current?.focus();   
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            if (!emailRef || !passwordRef || !passwordConfirmRef)
                throw new Error("No refs");
            if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current)
                throw new Error("No currents");

            if (passwordRef.current.value !== passwordConfirmRef.current.value) {
                return setError("Passwords do not match");
            }

            setError("");
            setLoading(true);
            
            await signUp(emailRef.current.value, passwordRef.current.value);
            history.push("/")

        } catch (e) {
            setError("Failed to create an account: " + e.message)
        }

        setLoading(false);
    }

    return (
        <CenteredContainer>
            <Helmet>
                <title>Sign Up | Google Drive Clone with Firebase</title>
            </Helmet>
            <Card>
                <Card.Body>
                <h2 className="text-center mb-4 ">Sign Up</h2>
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

                        <Form.Group id="password-confirm">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>

                        <Button disabled={loading} className="w-100 mt-4" type="submit">Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </CenteredContainer>
    )
}