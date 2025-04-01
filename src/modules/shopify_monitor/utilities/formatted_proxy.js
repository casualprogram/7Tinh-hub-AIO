export default function formatProxy(proxy) {
    if (!proxy || proxy.replace(/\s/g, '') === "") return null;

    const proxySplit = proxy.split(':');
    if (proxySplit.length > 2) {
        return {
            host: proxySplit[0],
            port: parseInt(proxySplit[1]),
            auth: { username: proxySplit[2], password: proxySplit[3] }
        };
    } else {
        return {
            host: proxySplit[0],
            port: parseInt(proxySplit[1])
        };
    }
}