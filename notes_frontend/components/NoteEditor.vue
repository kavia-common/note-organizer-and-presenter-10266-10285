<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TagManager from './TagManager.vue';
import { useNotesStore, type Note } from '../store/notes';

const props = defineProps<{ note: Note | null }>();
const notes = useNotesStore();

const localTitle = ref('');
const localContent = ref('');
const localTags = ref<string[]>([]);

watch(
  () => props.note?.id,
  () => {
    localTitle.value = props.note?.title ?? '';
    localContent.value = props.note?.content ?? '';
    localTags.value = [...(props.note?.tags ?? [])];
  },
  { immediate: true }
);

const isEmpty = computed(() => !props.note);

function save() {
  if (!props.note) return;
  notes.updateNote(props.note.id, {
    title: localTitle.value,
    content: localContent.value,
    tags: [...localTags.value],
  });
}
</script>

<template>
  <div v-if="!isEmpty" class="editor">
    <div class="row">
      <input
        v-model="localTitle"
        class="title"
        type="text"
        placeholder="Note title"
        @blur="save"
      />
    </div>
    <div class="row">
      <textarea
        v-model="localContent"
        class="content"
        placeholder="Write your note in Markdown..."
        @input="save"
      ></textarea>
      <div class="preview">
        <div class="preview-title">Preview</div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="preview-body prose" v-html="notes.renderMarkdown(localContent)"></div>
      </div>
    </div>
    <div class="row">
      <TagManager v-model="localTags" @change="save" />
    </div>
  </div>
  <div v-else class="empty">
    <p>Select a note from the left or create a new one.</p>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.row {
  display: flex;
  gap: 12px;
}
.title {
  width: 100%;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 18px;
  outline: none;
}
.content {
  flex: 1;
  min-height: 380px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  outline: none;
  resize: vertical;
}
.preview {
  width: 40%;
  min-width: 280px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  padding: 8px 12px;
}
.preview-title {
  font-weight: 600;
  color: #424242;
  margin-bottom: 8px;
}
.preview-body {
  color: #212121;
}
.empty { color: #757575; padding: 24px; }
</style>
