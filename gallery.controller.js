'use strict'

renderGallery()
function renderGallery() {

    const elGallery = document.querySelector('.gallery')

    const strHtml =
        `<img src="img/1.jpg" id="1" onclick="onSelectImg(id)" />
        <img src="img/2.jpg" id="2" onclick="onSelectImg(id)" />`

    elGallery.innerHTML = strHtml
}



function onSelectImg(id) {
    setImg(id)
}

