async function main() {
    // cleanTemplate();
    let successful = processGetQuery();

    //Error code
    if (!successful) {
        noSukuFoundError();
        throw new Error(`Something has gone wrong!`);
    }
}

function noSukuFoundError() {
    let content = $(`#content`);
    content.empty();
    content.append($(`<span>Something has gone wrong!</span>`));
    content.height(`100vh`);
}

function cleanTemplate() {
    $(`#encyclopediaCard`).empty();
    $(`stickyBar`).empty();
}

function processGetQuery() {
    let param = new URLSearchParams(window.location.search);
    let successful = false;
    if (param.has('suku')) {
        let suku = param.get('suku');
        console.log(suku);
        successful = true;
    }
    return successful;
}

main();