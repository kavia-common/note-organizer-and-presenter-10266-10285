import { defineAppSetup } from '@slidev/types';
import { createPinia } from 'pinia';
import App from '../components/App.vue';

// PUBLIC_INTERFACE
export default defineAppSetup(({ app }) => {
  /**
   * This is called by Slidev when the app is created.
   * We install Pinia store and mount our root App component into the global layout.
   */
  const pinia = createPinia();
  app.use(pinia);

  // Register our App as a global component to be used in slides
  app.component('NotesApp', App);
});
