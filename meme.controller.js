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




    if (selectedImgId !== null) {
        const imageIdx = selectedImgId - 1
        const elImg = new Image()
        elImg.src = getImg(imageIdx)
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawLines(lines, selectedLineIdx)
    }

}

function onTxtInput(elTxt) {

    setLineTxt(elTxt)
    renderMeme(gMeme)
}

function drawLine(line, indx) {

    const margin = indx * 50

    const { txt, size, color } = line
    gCtx.fillStyle = `${color}`
    gCtx.font = `${size}px Arial`

    // gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillText(txt, 200, 100 + margin)
    // gCtx.strokeText(txt, 200, 100)




    if (indx === gMeme.selectedLineIdx) {
        const textAspects = gCtx.measureText(txt)

        const textHight = textAspects.actualBoundingBoxAscent +
            textAspects.actualBoundingBoxDescent + 5

        const textWidth = textAspects.width

        const x = 200
        const y = 100 - textAspects.actualBoundingBoxAscent
            + margin

        gCtx.strokeRect(x, y, textWidth, textHight)

        setLineCoords(indx,x,y,textWidth,textHight)
    }



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
    lines.map((line, index) => drawLine(line, index))
}

function onSwitchLine() {
    switchLine()
    renderMeme(gMeme)
}

function onAddLine() {
    addLine()
    renderMeme(gMeme)
}