


/**
 * isWithin23HoursSource1
 * @description This function checks if the timestamp is within 23 hours. 
 * @param {*} timestamp  - The timestamp to check.
 * @returns  - Returns true if the timestamp is within 23 hours, otherwise false.
 */
export default function isWithin23HoursSource1(timestamp){
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



