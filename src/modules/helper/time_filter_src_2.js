
/**
 * @description This function checks if the timestamp is within 23 hours from the current time
 * @param {*} timestamp - The timestamp to check. 
 * @returns - Returns true if the timestamp is within 23 hours, otherwise false.
 */

export default function isWithin23HoursSource2(timestamp){
    const date = new Date(timestamp);
    console.log("source 2 date - ", date);
    if(isNaN(date.getTime())){
        return false;
    }
    const now = new Date();

    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours >= 1 && diffHours <= 23;
    
}