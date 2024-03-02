'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gStartPos

let gElCanvas
let gCtx


function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderGallery()

    addListeners()

}

function addListeners() {
    window.addEventListener('resize', () => {
		resizeCanvas()
		renderMeme(gMeme)
	})
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)

}

function onDown(ev){
    const gMeme = getGMeme()
    const clickPos = getEvPos(ev)
    gMeme.lines.forEach((line, idx) => {
        const { borderStartX, borderStartY, borderEndX, borderEndY } = line


        if (clickPos.x >= borderStartX &&
            clickPos.x <= borderEndX &&
            clickPos.y >= borderStartY &&
            clickPos.y <= borderEndY) {
                gStartPos = clickPos
            switchWithClick(idx)
            renderMeme(gMeme)
            updateSettings()
            setMemeIsDrag(true)
        }
    });

}

function onMove(ev){
    const gMeme = getGMeme()
    if (!gMeme.lines[gMeme.selectedLineIdx].isDrag) return
    
    const dragPos = getEvPos(ev)
    const dx = dragPos.x - gStartPos.x
	const dy = dragPos.y - gStartPos.y
    gStartPos = dragPos
    renderMeme(gMeme)
    moveLine(dx, dy)
}

function onUp(){
    setMemeIsDrag(false)
    gStartPos = ''

}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    console.log();

    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
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
    let align =line.alignment
    const gMeme = getGMeme()

    const margin = indx * gElCanvas.height / 8

    const { txt, size, color, stroke } = line
    gCtx.fillStyle = `${color}`
    gCtx.font = `${size}px Arial`

    gCtx.textAlign = align
    gCtx.textBaseline = 'middle'

    if (align === 'right') gCtx.direction = 'rtl'
    else gCtx.direction = 'ltr'


    gCtx.fillText(txt, line.posX, line.posY)


    if (stroke === true) {

        gCtx.lineWidth = 3
        gCtx.strokeStyle = 'Black'
        gCtx.setLineDash([0])

        gCtx.strokeText(txt, line.posX, line.posY)
    }

    if (indx === gMeme.selectedLineIdx) {
        drawBorder(line.posX, line.posY, margin, txt, indx, align)
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
    setLineCoords(indx, x, y, textWidth, textHight)


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



function getEvPos(ev) {
	let pos = {
		x: ev.offsetX,
		y: ev.offsetY,
	}

	if (TOUCH_EVS.includes(ev.type)) {
		
		ev.preventDefault()         // Prevent triggering the mouse events
		ev = ev.changedTouches[0]   // Gets the first touch point

		// Calc pos according to the touch screen
		pos = {
			x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
			y: ev.pageY - ev.target.offsetTop - ev.target.clientTop -100,
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
    const { txt, color, stroke } = gMeme.lines[gMeme.selectedLineIdx]
    const elSettings = document.querySelector('.editor-options')


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


// function onSaveCanvas(){
//     var image = new Image()
//     image.src =gElCanvas.toDataURL()
//     saveCanvas(image)
     

// }