import React, {useEffect, createContext, useReducer, useContext} from 'react';
import Navbar from './components/Navbar';
import "./App.css";
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import Createpost from './components/screens/Createpost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPost from './components/screens/SubscribedUserPosts';
import {reducer, initialState} from './reducers/userReducer';

export const UserContext = createContext();

const Routing = function() {

  const history = useHistory();

  // eslint-disable-next-line
  const {state, dispatch} = useContext(UserContext); 

  useEffect(function() {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user) {
      dispatch({type:"USER",payload:user});
      //history.push("/");
    }else {
      history.push("/signin");
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Switch>
      {/* '/' is present in all routes so if we don't use 
      exact Home will be visible in every other route.*/} 
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <Createpost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPost />
      </Route>
    </Switch>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
