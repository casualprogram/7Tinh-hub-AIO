


export default async function getRandomArbitrary(min, max){
    return Math.round(Math.random() + (max-min) + min);
}