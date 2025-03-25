

/**
 * use for Sleep / delay purpose for shopify only.
 * @returns sleep time out
 */
export default function sleep(){
    return new Promise(resolve => {
        setTimeout(resolve,ms);
    })
}
