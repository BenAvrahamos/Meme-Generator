'use strict'

function renderGallery() {
    const elGallery = document.querySelector('.gallery-img-container')

    const imgs = getImg()
   
    const strHtml = imgs.map(img => `<img class= "gallery-img"src="img/${img.id}.jpg" id="${img.id}" onclick="onSelectImg(id)" />` )
    elGallery.innerHTML = strHtml.join('')
}

function onSelectImg(id) {
    setImg(id)
    renderMeme()
    switchSection()
}

function onRandomImg(){
    const imgsCount =getImg().length
    
    onSelectImg(getRandomInt(1,imgsCount))
}

function onFilterImgs(category){
    filterImgs(category)
    renderGallery()
}

function onClearFilter(){
    const elFilter =document.querySelector('.filter input')
    elFilter.value=''

    clearFilter()
    renderGallery()
}