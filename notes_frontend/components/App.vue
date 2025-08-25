<script setup lang="ts">
import { computed, onMounted } from 'vue';
import TopBar from './TopBar.vue';
import Sidebar from './Sidebar.vue';
import NoteEditor from './NoteEditor.vue';
import { useNotesStore } from '../store/notes';
import { useAuthStore } from '../store/auth';

// initialize stores
const auth = useAuthStore();
const notes = useNotesStore();

onMounted(() => {
  auth.init();
  notes.init();
});

const selectedNote = computed(() => notes.activeNote);
</script>

<template>
  <div class="app-container">
    <TopBar />
    <div class="content">
      <Sidebar />
      <main class="main">
        <div v-if="!auth.isAuthenticated" class="auth-placeholder">
          <h2>Welcome</h2>
          <p>Please sign in to manage your notes.</p>
        </div>
        <NoteEditor v-else :note="selectedNote" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fafafa;
  color: #212121;
}
.content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
  height: calc(100% - 56px);
}
.main {
  padding: 16px;
  overflow: auto;
}
.auth-placeholder {
  margin-top: 48px;
  color: #555;
}
</style>
