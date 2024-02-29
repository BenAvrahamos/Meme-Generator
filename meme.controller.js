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
    const gMeme = getGMeme()
    renderMeme(gMeme)
}

function drawLine(line, indx,) {
    let txtPosX
    let align
    const gMeme = getGMeme()


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

    const { txt, size, color, stroke } = line
    gCtx.fillStyle = `${color}`
    gCtx.font = `${size}px Arial`

    gCtx.textAlign = align
    gCtx.textBaseline = 'middle'

    if (align === 'right') gCtx.direction = 'rtl'
    else gCtx.direction = 'ltr'


    gCtx.fillText(txt, txtPosX, line.posY)
    

    if (stroke === true) {

        gCtx.lineWidth = 3
        gCtx.strokeStyle = 'Black'
        gCtx.setLineDash([0])

        gCtx.strokeText(txt, txtPosX, line.posY)
    }

    if (indx === gMeme.selectedLineIdx) {
        drawBorder(txtPosX, line.posY, margin, txt, indx, align)
    }

}


function drawBorder(txtPosX, txtPosY, margin, txt, indx, align) {
    let textAspects = gCtx.measureText(txt)
    let textHight = textAspects.actualBoundingBoxAscent + textAspects.actualBoundingBoxDescent + 30
    let textWidth = textAspects.width
    let x = txtPosX - textAspects.actualBoundingBoxRight
    let y = txtPosY - textAspects.actualBoundingBoxAscent - 15

    if (align === 'right') x = txtPosX - textWidth - textAspects.actualBoundingBoxRight
    else if (align === 'left') x = txtPosX


    gCtx.lineWidth = 2
    gCtx.strokeStyle = '#47526C'
    gCtx.setLineDash([10])

    gCtx.strokeRect(x, y, textWidth, textHight)
    setLineCoords(indx,x,y,textWidth, textHight)
    

}


function downloadCanvas(elLink) {
    const dataUrl = gElCanvas.toDataURL()
    elLink.download = 'my-img'
    elLink.href = dataUrl
}

function onChangeFontSize(value) {
    const gMeme = getGMeme()
    changeFontSize(value)
    renderMeme(gMeme)
}

function onChangeColor(value) {
    const gMeme = getGMeme()
    changeColor(value)
    renderMeme(gMeme)
}

function drawLines(lines) {

    lines.map((line, index) => drawLine(line, index))
}

function onSwitchLine() {
    const gMeme = getGMeme()
    if (!gMeme.lines.length) return
    switchLine()
    updateSettings()
    renderMeme(gMeme)
}

function onAddLine() {
    const gMeme = getGMeme()
    addLine(gElCanvas)
    renderMeme(gMeme)
    updateSettings()
}

function onToggleStroke(value) {
    const gMeme = getGMeme()
    toggleStroke(value)
    renderMeme(gMeme)
}

function onAlignText(dir) {
    const gMeme = getGMeme()
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
    const gMeme = getGMeme()
    const clickPos = getEvPos(ev)
    gMeme.lines.forEach((line, idx) => {
        const { borderStartX, borderStartY, borderEndX, borderEndY } = line





        if (clickPos.x >= borderStartX &&
            clickPos.x <= borderEndX &&
            clickPos.y >= borderStartY &&
            clickPos.y <= borderEndY) {
            switchWithClick(idx)
            renderMeme(gMeme)
            updateSettings()
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

function updateSettings() {
    const gMeme = getGMeme()
    const { txt, color, stroke } = gMeme.lines[gMeme.selectedLineIdx]
    const elSettings = document.querySelector('.editor-options')


    elSettings.querySelector('input').value = txt

    if (stroke) elSettings.querySelector('input[type="checkbox"]').checked = true
    else elSettings.querySelector('input[type="checkbox"]').checked = false

    elSettings.querySelector('input[type="color"]').value = color

}


function onMoveKeyUp(value){

    moveKeyUp(value)
    renderMeme(gMeme)
}

function onDeleteLine(){
    deleteLine()

    renderMeme(gMeme)
}
