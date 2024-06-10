const add = (a, b) => {
    console.log(a + b);
}

const multiply = (a, b) => {
    console.log(a * b);
}

const divided = (a, b) => {
    console.log(a / b);
}

const substract = (a, b) => {
    console.log(a - b);
}

const log = (fn) => {
    console.log(`${fn.name} is fired`);
    return fn;
}

const addWithLog = log(add);
addWithLog(2, 5);

const multiplyWithLog = log(multiply);
multiplyWithLog(2, 5);

const divideWithLog = log(divided);
divideWithLog(100, 5);

const substractWithLog = log(substract);
substractWithLog(10, 5);

