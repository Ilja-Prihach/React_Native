import type { Href } from 'expo-router';
import type { DemoItem } from '@/types';

export const homeHref = '/' satisfies Href;
export const searchHref = '/search' satisfies Href;
export const profileHref = '/profile' satisfies Href;
export const loginHref = '/login' satisfies Href;
export const registerHref = '/register' satisfies Href;
export const expoRouterBasicsHref = '/examples/expo-router-basics' satisfies Href;
export const asyncStorageDraftHref = '/examples/async-storage-draft' satisfies Href;
export const savedProfilesHref = '/examples/saved-profiles' satisfies Href;
export const renderFlatListHref = '/examples/render-flatlist' satisfies Href;

export function detailsHref(id: DemoItem['id']) {
  return {
    pathname: '/details/[id]',
    params: { id },
  } satisfies Href;
}

export function demoItemHref(id: DemoItem['id']) {
  if (id === 'expo-router') {
    return expoRouterBasicsHref;
  }

  if (id === 'async-storage') {
    return asyncStorageDraftHref;
  }

  if (id === 'flatlist-performance') {
    return renderFlatListHref;
  }

  return detailsHref(id);
}

export function isExampleDemoItem(id: DemoItem['id']) {
  return id === 'expo-router' || id === 'async-storage' || id === 'flatlist-performance';
}

export function savedProfilesRefreshHref(refreshToken: string) {
  return {
    pathname: '/examples/saved-profiles',
    params: { refresh: refreshToken },
  } satisfies Href;
}

// TypeScript must reject this because the dynamic route requires `id`,
// but the params object provides an unknown key `slug`.
// const invalidDetailsHref = {
//   pathname: '/details/[id]',
//   params: { slug: 'expo-router' },
// } satisfies Href;
