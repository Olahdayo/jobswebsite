import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    currentUser: null,
    users: []
  }),

  actions: {
    initializeStore() {
      // Load data from localStorage
      const storedUsers = localStorage.getItem('users')
      const storedCurrentUser = localStorage.getItem('currentUser')
      
      if (storedUsers) this.users = JSON.parse(storedUsers)
      if (storedCurrentUser) this.currentUser = JSON.parse(storedCurrentUser)
    },

    registerUser(userData) {
      const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString()
      }
      
      this.users.push(newUser)
      this.updateLocalStorage()
      return newUser
    },

    loginUser(email, password) {
      const user = this.users.find(u => 
        u.email === email && u.password === password
      )
      
      if (user) {
        this.currentUser = user
        localStorage.setItem('currentUser', JSON.stringify(user))
        return user
      }
      return null
    },

    logoutUser() {
      this.currentUser = null
      localStorage.removeItem('currentUser')
    },

    updateLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users))
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.currentUser
  }
}) 