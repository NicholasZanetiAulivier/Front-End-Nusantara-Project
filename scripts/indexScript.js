function main() {
    var carousel = $(`#carousel img`);
    carousel[0].style.opacity = 1;
    doCarouselLoop(carousel);

    window.onscroll = processScroll;
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

function processScroll() {
    processNavbarScroll($(`#topnavbar`)[0]);
}

function processNavbarScroll(navbar) {
    console.log(navbar);
    if (!(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100)) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = "-100px";
    }
}

main();