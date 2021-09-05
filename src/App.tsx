// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Profile from './components/auth/Profile';
import PrivateRoute from './components/auth/PrivateRoute';
import SignUp from './components/auth/SignUp';
import UpdateProfile from './components/auth/UpdateProfile';
import ResetPassword from './components/auth/ResetPassword';
import DashBoard from './components/drive/DashBoard';
import { Helmet } from 'react-helmet';


function App() {
  return (
    <>
      <Helmet>
        <title>Google Drive Clone with Firebase</title>
      </Helmet>
      <BrowserRouter>
        <AuthProvider>
          <Switch>
            {/* Drive */}
            <PrivateRoute exact path='/' component={DashBoard}/>
            <PrivateRoute exact path='/folder/:folderId' component={DashBoard}/>

            {/* Profile */}
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />

            {/* Authentication */}
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ResetPassword} />
          </Switch>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
