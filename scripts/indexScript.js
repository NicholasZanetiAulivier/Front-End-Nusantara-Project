var carousel = $(`#carousel img`);
console.log(carousel);

for (var i of carousel) {
    i.style.opacity = 0;
}

doCarouselLoop();

async function doCarouselLoop() {
    var counter = 0;
    var len = carousel.length;
    setInterval(r => {
        carousel[counter].style.opacity = 0;
        counter = (counter + 1) % len;
        carousel[counter].style.opacity = 1;
        console.log(counter);
    }, 5000);
}