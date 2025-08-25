import { reactive, readonly } from 'vue';

type Query = Record<string, string | string[] | undefined>;
type Route = {
  path: string;
  query: Query;
};

const state = reactive<Route>({
  path: getPath(),
  query: getQuery(),
});

function getPath(): string {
  const hash = location.hash.replace(/^#/, '');
  const [p] = hash.split('?');
  return p || '/';
}
function getQuery(): Query {
  const hash = location.hash.replace(/^#/, '');
  const [, qs] = hash.split('?');
  const params = new URLSearchParams(qs || '');
  const obj: Query = {};
  params.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
}

window.addEventListener('hashchange', () => {
  state.path = getPath();
  state.query = getQuery();
});

export function useRoute() {
  return readonly(state);
}
