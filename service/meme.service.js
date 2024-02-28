'use strict'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['trump', 'president'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dogs', 'funny'] }
]

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: '',
            size: 20,
            color: 'Black'
        },

        {
            txt: '',
            size: 20,
            color: 'Black'
        }
    ]
}


function getImg(idx = null) {
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