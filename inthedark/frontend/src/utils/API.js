import axios from "axios";
// REFERENCES:
// https://designrevision.com/react-axios/
const API_URL = "http://localhost:8000/api/server/";

export default axios.create({
  baseURL: API_URL,
  responseType: "json"
});
