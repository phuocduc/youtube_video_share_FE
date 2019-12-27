import React, { useState } from "react";
import "../assets/css/login.css";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

export default function Login(props) {
  const [loginInfo, setLoginInfo] = useState({});
  const [userRegister, setUserRegister] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const history = useHistory();
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginInfo)
    });
    const data = await res.json();
    if (data.state === "not_user") {
      alert("please sign up first");
    }
    if (data.state === "wrongPass") {
      alert("Password is not correct!");
    }

    if (data.state === "success") {
      props.setUser({ name: data.user });
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user);
      alert("login sucess");
    }
  };

  const logout = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success === true) localStorage.clear("token");
      props.setUser && props.setUser(null);
      history.push("/");
      alert("logout");
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userRegister)
    });
    const data = await response.json();
    if (data.state === "success") {
      alert("register success");
      handleClose();
    }
    if (data.state === "exist_user") {
      alert("user already");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container nav-login position-relative">
        <h1>
          <a className="title-movie" href="/">
          <i className="fa fa-home mr-2" aria-hidden="true"></i>
            Funny Movies
          </a>
        </h1>
        <div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {props.user ? (
              <div className="d-flex justify-content-center login-side">
                Welcome {props.user.name}
                <button
                  className="btn btn-primary ml-3 mr-3 btn-share"
                  onClick={() => history.push("/share")}
                >
                  Share a movie
                </button>
                <button className="btn btn-primary" onClick={() => logout()}>Logout</button>
              </div>
            ) : (
              <form className="form-loginn">
                <input
                  placeholder="Email address"
                  type="email"
                  className="form-control mr-2"
                  onChange={e =>
                    setLoginInfo({ ...loginInfo, email: e.target.value })
                  }
                  autoComplete="email"
                  placeholder="Enter email"
                />
                <input
                  placeholder="password"
                  type="password"
                  onChange={e =>
                    setLoginInfo({ ...loginInfo, password: e.target.value })
                  }
                  className="form-control mr-2"
                  placeholder="Password"
                  autoComplete="current-password"
                />

                <div className="d-flex btn">
                  <button
                    onClick={e => handleSubmit(e)}
                    className="btn btn-primary"
                  >
                    Login
                  </button>
                  <>
                    <Button onClick={handleShow}>Register</Button>

                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Register</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form
                          onSubmit={handleRegister}
                          className="d-flex flex-column"
                        >
                          <div className="form-group d-flex flex-column">
                            <label>User Name</label>
                            <input
                              type="text"
                              name="username"
                              autoComplete="username"
                              onChange={e =>
                                setUserRegister({
                                  ...userRegister,
                                  username: e.target.value
                                })
                              }
                            />
                            <label>Email</label>
                            <input
                              type="email"
                              name="email"
                              autoComplete="email"
                              onChange={e =>
                                setUserRegister({
                                  ...userRegister,
                                  email: e.target.value
                                })
                              }
                            />
                            <label>Password</label>
                            <input
                              type="password"
                              name="password"
                              autoComplete="password"
                              onChange={e =>
                                setUserRegister({
                                  ...userRegister,
                                  password: e.target.value
                                })
                              }
                            />
                          </div>
                          <div>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="primary" type="submit">
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Modal.Body>
                    </Modal>
                  </>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
