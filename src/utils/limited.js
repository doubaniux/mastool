import axios from "axios";

// rate limit buckets
// https://docs.joinmastodon.org/api/rate-limits/
const BUCKET_ACCOUNT_ACCESS = 'account access'; // default
const BUCKET_APP_SIGN_IP = 'app sign up';
const BUCKET_UPLOADING = 'uploading';
const BUCKET_DELETION = 'deletion';

const BUCKETS_MAPPING = [
    { pattern: "\/api\/v1\/accounts", method: "post", bucket: BUCKET_APP_SIGN_IP },
    { pattern: "\/api\/v1\/media", method: "post", bucket: BUCKET_UPLOADING },
    { pattern: "\/api\/v1\/statuses\/\d+$", method: "delete", bucket: BUCKET_DELETION },
    { pattern: "\/api\/v1\/statuses\/\d\/unreblog", method: "post", bucket: BUCKET_DELETION },
];

const initialStateFactory = () => ({
    lastCalledTime: null,
    nextCallTime: null,
});

const apiCallStamps = {
    [BUCKET_APP_SIGN_IP]: initialStateFactory(),
    [BUCKET_ACCOUNT_ACCESS]: initialStateFactory(),
    [BUCKET_UPLOADING]: initialStateFactory(),
    [BUCKET_DELETION]: initialStateFactory(),
};

const sleep = (ms) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });

const getBucket = (url, method) => {
    for (let i = 0; i < BUCKETS_MAPPING.length; i++) {
        const match = BUCKETS_MAPPING[i];
        if ((new RegExp(match.pattern)).test(url) && method === match.method) {
            return match.bucket;
        }
    }
    return BUCKET_ACCOUNT_ACCESS;
};

const limitDecorator = (func, method) => async (...args) => {
    const bucket = getBucket(args[0], method)
    const stamp = apiCallStamps[bucket];

    if (stamp.nextCallTime !== null && stamp.nextCallTime > Date.now()) await sleep(stamp.nextCallTime - Date.now());
    stamp.lastCalledTime = Date.now();
    const response = await func(...args);
    const delta = (new Date(response.headers["x-ratelimit-reset"])).valueOf() - stamp.lastCalledTime;
    stamp.nextCallTime = stamp.lastCalledTime + delta / Number(response.headers["x-ratelimit-remaining"]);
    return response;
}

const limited = {
    get: limitDecorator(axios.get, 'get'),
    post: limitDecorator(axios.post, 'post'),
    delete: limitDecorator(axios.delete, 'delete'),
    put: limitDecorator(axios.put, 'put'),
}

export default limited;