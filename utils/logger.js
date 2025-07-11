function log(message) {
    const time = new Date().toISOString();
    console.log(`[${time}] ${message}`);
}

module.exports = {log};