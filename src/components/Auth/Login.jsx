import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthComponent from "./AuthComponent";
import { callAuth } from "../../services/backendService";

function Login(props) {
  const [loginForm, setloginForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  function logMeIn(event) {
    callAuth({
      path: "token",
      form: loginForm,
      setForm: setloginForm,
      setToken: props.setToken,
    });
    navigate("/dash");
    event.preventDefault();
  }

  function handleChange(event) {
    const { value, name } = event.target;
    setloginForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  return (
    <AuthComponent
      form={loginForm}
      handleChange={handleChange}
      func={logMeIn}
      header={"Log in"}
      url={"/register"}
    />
  );
}

export default Login;
