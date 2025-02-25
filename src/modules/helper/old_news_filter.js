export default function isWithin23Hours(timestamp){
    const match = timestamp.match(/(\d+)\s+(hour|day)s?\s+ago/i);
    if (!match) return false;

    const value = parseInt(match[1],10);
    const unit = match[2].toLowerCase();

    if (unit ==='hour'){
        
        return true
    } else if (unit === 'day'){
        return false
    }
    return false;
}