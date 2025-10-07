async function main() {
    cleanTemplate();
    let successful = await processGetQuery();

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
    $(`#stickyBar`).empty();
}

async function processGetQuery() {
    let param = new URLSearchParams(window.location.search);
    let successful = false;
    if (param.has('suku')) {
        let suku = param.get('suku');

        console.log(`Getting data for : ${suku}`);

        await $.getJSON('data/data.json', (res) => {
            successful = processData(res, suku);
        }).fail(
            (e) => {
                console.log(e);
            }
        );
    }
    return successful;
}

async function processData(json, suku) {
    let dictionary = json.dict;
    console.log(dictionary);
    let data = null;
    for (let s of dictionary) {
        if (s.name == suku) {
            data = s;
            console.log("data found");
        }
    }
    if (data == null) {
        return false;
    }

    let encyclopedia = $(`#encyclopediaCard`);
    let stickyBar = $(`#stickyBar`);

    let title = createTitle(`SUKU ${data.name.toUpperCase()}`);
    let img = createImage(data.name, data.imgFormat);
    let description = createDescription(data.description);

    encyclopedia.append(title);
    encyclopedia.append(img);
    encyclopedia.append(description);

    let stickyTitle = $(`<div>${title.text()}</div>`);
    stickyBar.append(stickyTitle);

    let stickyList = $(`<ul></ul>`);

    for (let part of data.content) {
        let story = createSubPart('', part.title);

        let title = createTitle(part.title);
        story.append(title);

        for (let paragraph of part.paragraphs) {
            let p = createParagraph(paragraph);
            story.append(p);
        }
        encyclopedia.append(story);

        let link = $(`<li></li>`).append(createLink(part.title, part.title));
        stickyList.append(link);
    }

    stickyBar.append(stickyList);

    let ref = createSubPart('', '');
    let refTitle = createTitle('Referensi');

    ref.append(refTitle);

    let refList = $(`<ul></ul>`);
    for (let reference of data.references) {
        let link = $(`<li><a href="${reference}">${reference}</a></li>`);
        refList.append(link);
    }

    ref.append(refList);
    encyclopedia.append(ref);

    return true;
}

function createTitle(str) {
    return $(`<div class="partTitle">${str}</div>`);
}

function createImage(str, format) {
    return $(`<img id="pagePicture" src="rsc/data/${str}.${format}">`);
}

function createDescription(desc) {
    let sub = createSubPart('', '');

    for (let p of desc) {
        sub.append(createParagraph(p));
    }

    return sub;
}

function createParagraph(p) {
    return $(`<p>${p}</p>`);
}

function createSubPart(sub, id) {
    return $(`<div class="story" id="${id}">${sub}</div>`);
}

function createLink(text, link) {
    return $(`<a href="#${link}">${text}</a>`);
}

main();