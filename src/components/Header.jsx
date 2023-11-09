import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/settings";

function Header(props) {
  const navigator = useNavigate();
  function logMeOut() {
    axios({
      method: "POST",
      url: BASE_URL + "/logout",
    })
      .then((response) => {
        props.token();
        navigator("/");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }
  return (
    <header className="text-end sticky-top">
      <nav class="navbar navbar-light navbar-expand-md py-3">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center" href="/">
            <span class="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center me-2 bs-icon">
              <i class="far fa-money-bill-alt"></i>
            </span>
            <span>TradeSafe</span>
          </a>
          <a
            class="btn btn-primary ms-md-2"
            role="button"
            onClick={() => {
              logMeOut();
            }}
          >
            Log Out
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
