import TOKEN from "../constants/finnHub";

import axios from "axios";
export default axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params: {
    token: TOKEN,
  },
});
