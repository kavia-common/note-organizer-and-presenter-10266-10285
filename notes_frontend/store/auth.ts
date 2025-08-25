import { defineStore } from 'pinia';

export type User = {
  email: string;
};

// PUBLIC_INTERFACE
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: state => !!state.user,
  },
  actions: {
    init() {
      const raw = localStorage.getItem('auth_user');
      if (raw) {
        try {
          this.user = JSON.parse(raw);
        } catch {
          this.user = null;
        }
      }
    },
    signIn(email: string) {
      this.user = { email };
      localStorage.setItem('auth_user', JSON.stringify(this.user));
    },
    signOut() {
      this.user = null;
      localStorage.removeItem('auth_user');
    },
  },
});
