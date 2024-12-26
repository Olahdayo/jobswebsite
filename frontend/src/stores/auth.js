import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("currentUser")) || null,
  }),

  actions: {
    login(email, password) {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        this.user = user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        return user;
      }

      throw new Error("Invalid credentials");
    },

    signup(newUser) {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const existingUser = users.find((u) => u.email === newUser.email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      this.user = newUser;
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    },

    logout() {
      this.user = null;
      localStorage.removeItem("currentUser");
    },

    initAuth() {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user) {
        this.user = user;
      }
    },
  },
});
