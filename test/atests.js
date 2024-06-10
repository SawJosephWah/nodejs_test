describe('my beverage', () => {

    let id = 0;
    it('is delicious', () => {
        id = 1;
    });

    it('is not sour', () => {
        id = 2;
    });



    beforeEach(() => {
        // console.log('Before each');
    })

    afterEach(() => {
        console.log(id);
    })
});