import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/settings";
import AuthComponent from "./AuthComponent";
import { callAuth } from "../../services/backendService";

function Register() {
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function registerUser(event) {
    callAuth({
      path: "register",
      form: registerForm,
      setForm: setRegisterForm,
    });
    navigate("/login");
    event.preventDefault();
  }

  function handleChange(event) {
    const { value, name } = event.target;
    setRegisterForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  return (
    <AuthComponent
      form={registerForm}
      handleChange={handleChange}
      authFunc={registerUser}
      header={"Sign Up"}
      url={"/login"}
    />
  );
}

export default Register;
