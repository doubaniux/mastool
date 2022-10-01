import axios from 'axios';
import { doc, getDoc, setDoc } from "firebase/firestore";
import db from '../storage/FirestoreInitialization';
import { OAUTH_CALLBACK } from "../routes";
import { accessToken, authorizationCode, userData } from "../store";

const CLIENT_NAME = "Mastool";
const SCOPES = "read:accounts write:follows write:statuses read:statuses";
const REDIRECT_URIS = window.location.origin + OAUTH_CALLBACK;
const WEBSITE = window.location.origin;

const retrieveApp = async (siteDomain) => {
    const docRef = doc(db, "mastodon_app", siteDomain);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return;
    }
};

const createApp = async (siteDomain) => {
    const response = await axios.post(`https://${siteDomain}/api/v1/apps`, {
        client_name: CLIENT_NAME,
        scopes: SCOPES,
        redirect_uris: REDIRECT_URIS,
        website: WEBSITE
    });
    await setDoc(doc(db, "mastodon_app", siteDomain), response.data);
    return response.data;
};

const retrieveOrCreateApp = async (siteDomain) => {
    let appData = await retrieveApp(siteDomain);
    if (!appData) {
        try {
            const newApp = await createApp(siteDomain);
            appData = newApp;
            console.log("successfully created mastodon app");
        } catch (error) {
            console.error("failed to create mastodon app");
            console.log(error);
        }
    }
    return appData;
};

const getToken = async (siteDomain, code) => {
    const appData = await retrieveOrCreateApp(siteDomain);
    const response = await axios.post(`https://${siteDomain}/oauth/token`, {
        client_id: appData.client_id,
        client_secret: appData.client_secret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URIS,
        scope: SCOPES,
    });
    const _userData = await getUserData(siteDomain, response.data.access_token);
    userData.set(_userData);
    accessToken.set(response.data.access_token);
    localStorage.setItem("accessToken", response.data.access_token);
    localStorage.setItem("domain", siteDomain);
};

const requestCode = async (siteDomain) => {
    const appData = await retrieveOrCreateApp(siteDomain);
    const redirectURL = "https://" + siteDomain + "/oauth/authorize?client_id=" +
        appData.client_id + "&scope=" + SCOPES + "&redirect_uri=" +
        REDIRECT_URIS + "&response_type=code";
    const authWindow = window.open(redirectURL, 'oauthWindow',
        `toolbar=no,
                            location=no,
                            status=no,
                            menubar=no,
                            scrollbars=yes,
                            resizable=yes,
                            left=${window.screen.width * 2 / 5},
                            top=${window.screen.height * 1 / 4},
                            width=${window.screen.width / 5},
                            height=${window.screen.height / 2}`);

    const codeMessageHandler = (event) => {
        if (event.origin !== window.origin) {
            console.log("received message from unknown origin");
            return;
        }
        window.removeEventListener('message', codeMessageHandler);
        authorizationCode.set(event.data.code);
        getToken(siteDomain, event.data.code);
        authWindow.close();
    }
    window.addEventListener("message", codeMessageHandler);
};

const getUserData = async (domain, token) => {
    const response = await axios.get(`https://${domain}/api/v1/accounts/verify_credentials`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    if (response.status !== 200) return null;
    response.data.domain = domain;
    return response.data;
};

const getNextLink = (linkHeader) => {
    if (linkHeader === undefined) return;
    const links = linkHeader.split(', ');
    const nextPage = links.find((link) => link.includes('rel="next"'))
    if (nextPage === undefined) return;
    const nextLink = nextPage.match(/<(.*?)>/)[1];
    return nextLink;
};

const getFollowings = async (domain, token, id, limit = 1000) => {
    let followings = [];
    let nextLink = `https://${domain}/api/v1/accounts/${id}/following?limit=${limit}`;
    let finished = false;

    while (!finished) {
        const response = await axios.get(nextLink, { headers: { Authorization: "Bearer " + token } })
        followings = followings.concat(response.data);
        nextLink = getNextLink(response.headers.link);
        if (nextLink === undefined) finished = true;
    }

    return followings;
};

const getFollowers = async (domain, token, id, limit = 1000) => {
    let followers = [];
    let nextLink = `https://${domain}/api/v1/accounts/${id}/followers?limit=${limit}`;
    let finished = false;

    while (!finished) {
        const response = await axios.get(nextLink, { headers: { Authorization: "Bearer " + token } })
        followers = followers.concat(response.data);
        nextLink = getNextLink(response.headers.link);
        if (nextLink === undefined) finished = true;
    }

    return followers;
};

const getEmojiDict = (emoji_list) => {
    let dict = new Object;
    emoji_list.forEach(pair => {
        dict[":" + pair.shortcode + ":"] = pair.url;
    });
    return dict;
};

const translateEmojis = (text, emoji_list) => {
    let dict = getEmojiDict(emoji_list);
    let regex = /:(.*?):/g;
    let translation = null;
    translation = text.replace(regex, function (match) {
        return "<img src=" + dict[match] + " class=emoji alt=" + match + ">";
    });

    return translation;
};

const followUser = async (domain, token, id) => {
    const response = await axios.post(
        `https://${domain}/api/v1/accounts/${id}/follow`,
        null,
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    )
    return response.data;
};

const unfollowUser = async (domain, token, id) => {
    const response = await axios.post(
        `https://${domain}/api/v1/accounts/${id}/unfollow`,
        null,
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    )
    return response.data;
};

const getUserStatuses = async (domain, token, id, max_id = 0) => {
    let url = `https://${domain}/api/v1/accounts/${id}/statuses`;
    if (max_id)
        url += `?max_id=${max_id}`;
    const response = await axios.get(
        url,
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    )
    // one call returns 20 statuses
    return response.data;
};

const getStatusIdsByTimeRange = async (domain, token, userId, start, end) => {
    let ids = []

    let statusLatestDate = null;
    let max_id = null
    while (true) {
        // fetch statuses by chunks of size 20
        const data = await getUserStatuses(
            domain,
            token,
            userId,
            max_id
        );
        // statuses list exhausted, exit
        if (data.length === 0) break;

        max_id = data[data.length-1].id

        if (statusLatestDate === null) statusLatestDate = new Date(data[0].created_at);
        // no overlap
        if (start >= statusLatestDate) break;
        // window not reached yet
        if (end < Date(data[data.length - 1].created_at)) continue;

        ids = ids.concat(data
            .filter(status => {
                const dateObj = new Date(status.created_at);
                return dateObj >= start && dateObj <= end;
            })
            .map(status => status.id));

        // all in range statuses retrieved
        if (start >= Date(data[data.length - 1].created_at) && start <= Date(data[0].created_at)) break;
    }
    return ids;
};

const deleteStatus = async (domain, token, id) => {
    return response = await axios.delete(
        `https://${domain}/api/v1/statuses/${id}`,
        { headers: { Authorization: "Bearer " + token } }
    )
};

export {
    requestCode,
    getUserData,
    getFollowers,
    getFollowings,
    translateEmojis,
    followUser,
    unfollowUser,
    getStatusIdsByTimeRange,
    deleteStatus
};