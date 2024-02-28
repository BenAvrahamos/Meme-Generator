'use strict'

renderGallery()
function renderGallery() {
    const elGallery = document.querySelector('.gallery')

    const imgs = getImg()
    console.log(imgs.id);
    const strHtml = imgs.map(img => `<img src="img/${img.id}.jpg" id="${img.id}" onclick="onSelectImg(id)" />`

    )


    elGallery.innerHTML = strHtml
}



function onSelectImg(id) {
    setImg(id)
    renderMeme(gMeme)
}

