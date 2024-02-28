'use strict'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['trump', 'president'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dogs', 'funny'] }
]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: '',
            size: 20,
            color: 'White'
        }
    ]
}


function getImg(idx = 0) {
    return gImgs[idx].url
}

function setLineTxt(elTxt) {
    gMeme.lines[0].txt = elTxt


}

function setImg(id) {
    gMeme.selectedImgId = id

}

function changeFontSize(value) {

    gMeme.lines[0].size += value
}

function changeColor(value) {
    gMeme.lines[0].color = value

    renderMeme(gMeme)
}