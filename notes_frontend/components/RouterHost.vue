<script setup lang="ts">
import { computed } from 'vue';
import App from './App.vue';
import Presentation from './Presentation.vue';
import { useRoute } from '../vue-router-lite';

const route = useRoute();
const view = computed(() => route.path || '/');
</script>

<template>
  <component :is="view === '/present' ? Presentation : App" />
</template>
