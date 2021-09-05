import { FormEventHandler, useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";
import { Helmet } from "react-helmet";

export default function ResetPassword() {
    const emailRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    setTimeout(() => {
        emailRef.current?.focus();
    })

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);

            if (!emailRef) throw new Error("No ref")
            if (!emailRef.current) throw new Error("No current")
            await resetPassword(emailRef.current.value)

            setMessage("Reset password email sent")
        } catch (e) {
            setError("Failed to reset password: " + e.message)
        }
    }

    return (
        <CenteredContainer>
            <Helmet>
                <title>Reset Password | Google Drive Clone with Firebase</title>
            </Helmet>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Password Reset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>

                        <Button disabled={loading} className="w-100 mt-4" type="submit">
                            Reset Password
                        </Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/login">Log In</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </CenteredContainer>
    )
}