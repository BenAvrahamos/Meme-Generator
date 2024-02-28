'use strict'

let gElCanvas
let gCtx

function onInit(){
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
}


function renderMeme(){
    const img = getMeme()
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}