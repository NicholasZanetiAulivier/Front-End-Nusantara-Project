var buttonState = true;
async function main() {
    let data = getData();

    var carousel = $(`#carousel img`);
    carousel[0].style.opacity = 1;
    doCarouselLoop(carousel);

    window.onscroll = processScroll;
    addEventListenerToFilterButton();

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

const TOPNAVBAR_LIMIT = 150;
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

function processScroll() {
    processNavbarScroll($(`#topnavbar`)[0]);
}

function processNavbarScroll(navbar) {
    if (!(document.body.scrollTop > TOPNAVBAR_LIMIT || document.documentElement.scrollTop > TOPNAVBAR_LIMIT)) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = `-${TOPNAVBAR_LIMIT}px`;
    }
}

function addEventListenerToFilterButton() {
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
    });
    $(`#enableFilters`).click();
}

async function processData(data) {
    let res = await data;
    let dict = res.dict;
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

    let round = []
    rand.forEach((val) => {
        round.push(dict[val]);
    })
    process3Randoms(round);
}

function process3Randoms(randoms) {
    console.log(randoms);
    let featured = $(`.featuredItems`);
    featured.empty();
    for (let item of randoms) {
        let bigLink = $(`<a href="blogPage.html?suku=${item.name}"></a>`);
        let bigDiv = $(`<div class="items"></div>`);
        bigLink.append(bigDiv);

        let img = $(`<img class="itemImage" src="rsc/data/${item.name}.${item.imgFormat}">`);
        let tags = $(`<div class="tags"></div>`);
        let text = $(`<div class="itemText"></div>`);
        let textTitle = $(`<span class="itemTitle">${item.name[0].toUpperCase() + item.name.slice(1)}</span>`);
        let textDescription = $(`<span class="itemDescription">${item.description[0].slice(0, 300) + "..."}</span>`);

        text.append(textTitle);
        text.append(textDescription);

        bigDiv.append(img);
        bigDiv.append(tags);
        bigDiv.append(text);

        featured.append(bigLink);
    }
}

main();