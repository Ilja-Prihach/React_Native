import type { Href } from 'expo-router';
import type { DemoItem } from '@/types';

export const homeHref = '/' satisfies Href;
export const searchHref = '/search' satisfies Href;
export const profileHref = '/profile' satisfies Href;
export const loginHref = '/login' satisfies Href;
export const registerHref = '/register' satisfies Href;

export function detailsHref(id: DemoItem['id']) {
  return {
    pathname: '/details/[id]',
    params: { id },
  } satisfies Href;
}

// TypeScript must reject this because the dynamic route requires `id`,
// but the params object provides an unknown key `slug`.
// const invalidDetailsHref = {
//   pathname: '/details/[id]',
//   params: { slug: 'expo-router' },
// } satisfies Href;
