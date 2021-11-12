import { writable, derived } from 'svelte/store';

export const authorizationCode = writable('');
export const accessToken = writable('');
export const userData = writable(null);
export const userLoggedIn = derived(
	[accessToken, userData],
	([$accessToken, $userData]) => Boolean($accessToken) && Boolean($userData),
);