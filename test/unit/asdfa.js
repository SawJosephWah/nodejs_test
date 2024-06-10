function calculateSquare() {

}

test(`should throw an error if called without an arg`, () => {
    let object1 = {
        name: "joseph",
        age: 26,
        major: 'ICT',
        married: false
    }

    let object2 = {
        age: 26,
        name: "joseph"
    }

    expect(object2).toMatchObject(object1);
    // expect(object2).toEqual(object1);

})
