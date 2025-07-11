const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 1000;

const userRequests = {};

function isRateLimited(userId) {
    const now = Date.now();

    if(!userRequests[userId]) {
        userRequests[userId] = [];
    }

    userRequests[userId] = userRequests[userId].filter(ts => now - ts < WINDOW_MS);

    if(userRequests[userId].length >= RATE_LIMIT) {
        return true;
    }

    userRequests[userId].push(now);
    return false;
}

module.exports = {isRateLimited};