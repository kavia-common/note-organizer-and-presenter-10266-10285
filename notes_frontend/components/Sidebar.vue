<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNotesStore } from '../store/notes';

const notes = useNotesStore();

const tagInput = ref('');

const filteredNotes = computed(() => notes.filteredNotes);
const tags = computed(() => notes.allTags);
const activeTag = computed({
  get: () => notes.activeTag,
  set: (v: string | null) => notes.setActiveTag(v),
});

function addTag() {
  const t = tagInput.value.trim();
  if (!t) return;
  notes.ensureTag(t);
  activeTag.value = t;
  tagInput.value = '';
}
</script>

<template>
  <aside class="sidebar">
    <div class="section">
      <div class="section-title">Tags</div>
      <div class="tags">
        <button
          class="tag"
          :class="{ active: activeTag === null }"
          @click="activeTag = null"
        >All</button>
        <button
          v-for="t in tags"
          :key="t"
          class="tag"
          :class="{ active: activeTag === t }"
          @click="activeTag = t"
        >#{{ t }}</button>
      </div>
      <div class="tag-add">
        <input
          v-model="tagInput"
          class="tag-input"
          placeholder="Add tag..."
          @keyup.enter="addTag"
        />
        <button class="btn primary" @click="addTag">Add</button>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Notes</div>
      <div class="note-list">
        <div
          v-for="n in filteredNotes"
          :key="n.id"
          class="note-item"
          :class="{ active: notes.activeNoteId === n.id }"
          @click="notes.setActiveNote(n.id)"
        >
          <div class="title">{{ n.title || 'Untitled' }}</div>
          <div class="meta">
            <span class="date">{{ new Date(n.updatedAt).toLocaleString() }}</span>
            <span v-if="n.tags?.length" class="tags"> •
              <span v-for="tg in n.tags" :key="tg" class="tag-chip">#{{ tg }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  height: 100%;
  overflow: auto;
  border-right: 1px solid #e0e0e0;
  background: #fff;
  padding: 12px;
}
.section { margin-bottom: 16px; }
.section-title {
  font-weight: 600;
  color: #424242;
  margin-bottom: 8px;
}
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  padding: 4px 8px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: #fafafa;
  cursor: pointer;
  font-size: 12px;
}
.tag.active { background: #1976d2; color: #fff; border-color: #1565c0; }
.tag-add { display: flex; gap: 6px; margin-top: 8px; }
.tag-input {
  flex: 1;
  height: 28px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0 8px;
  outline: none;
}
.btn { height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid transparent; cursor: pointer; }
.btn.primary { background: #1976d2; color: #fff; }
.note-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.note-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  background: #fff;
  cursor: pointer;
}
.note-item.active { border-color: #1976d2; box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15) inset; }
.title { font-weight: 600; color: #212121; }
.meta { font-size: 12px; color: #757575; margin-top: 4px; }
.tag-chip { margin-left: 4px; }
</style>
