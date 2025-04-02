

// Custom logging function with timestamp (local to this module)
export default function logWithTimestamp(...args) {
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    });
    console.log(`[${timestamp}]`, ...args); // Uses original console.log
}