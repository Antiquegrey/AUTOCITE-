import axios from "axios";
export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post("/user/signup", { name, email, password });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (message: string) => {
  const res = await axios.post("/chat/new", { message });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  const data = await res.data;
  return data;
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post("/document/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (res.status !== 201) {
    throw new Error("Unable to upload document");
  }
  return res.data;
};

export const getUserDocuments = async () => {
  const res = await axios.get("/document/all");
  if (res.status !== 200) {
    throw new Error("Unable to get documents");
  }
  return res.data;
};

export const deleteDocument = async (id: string) => {
  const res = await axios.delete(`/document/delete/${id}`);
  if (res.status !== 200) {
    throw new Error("Unable to delete document");
  }
  return res.data;
};