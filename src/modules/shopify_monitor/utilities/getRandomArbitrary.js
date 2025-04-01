export default function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min); // Fixed typo in formula
}