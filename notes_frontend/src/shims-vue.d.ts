declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // Use object and unknown instead of {} to satisfy lint rules
  const component: DefineComponent<object, Record<string, never>, unknown>;
  export default component;
}
