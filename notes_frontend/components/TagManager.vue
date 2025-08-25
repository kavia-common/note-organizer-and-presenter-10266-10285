<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNotesStore } from '../store/notes';

const props = defineProps<{ modelValue: string[] }>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void;
  (e: 'change'): void;
}>();

const store = useNotesStore();
const input = ref('');

const tags = computed({
  get: () => props.modelValue,
  set: (v: string[]) => emit('update:modelValue', v),
});

function add() {
  const v = input.value.trim();
  if (!v) return;
  if (!tags.value.includes(v)) {
    store.ensureTag(v);
    tags.value = [...tags.value, v];
    emit('change');
  }
  input.value = '';
}
function remove(tag: string) {
  tags.value = tags.value.filter(t => t !== tag);
  emit('change');
}
</script>

<template>
  <div class="tag-manager">
    <div class="chips">
      <span v-for="t in tags" :key="t" class="chip">
        #{{ t }}
        <button class="x" @click="remove(t)">×</button>
      </span>
    </div>
    <div class="adder">
      <input
        v-model="input"
        class="tag-input"
        placeholder="Add a tag..."
        @keyup.enter="add"
      />
      <button class="btn" @click="add">Add</button>
    </div>
  </div>
</template>

<style scoped>
.tag-manager { width: 100%; }
.chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff8e1;
  color: #5d4037;
  border: 1px solid #ffe082;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
}
.chip .x {
  border: none;
  background: transparent;
  color: #8d6e63;
  cursor: pointer;
}
.adder { display: flex; gap: 6px; }
.tag-input {
  flex: 1;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0 8px;
  outline: none;
}
.btn {
  height: 32px; padding: 0 12px; border-radius: 6px; border: 1px solid transparent;
  background: #ffd600; color: #212121; cursor: pointer;
}
.btn:hover { background: #ffca00; }
</style>
