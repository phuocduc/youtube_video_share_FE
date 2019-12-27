import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import { Switch, Route } from "react-router-dom";
import Share from "./view/Share";
import Home from "./view/Home";

function App() {
  const [user, setUser] = useState(null);
  const accessToken =
    window.location.search.split("=")[0] === "?api_key"
      ? window.location.search.split("=")[1]
      : null;

  const [token, setToken] = useState(
    localStorage.getItem("token") || accessToken
  );

  const get_user = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/getuser`, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
    if (res.status !== 200) return;
    const data = await res.json();
    if (res.ok) {
      setUser({ name: data.name, email: data.email });
      localStorage.setItem("token", token);
    }
  };

  useEffect(() => {
    get_user();
  },[]);

  return (
    <Switch>
      <Route path="/" exact render={() => <Home user={user} token={token} setUser={setUser}/>}></Route>
      <Route
        path="/authen"
        exact
        render={() => (
          <Login
            user={user}
            setUser={setUser}
            token={token}
            setToken={setToken}
          />
        )}
      ></Route>
      <Route path="/share" exact render={() => <Share token={token} user={user} setUser={setUser}/>}></Route>
    </Switch>
  );
}

export default App;
