var buttonState = true;
function main() {
    var carousel = $(`#carousel img`);
    carousel[0].style.opacity = 1;
    doCarouselLoop(carousel);

    window.onscroll = processScroll;
    addEventListenerToFilterButton();
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
    console.log(navbar);
    if (!(document.body.scrollTop > TOPNAVBAR_LIMIT || document.documentElement.scrollTop > TOPNAVBAR_LIMIT)) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = `-${TOPNAVBAR_LIMIT}px`;
    }
}

function addEventListenerToFilterButton() {
    const height = $(`.filters`).innerHeight() + 10;
    $(`#enableFilters`).on('click', () => {
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

main();