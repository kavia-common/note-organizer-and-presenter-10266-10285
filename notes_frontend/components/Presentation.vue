<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '../vue-router-lite';

const route = useRoute();

const title = computed(() => decodeURIComponent((route.query.title as string) || 'Untitled'));
const content = computed(() => decodeURIComponent((route.query.content as string) || ''));

// Generate a simple slide markdown from the note content.
// First slide = title, subsequent slides split by headings (###) or horizontal rules (---).
const deck = computed(() => {
  const body = (content.value || '').trim();
  const parts = splitToSlides(body);
  const fm = `---\ntheme: default\ntransition: slide-left\nmdc: true\n---\n\n`;
  const slides = [`# ${title.value}\n\nUse arrow keys or space to navigate.\n`]
    .concat(parts.map(s => s.trim()))
    .join('\n---\n\n');
  return fm + slides;
});

function splitToSlides(md: string): string[] {
  if (!md) return [];
  // Split by H1/H2 or hr
  const lines = md.split(/\r?\n/);
  const slides: string[] = [];
  let acc: string[] = [];
  const pushAcc = () => {
    if (acc.join('\n').trim()) slides.push(acc.join('\n'));
    acc = [];
  };
  for (const ln of lines) {
    if (/^---\s*$/.test(ln) || /^#{1,2}\s+/.test(ln)) {
      pushAcc();
    }
    acc.push(ln);
  }
  pushAcc();
  return slides;
}
</script>

<template>
  <div class="presentation">
    <div class="hint">Presentation Preview (generated)</div>
    <pre class="markdown">{{ deck }}</pre>
    <div class="note">Tip: Use the Export button in Slidev toolbar to export when running in full Slidev preview.</div>
  </div>
</template>

<style scoped>
.presentation { padding: 16px; }
.hint { font-weight: 600; color: #1976d2; margin-bottom: 8px; }
.markdown {
  white-space: pre-wrap;
  background: #fdfdfd;
  border: 1px solid #e0e0e0;
  padding: 12px;
  border-radius: 8px;
}
.note { margin-top: 8px; color: #757575; font-size: 13px; }
</style>
