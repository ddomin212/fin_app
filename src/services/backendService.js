import axios from "axios";
import { BASE_URL } from "../utils/settings";

async function callAuth({ path, form, setForm, setToken }) {
  if (
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email) == false
  ) {
    throw new Error("Email Invalid");
  }
  axios({
    method: "POST",
    url: BASE_URL + "/" + path,
    data: {
      email: form.email,
      password: form.password,
    },
  })
    .then((response) => {
      if (path === "token") setToken(response.data.access_token);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });

  setForm({
    email: "",
    password: "",
  });
}

async function backendRequest({ method, props, path, responseFunc, data }) {
  axios({
    method,
    url: BASE_URL + "/" + path,
    headers: {
      Authorization: "Bearer " + props.token,
    },
    data: data,
  })
    .then((response) => {
      if (responseFunc) responseFunc(response);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
}

export { callAuth, backendRequest };
