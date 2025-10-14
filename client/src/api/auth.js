import axios from axios;

const API =axios.create({
    baseURL:"http://localhost:5000/api/auth"
});

//register

export const register =(formData)=>API.post("/register",formData);

//login

export const login = (formData) => API.post("/login", formData);