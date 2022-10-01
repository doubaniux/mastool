import { requestCode, getUserData } from "./utils/mastodon";
import { accessToken, authorizationCode, userData } from "./store";

export const authenticate = requestCode;

export const login = async (domain, token) => {
    const _userData = await getUserData(domain, token);
    if (_userData) {
        userData.set(_userData);
        return true;
    }
    return false;
};

export const logout = () => {
    accessToken.set('');
    authorizationCode.set('');
    userData.set(null);
    localStorage.removeItem('accessToken');
};