import { useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CenteredContainer from "./CenteredContainer";

export default function Profile() {
    const [error, setError] = useState("");
    const { currentUser, logOut } = useAuth();
    const history = useHistory();

    async function handleLogOut() {
        setError("");

        try {
            await logOut();
            history.push("/login");
        } catch {
            setError("Failed to log out");
        }
    }

    return (
        <CenteredContainer>
            <Helmet>
                <title>Profile | Google Drive Clone with Firebase</title>
            </Helmet>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email:</strong> {currentUser ? currentUser.email : "No login yet"}

                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                        Update Profile
                    </Link>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={() => {history.push("/")}}>
                    Back to drive
                </Button>
                <Button variant="link" onClick={handleLogOut}>
                    Log Out
                </Button>
            </div>
        </CenteredContainer>
    )
}