import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface PrivateRouteProps extends RouteProps {
    component: any;
}

export default function PrivateRoute(props: PrivateRouteProps) {
    const {component: Component, ...rest } = props;
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render={ props => currentUser ? <Component {...props} /> : <Redirect to="/login" /> }
        />
    )
}