'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    addListeners()
    gElCanvas.addEventListener('click', onClick)
    gElCanvas.addEventListener('click', onClick)
}

function renderMeme(meme) {

    const { selectedImgId, selectedLineIdx, lines } = meme

    if (selectedImgId !== null) {
        const imageIdx = selectedImgId - 1
        const elImg = new Image()
        elImg.src = getImgByIdx(imageIdx)
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        drawLines(lines, selectedLineIdx)
    }
}

function onTxtInput(elTxt) {
    setLineTxt(elTxt)
    renderMeme(gMeme)
}

function drawLine(line, indx) {
    let txtPosX
    let align


    switch (line.alignment) {
        case 'center':
            txtPosX = gElCanvas.width / 2
            align = 'center'

            break;
        case 'left':
            txtPosX = gElCanvas.width / 6
            align = 'left'

            break;

        case 'right':
            txtPosX = gElCanvas.width / 1.2
            align = 'right'

            break;
    }

    const margin = indx * gElCanvas.height / 8


    const txtPosY = gElCanvas.height / 8

    const { txt, size, color, stroke } = line
    gCtx.fillStyle = `${color}`
    gCtx.font = `${size}px Arial`

    gCtx.textAlign = align
    gCtx.textBaseline = 'middle'

    if (align === 'right') gCtx.direction = 'rtl'
    else gCtx.direction = 'ltr'
   
    gCtx.fillText(txt, txtPosX, txtPosY + margin)


    if (stroke === true) {

        gCtx.lineWidth = 3
        gCtx.strokeStyle = 'Black'
        gCtx.setLineDash([0])
       
        gCtx.strokeText(txt, txtPosX, txtPosY + margin)
    }

    if (indx === gMeme.selectedLineIdx) {
        drawBorder(txtPosX, txtPosY, margin, txt, indx, align)
    }

}


function drawBorder(txtPosX, txtPosY, margin, txt, indx,align) {
    let textAspects = gCtx.measureText(txt)

    let textHight = textAspects.actualBoundingBoxAscent + textAspects.actualBoundingBoxDescent + 30
    let textWidth = textAspects.width
    let x = txtPosX - textAspects.actualBoundingBoxRight
    let y = txtPosY - textAspects.actualBoundingBoxAscent - 15 + margin

    if (align === 'right' ) textWidth = -textWidth
    if (align === 'left') x = txtPosX + margin
    

    gCtx.lineWidth = 2
    gCtx.strokeStyle = '#47526C'
    gCtx.setLineDash([10])
    console.log('start', x);
    console.log('end', textWidth);
    
    gCtx.strokeRect(x, y, textWidth, textHight)
    setLineCoords(indx, x, y, textWidth, textHight)

}


function downloadCanvas(elLink) {
    const dataUrl = gElCanvas.toDataURL()
    elLink.download = 'my-img'
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

function onToggleStroke(value) {
    toggleStroke(value)
    renderMeme(gMeme)
}

function onAlignText(dir){
    alignText(dir)
    renderMeme(gMeme)
}

function addListeners() {
    // gElCanvas.addEventListener('mousedown', onStartLine)
    // gElCanvas.addEventListener('mousemove', onDrawLine)
    // gElCanvas.addEventListener('mouseup', onEndLine)
    // gElCanvas.addEventListener('touchstart', onStartLine)
    // gElCanvas.addEventListener('touchmove', onDrawLine)
    // gElCanvas.addEventListener('touchend', onEndLine)
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    if (TOUCH_EVS.includes(ev.type)) {
        // Gets the first touch point
        ev.preventDefault()
        ev = ev.changedTouches[0]
        // Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function onClick(ev) {
    const clickPos = getEvPos(ev)
    gMeme.lines.forEach((line, idx) => {
        const { posX, posY, textHight, textWidth } = line

        if (clickPos.x >= posX &&
            clickPos.x >= posX &&
            clickPos.x <= posX + textWidth &&
            clickPos.y >= posY &&
            clickPos.y <= posY + textHight) {
            switchWithClick(idx)
            renderMeme(gMeme)
        }
    });
}

function switchSection() {
    const elGallery = document.querySelector('.gallery')
    const elEditor = document.querySelector('.editor')
    const elNavBtnTxt = document.querySelector('.nav-btn span')


    elGallery.classList.toggle('hide')
    elEditor.classList.toggle('hide')

    if (elNavBtnTxt.innerText === 'To The Editor') elNavBtnTxt.innerText = 'Back To \nThe Gallery'
    else elNavBtnTxt.innerText = 'To The Editor'

}