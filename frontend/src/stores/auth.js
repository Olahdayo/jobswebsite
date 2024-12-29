import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("currentUser")) || null,
  }),

  actions: {
    login(email, password) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      console.log("Stored users:", users); // Debug log

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Invalid credentials");
      }

      if (!user.type) {
        throw new Error("User type not found");
      }

      this.user = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
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
