'use strict'

renderGallery()
function renderGallery() {
    const elGallery = document.querySelector('.gallery-img-container')

    const imgs = getImg()
    console.log(imgs.id);
    const strHtml = imgs.map(img => `<img class= "gallery-img"src="img/${img.id}.jpg" id="${img.id}" onclick="onSelectImg(id)" />`

    )


    elGallery.innerHTML = strHtml.join('')
}



function onSelectImg(id) {
    setImg(id)
    renderMeme(gMeme)
    switchSection()
}

