'use strict'

let gElCanvas
let gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')


}

function renderMeme(meme) {

    const { selectedImgId, selectedLineIdx, lines } = meme
    // const { txt, size, color } = lines[0]

    console.log(selectedImgId);


    if (selectedImgId !== null) {
        const imageIdx = selectedImgId - 1
        const elImg = new Image()
        elImg.src = getImg(imageIdx)
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawLines(lines)
    }

}

function onTxtInput(elTxt) {

    setLineTxt(elTxt)
    renderMeme(gMeme)
}

function drawLine(line) {

    const { txt, size, color } = line
    gCtx.fillStyle = `${color}`
    gCtx.font = `${size}px Arial`

    // gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillText(txt, 200, 100)
    // gCtx.strokeText(txt, 200, 100)

}

function downloadCanvas(elLink) {

    elLink.download = 'my-img'

    const dataUrl = gElCanvas.toDataURL()
    elLink.href = dataUrl
}

function onChangeFontSize(value) {
    changeFontSize(value)
    renderMeme(gMeme)
}

function onChangeColor(value) {
    changeColor(value)
    renderMeme(gMeme)
}


function drawLines(lines) {
    lines.forEach(line => drawLine(line,100,200))
}

function onSwitchLine(){
    switchLine()
    renderMeme(gMeme)
}