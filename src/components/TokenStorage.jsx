import { create } from "zustand";

const loadInitialState = () => {
  const token = localStorage.getItem("token") || null;
  const clientData = JSON.parse(localStorage.getItem("clientData")) || null;

  return { token: token, clientData };
};

const accountStorage = create((set, get) => ({
  ...loadInitialState(),
  setToken: (token) => {
    localStorage.setItem("token", token);
    set(() => ({ token }));
  },
  removeToken: async () => {
    const { token } = get();
    try {
      const response = await fetch(
        "http://localhost:8000/v1/account/token/delete",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP ERROR ${response.status}`);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("clientData");
        set(() => ({
          token: null,
          clientData: null,
        }));
      }
    } catch (error) {
      console.error("Deleting token failed:", error);
    }
  },
  setClientData: (clientData) => {
    localStorage.setItem("clientData", JSON.stringify(clientData));
    set(() => ({ clientData }));
  },
  getClientData: async () => {
    const { token, removeToken, setClientData } = get();
    try {
      const response = await fetch("http://localhost:8000/v1/account/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        removeToken();
        throw new Error(`HTTP ERROR ${response.status}`);
      } else {
        const clientData = await response.json();
        setClientData(clientData);
      }
    } catch (error) {
      console.error("Getting userdata failed:", error);
    }
  },
}));

export default accountStorage;
