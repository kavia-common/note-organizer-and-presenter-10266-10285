export function useRouterUtil() {
  // PUBLIC_INTERFACE
  function openPresentation(note: { id: string; title: string; content: string }) {
    /**
     * This opens a presentation window using the /present route with query params.
     * The Presentation component will generate a temporary Slidev markdown.
     */
    const q = new URLSearchParams({
      id: note.id,
      title: note.title || 'Untitled',
      content: note.content || '',
    });
    const url = `${location.origin}${location.pathname}#/present?${q.toString()}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return { openPresentation };
}
