import { defineStore } from 'pinia';

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

type State = {
  notes: Note[];
  activeNoteId: string | null;
  tags: Set<string>;
  searchQuery: string;
  activeTag: string | null;
};

// PUBLIC_INTERFACE
export const useNotesStore = defineStore('notes', {
  state: (): State => ({
    notes: [],
    activeNoteId: null,
    tags: new Set(),
    searchQuery: '',
    activeTag: null,
  }),
  getters: {
    activeNote(state) {
      return state.notes.find(n => n.id === state.activeNoteId) || null;
    },
    allTags(state): string[] {
      return Array.from(state.tags).sort((a, b) => a.localeCompare(b));
    },
    filteredNotes(state): Note[] {
      const q = state.searchQuery.toLowerCase().trim();
      const tag = state.activeTag;
      return state.notes
        .filter(n => {
          const matchesQuery =
            !q ||
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some(t => t.toLowerCase().includes(q));
          const matchesTag = !tag || n.tags.includes(tag);
          return matchesQuery && matchesTag;
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);
    },
  },
  actions: {
    init() {
      const raw = localStorage.getItem('notes_data');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { notes: Note[]; tags: string[]; activeNoteId: string | null };
          this.notes = parsed.notes || [];
          this.tags = new Set(parsed.tags || []);
          this.activeNoteId = parsed.activeNoteId || (this.notes[0]?.id ?? null);
        } catch {
          this.notes = [];
          this.tags = new Set();
          this.activeNoteId = null;
        }
      } else {
        // seed with an example note
        const id = this.uuid();
        const now = Date.now();
        const example: Note = {
          id,
          title: 'Welcome Note',
          content: '# Welcome\n\n- Create, edit, delete notes\n- Tag your notes\n- Use search\n- Click Present to generate slides',
          tags: ['welcome', 'tips'],
          createdAt: now,
          updatedAt: now,
        };
        this.notes = [example];
        this.tags = new Set(example.tags);
        this.activeNoteId = id;
        this.persist();
      }
    },
    persist() {
      const data = {
        notes: this.notes,
        tags: Array.from(this.tags),
        activeNoteId: this.activeNoteId,
      };
      localStorage.setItem('notes_data', JSON.stringify(data));
    },
    setSearch(q: string) {
      this.searchQuery = q;
    },
    setActiveTag(tag: string | null) {
      this.activeTag = tag;
    },
    setActiveNote(id: string) {
      this.activeNoteId = id;
      this.persist();
    },
    createNote() {
      const id = this.uuid();
      const now = Date.now();
      const note: Note = {
        id,
        title: 'New Note',
        content: '',
        tags: [],
        createdAt: now,
        updatedAt: now,
      };
      this.notes.unshift(note);
      this.activeNoteId = id;
      this.persist();
    },
    updateNote(id: string, patch: Partial<Pick<Note, 'title' | 'content' | 'tags'>>) {
      const n = this.notes.find(x => x.id === id);
      if (!n) return;
      if (patch.title !== undefined) n.title = patch.title;
      if (patch.content !== undefined) n.content = patch.content;
      if (patch.tags !== undefined) {
        n.tags = patch.tags;
        // ensure in registry
        for (const t of patch.tags) this.tags.add(t);
      }
      n.updatedAt = Date.now();
      this.persist();
    },
    deleteNote(id: string) {
      const idx = this.notes.findIndex(n => n.id === id);
      if (idx >= 0) this.notes.splice(idx, 1);
      if (this.activeNoteId === id) {
        this.activeNoteId = this.notes[0]?.id ?? null;
      }
      this.persist();
    },
    ensureTag(tag: string) {
      this.tags.add(tag);
      this.persist();
    },
    renderMarkdown(md: string): string {
      // Minimal markdown rendering: headings, bold, italics, code blocks, inline code, lists, links.
      let html = md || '';
      // Escape basic HTML
      html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      // code blocks ```
      html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code}</code></pre>`);

      // headings
      html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
      html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
      html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
      html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
      html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
      html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

      // unordered lists
      html = html.replace(/^(?:-|\*) (.*)$/gm, '<li>$1</li>');
      html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');

      // bold and italics
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

      // inline code
      html = html.replace(/`([^`]+?)`/g, '<code>$1</code>');

      // links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

      // paragraphs
      html = html.replace(/^(?!<h\d|<ul|<li|<pre|<\/li|<code|<p|<\/ul|<a)(.+)$/gm, '<p>$1</p>');

      return html;
    },
    uuid(): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
  },
});
