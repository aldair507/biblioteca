import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getBooks = async () => {
  const response = await api.get("/books");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users/users/");
  return response.data;
};

export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

export const getRequests = async () => {
  const response = await api.get("/requests/requests/");
  return response.data;
};