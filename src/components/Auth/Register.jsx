import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/settings";
import AuthComponent from "./AuthComponent";
import { callAuth } from "../../services/backendService";

function Register() {
  const [regForm, setRegForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function RegisterUser(event) {
    callAuth({
      path: "register",
      form: regForm,
      setForm: setRegForm,
    });
    navigate("/login");
    event.preventDefault();
  }

  function handleChange(event) {
    const { value, name } = event.target;
    setRegForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  return (
    <AuthComponent
      form={regForm}
      handleChange={handleChange}
      func={RegisterUser}
      header={"Sign Up"}
      url={"/login"}
    />
  );
}

export default Register;
