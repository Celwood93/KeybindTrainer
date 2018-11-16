export function pickRandomElement(givenThis){
    const randomKey = givenThis.state.keys[
        Math.floor(Math.random() * givenThis.state.keys.length)
    ];
    givenThis.setState({ key: randomKey });
};