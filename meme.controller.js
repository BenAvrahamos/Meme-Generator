'use strict'

let gElCanvas
let gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

}

function renderMeme(idx) {
    const elImg = new Image()
    elImg.src = getImg(idx)
    console.log(idx);

    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)


    drawText(200, 100)
}

function onTxtInput(elTxt) {

    setLineTxt(elTxt)
}

function drawText(x, y) {

    const { txt, size, color } = gMeme.lines[0]
    gCtx.fillStyle = `${color}`
    gCtx.font = `${size}px Arial`

    // gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillText(txt, x, y)
    // gCtx.strokeText(txt, x, y)

}

