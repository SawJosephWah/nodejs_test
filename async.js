function getdata(id, callback) {
    setTimeout(() => {
        callback(id)
    }, 4000);
}

function getanotherdata(id, callback) {
    setTimeout(() => {
        callback(id)
    }, 4000);
}

function getlatestdata(id, callback) {
    setTimeout(() => {
        callback(id)
    }, 4000);
}

getdata(6, (id) => {
    let result = id;
    getanotherdata(result, (payload) => {
        let result = payload;
        getlatestdata(result, (payload) => {
            console.log(payload);
        });
    })
})


