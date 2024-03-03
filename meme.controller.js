'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gStartPos
let gElCanvas
let gCtx
let gDownloadable = false

const emojis = {
    emojis: ['😁', '😊', '😂', '🤣', '❤', '😍', '😒', '👌', '😘', '💕', '👍', '😎', '😉', '🤞', '✌', '🎂'],
    page: { idx: 0, containerSize: 4 }
}

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
    addListeners()
    onRenderEmojis()
    renderMeme()
}

function addListeners() {
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderMeme()
    })
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function onRenderEmojis(value = 0) {
    emojis.page.idx += value
    if (emojis.page.idx === 4) emojis.page.idx = 0
    if (emojis.page.idx === -1) emojis.page.idx = 3

    const elEmojis = document.querySelector('.emojis')
    const startIdx = emojis.page.idx * emojis.page.containerSize

    const slicedEmojis = emojis.emojis.slice(startIdx, startIdx + emojis.page.containerSize)

    const strHTMLs = slicedEmojis.map(emoji =>
        `<button class="emoji" onclick="onDrawEmoji('${emoji}')">${emoji}</button>`)

    elEmojis.innerHTML = strHTMLs.join('')
}

function onDrawEmoji(emoji) {
    const gMeme = getGMeme()
    if (!gMeme.lines.length) return
    drawEmoji(emoji)
    updateSettings()
    renderMeme()
}

function onDown(ev) {
 
    const clickPos = getEvPos(ev)
    gMeme.lines.forEach((line, idx) => {
        const { borderStartX, borderStartY, borderEndX, borderEndY } = line


        if (clickPos.x >= borderStartX &&
            clickPos.x <= borderEndX &&
            clickPos.y >= borderStartY &&
            clickPos.y <= borderEndY) {
            gStartPos = clickPos
            switchWithClick(idx)
            renderMeme()
            updateSettings()
            setMemeIsDrag(true)
        }
    });
}

function onMove(ev) {
    if (!gMeme.lines.length) return
    if (!gMeme.lines[gMeme.selectedLineIdx].isDrag) return

    const dragPos = getEvPos(ev)
    const dx = dragPos.x - gStartPos.x
    const dy = dragPos.y - gStartPos.y
    gStartPos = dragPos
    renderMeme()
    moveLine(dx, dy)
}

function onUp() {
    setMemeIsDrag(false)
    gStartPos = ''

}


function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')

    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight

    resizeLineByCanvas(gElCanvas.width)
}

function renderMeme() {


    const { selectedImgId, selectedLineIdx, lines } = getGMeme()
    if (selectedImgId !== null) {
        const imageIdx = selectedImgId - 1
        const elImg = new Image()
        elImg.src = getImgByIdx(imageIdx)
        elImg.onload = () => {
            gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
            drawLines(lines, selectedLineIdx)
        }
    }

}

function onTxtInput(elTxt) {
    if (!gMeme.lines.length) addLine(gElCanvas)
    setLineTxt(elTxt)

    renderMeme()
}

function drawLine(line, indx,) {
    const gMeme = getGMeme()
    
    
    const { txt, size, color, stroke, posX, posY, alignment } = line
    gCtx.fillStyle = `${color}`
    gCtx.font = `${size}px Arial`


    gCtx.textAlign = alignment
    gCtx.textBaseline = 'middle'

    if (alignment === 'right') gCtx.direction = 'rtl'
    else gCtx.direction = 'ltr'

    gCtx.fillText(txt, posX, posY)

    if (stroke === true) {

        gCtx.lineWidth = gElCanvas.height / 200
        gCtx.strokeStyle = 'Black'
        gCtx.setLineDash([0])

        gCtx.strokeText(txt, line.posX, line.posY)
    }

    if (indx === gMeme.selectedLineIdx && !gDownloadable) {
        drawBorder(line.posX, line.posY, txt, indx, line.alignment)
    }
}

function drawBorder(txtPosX, txtPosY, txt, indx, align) {

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
    setLineCoords(indx, x, y, textWidth, textHight)
}

function downloadCanvas(elLink) {
    gDownloadable = true
    renderMeme(gMeme)
    const dataUrl = gElCanvas.toDataURL()
    elLink.download = 'my-meme'
    elLink.href = dataUrl
    gDownloadable = false
    renderMeme(gMeme)
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
if (!gMeme.lines.length) return
    toggleStroke(value)
    renderMeme()
}

function onAlignText(dir) {
    alignText(dir)
    renderMeme()
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {

        ev.preventDefault()
        ev = ev.changedTouches[0]


        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop - 100,
        }
    }
    return pos
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
    const elSettings = document.querySelector('.editor-options')
    if (!gMeme.lines.length) {
        elSettings.querySelector('input').value = ''
        return
    }
    let { txt, color, stroke } = gMeme.lines[gMeme.selectedLineIdx]

    if (txt === 'text') txt = null

    elSettings.querySelector('input').value = txt

    if (stroke) elSettings.querySelector('input[type="checkbox"]').checked = true
    else elSettings.querySelector('input[type="checkbox"]').checked = false

    elSettings.querySelector('input[type="color"]').value = color

}

function onMoveKeyUp(value) {
    moveKeyUp(value)
    renderMeme(gMeme)
}

function onDeleteLine() {
    deleteLine()
    renderMeme(gMeme)
}

