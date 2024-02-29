'use strict'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['presidents', 'awkward'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dogs', 'funny', 'animals'] },
    { id: 3, url: 'img/3.jpg', keywords: ['cute', 'dogs', 'animals'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cute', 'cat', 'animals'] },
    { id: 5, url: 'img/5.jpg', keywords: ['cute', 'funny','kids'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny', 'funny', 'smart'] },
    { id: 7, url: 'img/7.jpg', keywords: ['cute', 'funny','kids'] },
    { id: 8, url: 'img/8.jpg', keywords: ['awkward', 'funny'] },
    { id: 9, url: 'img/9.jpg', keywords: ['cute', 'funny','kids'] },
    { id: 10, url: 'img/10.jpg', keywords: ['presidents', 'funny'] },
    { id: 11, url: 'img/11.jpg', keywords: ['dogs', 'funny'] },
    { id: 12, url: 'img/12.jpg', keywords: ['dogs', 'funny'] },
    { id: 13, url: 'img/13.jpg', keywords: ['dogs', 'funny'] },
]

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'text',
            size: 80,
            color: 'White',
            stroke : false,
            posX: null,
            posY: null,
            textWidth: null,
            textHight: null
        },
    ]
}

function getImg(){
    return gImgs
}

function getImgByIdx(idx = null) {
    if (idx !== null) {
        return gImgs[idx].url
    }
}


function setLineTxt(elTxt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = elTxt




}

function setImg(id) {
    gMeme.selectedImgId = id

}

function changeFontSize(value) {

    gMeme.lines[gMeme.selectedLineIdx].size += value
}

function changeColor(value) {
    gMeme.lines[gMeme.selectedLineIdx].color = value

    renderMeme(gMeme)
}

function switchLine() {
    gMeme.selectedLineIdx += 1
    if (gMeme.selectedLineIdx > gMeme.lines.length - 1)
        gMeme.selectedLineIdx = 0

}

function switchWithClick(idx) {

    gMeme.selectedLineIdx = idx

}

function toggleStroke(value){
    gMeme.lines[gMeme.selectedLineIdx].stroke = value

}


function addLine() {
    gMeme.lines.push(
        {
            txt: 'text',
            size: 40,
            color: 'White',
            stroke : false,
            posX: null,
            posY: null,
            textWidth: null,
            textHight: null

        }
    )
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function setLineCoords(indx, x, y, textWidth, textHight) {

    const currLine = gMeme.lines[indx]
    currLine.posX = x
    currLine.posY = y
    currLine.textWidth = textWidth
    currLine.textHight = textHight

}