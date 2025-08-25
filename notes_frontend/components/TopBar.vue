<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNotesStore } from '../store/notes';
import { useAuthStore } from '../store/auth';
import { useRouterUtil } from '../utils/router';

const notes = useNotesStore();
const auth = useAuthStore();
const { openPresentation } = useRouterUtil();

const canEdit = computed(() => auth.isAuthenticated && !!notes.activeNoteId);
const searchQuery = ref(notes.searchQuery);

function handleSearch() {
  notes.setSearch(searchQuery.value);
}

function createNote() {
  notes.createNote();
}

function saveNote() {
  notes.persist();
}

function deleteNote() {
  if (!notes.activeNoteId) return;
  if (confirm('Delete this note?')) {
    notes.deleteNote(notes.activeNoteId);
  }
}

function presentNote() {
  if (notes.activeNote) {
    openPresentation(notes.activeNote);
  }
}

function signIn() {
  const email = prompt('Enter email to sign in') || '';
  if (email) auth.signIn(email);
}
function signOut() {
  auth.signOut();
}
</script>

<template>
  <header class="topbar">
    <div class="left">
      <strong class="brand">Notes</strong>
      <div class="actions">
        <button class="btn primary" :disabled="!auth.isAuthenticated" @click="createNote">New</button>
        <button class="btn" :disabled="!canEdit" @click="saveNote">Save</button>
        <button class="btn danger" :disabled="!canEdit" @click="deleteNote">Delete</button>
        <button class="btn accent" :disabled="!canEdit" @click="presentNote">Present</button>
      </div>
    </div>
    <div class="right">
      <input
        v-model="searchQuery"
        class="search"
        type="search"
        placeholder="Search notes..."
        @input="handleSearch"
      />
      <div class="user">
        <template v-if="auth.isAuthenticated">
          <span class="email">{{ auth.user?.email }}</span>
          <button class="btn ghost" @click="signOut">Sign out</button>
        </template>
        <template v-else>
          <button class="btn primary" @click="signIn">Sign in</button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 12px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}
.brand {
  color: #1976d2;
  margin-right: 12px;
}
.actions {
  display: inline-flex;
  gap: 8px;
}
.btn {
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: #f5f5f5;
  color: #424242;
  cursor: pointer;
}
.btn:hover { background: #eeeeee; }
.btn.primary { background: #1976d2; color: #fff; }
.btn.primary:hover { background: #1565c0; }
.btn.accent { background: #ffd600; color: #212121; }
.btn.accent:hover { background: #ffca00; }
.btn.danger { background: #ffebee; color: #c62828; border-color: #ffcdd2; }
.btn.danger:hover { background: #ffcdd2; }
.btn.ghost { background: transparent; border-color: #e0e0e0; }
.right { display: flex; align-items: center; gap: 8px; }
.search {
  height: 32px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  padding: 0 12px;
  min-width: 240px;
  outline: none;
}
.email { color: #424242; margin-right: 4px; }
.left { display: flex; align-items: center; gap: 8px; }
</style>
