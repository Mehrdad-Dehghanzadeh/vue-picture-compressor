import cropperEvent  from "./cropperEvent"
import {
    Canvas,
    drawImage,
    element,
    deleteCanvas,
    createNewImage,
    NewImage,
    imageSettings,
    setSizeFactors,
    updateDetails
} from "./image";
import { $, removeNode } from './helper'

let cropper = null

export let coordinates = {
    width: imageSettings.width,
    height: imageSettings.height,
    left: 0,
    top: 0
}

export function closeEditor(event) {
    if(event) {
        clearInput()
    }
    if ($('.my-image')) {
        removeNode($('.my-image'))
    }
}

export function clearInput(el) {
    if(element) {
        element.value = ''
    }
    if (el) {
        el.value = ''
    }
    window.onresize = null
    window.onmouseup = null
}

export function changeCoordinate(object) {
    coordinates = { ...coordinates, ...object }
}

export function crop() {
    if(coordinates) {
        let setting = settingCropping(NewImage)
        deleteCanvas()
        drawImage(setting)
        createNewImage( setting.width, setting.height)
        $('.image-wrapper').appendChild(Canvas)
        cropperEvent.clearEvents()
        updateDetails(setting)
    }
}

function settingCropping() {
    setSizeFactors()
    const newWidth = (imageSettings.nw === 1) ? coordinates.width : Math.ceil(imageSettings.nw * coordinates.width)
    const newHeight = (imageSettings.nh === 1) ? coordinates.height : Math.ceil(imageSettings.nh * coordinates.height)
    const newLeft = (imageSettings.nw === 1) ? coordinates.left : Math.ceil(imageSettings.nw * coordinates.left)
    const newTop = (imageSettings.nh === 1) ? coordinates.top : Math.ceil(imageSettings.nh * coordinates.top)

    return {
        width: newWidth,
        height: newHeight,
        top: newTop,
        left: newLeft
    }
}

function clientInit(event) {
    event = (event) ? event : window.event
    if(cropperEvent.EVENT === 'onmousemove') {
        let cursor = 'move'
        if (event.target.classList[1] === 'cropper-handler-bullet--horizontal') {
            cursor = 'n-resize'
        }
        if (event.target.classList[1] === 'cropper-handler-bullet--vertical') {
            cursor = 'e-resize'
        }
        $('body').style.cursor = cursor
        $('.image-cropper').style.cursor = cursor
    }
    if(cropperEvent.EVENT === 'ontouchmove') {
        event.preventDefault()
    }
}

export default {
    move(event, callback) {
        clientInit(event)
        let clientX = (cropperEvent.EVENT === 'onmousemove') ?  event[cropperEvent.CLIENT_X] : event[cropperEvent.CLIENT_X][0].clientX
        let clientY = (cropperEvent.EVENT === 'onmousemove') ?  event[cropperEvent.CLIENT_Y] : event[cropperEvent.CLIENT_Y][0].clientY
        cropper = document.querySelector('.image-cropper')

        cropper[cropperEvent.EVENT] = (e) => {
            let dtX = (cropperEvent.EVENT === 'onmousemove') ? (clientX - e[cropperEvent.CLIENT_X]) : (clientX - e[cropperEvent.CLIENT_X][0].clientX)
            clientX = (cropperEvent.EVENT === 'onmousemove') ? e[cropperEvent.CLIENT_X] : e[cropperEvent.CLIENT_X][0].clientX
            let dtY = (cropperEvent.EVENT === 'onmousemove') ? (clientY - e[cropperEvent.CLIENT_Y]) : (clientY - e[cropperEvent.CLIENT_Y][0].clientY)
            clientY = (cropperEvent.EVENT === 'onmousemove') ? e[cropperEvent.CLIENT_Y] : e[cropperEvent.CLIENT_Y][0].clientY
            if (cropperEvent.validate.bottom(dtY)) {
                if (cropper.offsetTop - dtY >= 0) {
                    cropper.top = cropper.offsetTop - dtY
                } else { cropper.top = 0  }
            }
            if (cropperEvent.validate.right(dtX)) {
                if (cropper.offsetLeft - dtX >= 0) {
                    cropper.left = cropper.offsetLeft - dtX
                } else { cropper.left = 0 }
            }
            callback(cropper.top, cropper.left)
        }
    },

    cropTop(event, callback) {
        clientInit(event)
        let clientY = (cropperEvent.EVENT === 'onmousemove') ?  event[cropperEvent.CLIENT_Y] : event[cropperEvent.CLIENT_Y][0].clientY


       $('body')[cropperEvent.EVENT] = (e) => {
            let dtY = (cropperEvent.EVENT === 'onmousemove') ?  (e[cropperEvent.CLIENT_Y] - clientY) : (e[cropperEvent.CLIENT_Y][0].clientY - clientY)
            clientY =  (cropperEvent.EVENT === 'onmousemove') ? e[cropperEvent.CLIENT_Y] : e[cropperEvent.CLIENT_Y][0].clientY
            if(cropperEvent.validate.top(dtY)) {
                callback(dtY)
            }
        }
    },

    cropRight(event, callback) {
        clientInit(event)
        let clientX = (cropperEvent.EVENT === 'onmousemove') ?  event[cropperEvent.CLIENT_X] : event[cropperEvent.CLIENT_X][0].clientX

        document.querySelector('body')[cropperEvent.EVENT] = (e) => {
            let dtX = (cropperEvent.EVENT === 'onmousemove') ? (clientX - e[cropperEvent.CLIENT_X]) : (clientX - e[cropperEvent.CLIENT_X][0].clientX)
            clientX = (cropperEvent.EVENT === 'onmousemove') ? e[cropperEvent.CLIENT_X] : e[cropperEvent.CLIENT_X][0].clientX
            if (cropperEvent.validate.right(dtX)) {
                callback(dtX)
            }
        }
    },

    cropBottom(event, callback) {
        clientInit(event)
        let clientY = (cropperEvent.EVENT === 'onmousemove') ?  event[cropperEvent.CLIENT_Y] : event[cropperEvent.CLIENT_Y][0].clientY

        $('body')[cropperEvent.EVENT] = (e) => {
            let dtY = (cropperEvent.EVENT === 'onmousemove') ? (clientY - e[cropperEvent.CLIENT_Y]) : (clientY - e[cropperEvent.CLIENT_Y][0].clientY)
            clientY = (cropperEvent.EVENT === 'onmousemove') ? e[cropperEvent.CLIENT_Y] : e[cropperEvent.CLIENT_Y][0].clientY
            if (cropperEvent.validate.bottom(dtY)) {
               callback(dtY)
            }
        }
    },

    cropLeft(event, callback) {
        clientInit(event)
        let clientX = (cropperEvent.EVENT === 'onmousemove') ?  event[cropperEvent.CLIENT_X] : event[cropperEvent.CLIENT_X][0].clientX

        $('body')[cropperEvent.EVENT] = (e) => {
            let dtX = (cropperEvent.EVENT === 'onmousemove') ?  (e[cropperEvent.CLIENT_X] - clientX) : (e[cropperEvent.CLIENT_X][0].clientX - clientX)
            clientX =  (cropperEvent.EVENT === 'onmousemove') ? e[cropperEvent.CLIENT_X] : e[cropperEvent.CLIENT_X][0].clientX
            if(cropperEvent.validate.left(dtX)) {
                callback(dtX)
            }
        }
    },
}
