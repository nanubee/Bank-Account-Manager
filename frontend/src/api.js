import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

export default api;

//instead of writing axios.get(FastAPI URL) we define an api so only call the api.get endpoint