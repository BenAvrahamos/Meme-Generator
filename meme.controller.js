'use strict'

let gElCanvas
let gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

}

function renderMeme(gMeme) {

    const { selectedImgId, selectedLineIdx, lines } = gMeme
    const { txt, size, color } = lines[0]

    const elImg = new Image()
    elImg.src = getImg(selectedImgId-1)

    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)


    drawText(selectedLineIdx, 200, 100)
}

function onTxtInput(elTxt) {

    setLineTxt(elTxt)
}

function drawText(idx = 0, x, y) {

    const { txt, size, color } = gMeme.lines[idx]
    gCtx.fillStyle = `${color}`
    gCtx.font = `${size}px Arial`

    // gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillText(txt, x, y)
    // gCtx.strokeText(txt, x, y)

}


function downloadCanvas(elLink) {
    
    elLink.download = 'my-img'

    const dataUrl = gElCanvas.toDataURL()
    elLink.href = dataUrl
}

