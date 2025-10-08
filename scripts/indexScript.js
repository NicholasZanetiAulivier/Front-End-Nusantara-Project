const search = $(`#searchInput`);
const filters = {
    weapon: $(`#weapons`),
    dance: $(`#dance`),
    clothes: $(`#clothes`),
    house: $(`#house`),
    food: $(`#food`),
    misc: $(`#misc`),
};

let buttonState = true;
let globalData = {};
let littleDetailLimit = 300;
let searchDescLimit = 400;
let filterHeight;


async function main() {
    let data = getData();

    let carousel = $(`#carousel img`);
    carousel[0].style.opacity = 1;
    doCarouselLoop(carousel);

    addWindowResizeEvent();

    window.onscroll = () => processNavbarScroll($(`#topnavbar`)[0]);
    addEventListenerToFilterButton();
    await setupSearchAndResults(data);


    processData(data);
}

async function getData() {
    return $.getJSON("data/data.json", (res) => {
        return res;
    }).fail((e) => {
        console.log(e);
        return {};
    })
}

async function doCarouselLoop(carousel) {
    var counter = 0;
    var len = carousel.length;
    setInterval(r => {
        carousel[counter].style.opacity = 0;
        counter = (counter + 1) % len;
        carousel[counter].style.opacity = 1;
        console.log(counter);
    }, 5000);
}

function addWindowResizeEvent() {
    $(window).on('resize', () => {
        width = $(window).width();
        if (width <= 1000) {
            littleDetailLimit = 200;
            searchDescLimit = 200;

        } else if (width <= 1500) {
            searchDescLimit = 290;
        } else {
            littleDetailLimit = 300;
            searchDescLimit = 400;
        }

    });
    $(window).trigger('resize');
}

const TOPNAVBAR_LIMIT = 150;
function processNavbarScroll(navbar) {
    if (!(document.body.scrollTop > TOPNAVBAR_LIMIT || document.documentElement.scrollTop > TOPNAVBAR_LIMIT)) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = `-${TOPNAVBAR_LIMIT}px`;
    }
}

function addEventListenerToFilterButton() {
    $(`button`).on('click', (e) => {
        e.preventDefault();
    })

    const height = $(`.filters`).innerHeight() + 10;
    $(`#enableFilters`).on('click', (e) => {
        e.preventDefault();
        buttonState = !buttonState;
        $('#enableFiltersImg').attr(
            'src',
            buttonState ? 'rsc/filter_filled.png' : 'rsc/filter_outline.png'
        );
        $(`.filters`).css('height', buttonState ? `${height}px` : '0');
        $(`.filters`).css('padding-top', buttonState ? '5px' : '0');
        $(`.filters`).css('padding-bottom', buttonState ? '5px' : '0');
        $(`#searchAndResults`).trigger('keyup');
    });
    $(`#enableFilters`).trigger('click');
}

async function processData(data) {
    let res = await data;
    let dict = res.dict;
    globalData = dict;
    let count = dict.length;
    let rand = [];

    //Get random data from json
    //JSON Always has more than 3 elements
    while (rand.length < 3) {
        let randomIndex = Math.floor(Math.random() * count);
        if (rand.includes(randomIndex)) {
            continue;
        }
        rand.push(randomIndex);
    }

    let randomFocused;
    do {
        randomFocused = Math.floor(Math.random() * count);
    } while (rand.includes(randomFocused));

    let round = []
    rand.forEach((val) => {
        round.push(dict[val]);
    })
    process3Randoms(round);
    process1Focused(dict[randomFocused]);
}

function process3Randoms(randoms) {
    let featured = $(`.featuredItems`);
    featured.empty();
    for (let item of randoms) {
        let bigLink = $(`<a href="blogPage.html?suku=${item.name}"></a>`);
        let bigDiv = $(`<div class="items"></div>`);
        bigLink.append(bigDiv);

        let img = $(`<img class="itemImage" src="rsc/data/${item.name}.${item.imgFormat}">`);
        let text = $(`<div class="itemText"></div>`);
        let textTitle = $(`<span class="itemTitle">${item.name[0].toUpperCase() + item.name.slice(1)}</span>`);
        let textDescription = $(`<span class="itemDescription">${item.description[0].slice(0, littleDetailLimit) + "..."}</span>`);

        text.append(textTitle);
        text.append(textDescription);

        bigDiv.append(img);
        bigDiv.append(text);

        featured.append(bigLink);
    }
}

function process1Focused(item) {
    let banner = $(`#randomBanner`).empty();

    let img = $(`<img src="rsc/data/${item.name}.${item.imgFormat}" class="background">`);
    let bigTitle = $(`<div class="left"><span>Artikel Menarik</span></div>`);
    let partTitle = $(`<div class="partTitle">Suku ${item.name[0].toUpperCase() + item.name.slice(1)}</div>`);
    let desc = $(`<div class="description">${item.description[0].slice(0, searchDescLimit) + "..."}</div>`);
    let cont = $(`<a href="blogPage.html?suku=${item.name}"><div>Lanjutkan&#8658;</div></a>`);

    banner.append(img);
    banner.append(bigTitle);
    banner.append(partTitle);
    banner.append(desc);
    banner.append(cont);
}

async function setupSearchAndResults(data) {
    $(`#results`).empty();
    globalData = await data;
    globalData = globalData.dict;

    $(`#searchAndResults`).on('keyup', (e) => {
        let res = [];
        const searchReg = new RegExp(search.val());
        for (let i of globalData) {
            if (searchReg.test(i.name)) {
                res.push(i);
            }
        }

        if (buttonState) {
            for (let i in filters) {
                if (filters[i].val()) {
                    const reg = new RegExp(filters[i].val());
                    res = res.filter((data) => data.tags[i].some((val) => reg.test(val)));
                }
            }
        }
        res.sort();
        updateResults(res);
    });

    $(`#searchAndResults`).trigger('keyup');
}

function updateResults(data) {
    let res = $(`#results`).empty();
    if (data.length == 0) {
        res.append($(`<div class="nothingFound">Belum ada hasil</div>`));
    }

    for (let i of data) {
        let link = $(`<a href="blogPage.html?suku=${i.name}"></a>`);
        let div = $(`<div class="item"></div>`);
        let img = $(`<img src="rsc/data/${i.name}.${i.imgFormat}">`);
        let text = $(`<div class="text"></div>`);
        let textTitle = $(`<div class="title">Suku ${i.name[0].toUpperCase() + i.name.slice(1)}</div>`);
        let textDescription = $(`<p></p>`).text(i.description[0].slice(0, searchDescLimit) + "...");

        text.append(textTitle);
        text.append(textDescription);

        div.append(img);
        div.append(text);
        link.append(div);

        res.append(link);
    }
}

main();