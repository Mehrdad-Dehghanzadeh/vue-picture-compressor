import { changeCoordinate, closeEditor } from "./cropper"
import { imageOptions } from "../install"
import { $, removeNode } from './helper'

export let element = null
export let Image = document.createElement('img')
export let Canvas = document.createElement('canvas')
export let NewImage = undefined
export let imageSettings = {
    width: null,
    maxWidth: null,
    height: null,
    maxHeight: null,
    ratio: null,
    nw: null,
    nh: null,
    maxSize: null,
    fileSize: null,
    quality: null,
    top: 0,
    left: 0
};

function setMaxSize() {
    switch (imageOptions.sizeView) {
        case 'xs': {
            imageSettings.maxSize = 480
            break
        }
        case 'sm': {
            imageSettings.maxSize= 768
            break
        }
        case 'md': {
            imageSettings.maxSize = 992
            break
        }
        case 'lg': {
            imageSettings.maxSize = 1200
            break
        }
        case 'xlg': {
            imageSettings.maxSize = 1600
            break
        }
    }
}

export function imageEditorInit(el) {
    closeEditor()
    changeImageSettings({ quality: imageOptions.imageQuality })
    element = el
    setMaxSize()
}

export function clearRange() {
    $('#image-quality-range').value =  imageOptions.maxQualityRang
    $('#image-size-range').value = imageOptions.maxSizeRang
}

export function changeImageSettings(object) {
    imageSettings = { ...imageSettings, ...object }
}

export function canvasInit(Object) {
    Canvas.className = 'my-image'
    Canvas.width = Object.width
    Canvas.height = Object.height
}

export function drawImage(Object = {
    width: Image.width,
    height: Image.height,
    left: 0,
    top: 0,
    resize: true
}) {
    canvasInit(Object)
    const img = (NewImage) ? NewImage : Image
    if (Object.resize) {
        Canvas.getContext('2d').drawImage(img,0, 0, img.width, img.height, 0, 0, Object.width, Object.height)
    } else {
        Canvas.getContext('2d').drawImage(img, Object.left, Object.top, Object.width, Object.height, 0, 0, Object.width, Object.height)
    }
}

export function deleteCanvas() {
    removeNode('.'+Canvas.className)
    Canvas = document.createElement('canvas')
}

export function createNewImage(width, height, ratio = width / height) {
    NewImage = document.createElement('img')
    changeImageSettings({
        width,
        height,
        ratio,
        maxWidth: null,
        maxHeight: null,
        top: 0,
        left: 0
    })
    NewImage.src = Canvas.toDataURL('image/jpeg', 1)
    NewImage.width = width
    NewImage.height = height
    setDimension(NewImage)
}

export function checkInput(input) {
    if (input[0]!== undefined && input.length === 1 ) {
        const regexp=/^image\/.*/;
        if (regexp.test(input[0].type)) {
            const imageType = input[0].type.slice(6)
            if (imageOptions.format.find(el => el === imageType) ) {
                return true
            } else {
                alert("لطفا عکس با فرمت مناسب وارد کنید")
                return false
            }
        } else {
            alert("لطفا عکس وارد کنید")
            return false
        }
    } else {
        alert("لطفا تعداد مناسبی عکس وارد کنید")
        return false
    }
}

export function setDimension(image = (NewImage) ? NewImage : Image) {
    let maxWidth
    let maxHeight
    if (imageSettings.ratio > 1) {
        maxWidth = imageSettings.maxSize
        maxHeight = Math.ceil(imageSettings.maxSize / imageSettings.ratio)
    } else {
        maxHeight = imageSettings.maxSize
        maxWidth = Math.ceil(imageSettings.maxSize * imageSettings.ratio)
    }
    imageSettings.maxWidth = (image.width > maxWidth ) ? maxWidth : image.width
    imageSettings.maxHeight = (image.height > maxHeight) ? maxHeight : image.height
    imageSettings.width = image.width
    imageSettings.height = image.height
    changeCoordinate({
        width: imageSettings.maxWidth,
        height: imageSettings.maxHeight,
        top: 0,
        left: 0
    })
}

export function setSizeFactors() {
    const Img = (NewImage) ? NewImage : Image
    imageSettings.nw = ($('.my-image-component').clientWidth >= imageSettings.maxWidth )  ? (Img.width / imageSettings.maxWidth) : (Img.width /$('.my-image-component').clientWidth)
    imageSettings.nh = ($('.my-image-component').clientHeight >= imageSettings.maxHeight )  ? (Img.height / imageSettings.maxHeight) : (Img.height / $('.my-image-component').clientHeight)
}

export function imageFileSize() {
    let dataUrl = Canvas.toDataURL('image/jpeg', imageSettings.quality)
    const head = 'data:image/jpeg;base64,'
    imageSettings.fileSize = Math.floor((dataUrl.length - head.length) * 3/4)
    let imgSize = imageSettings.fileSize / 1024;
    if (imgSize < 1024) {
        imgSize = Math.ceil(imgSize);
        imgSize += " KB";
    } else {
        imgSize /= 1024;
        imgSize = Math.ceil(imgSize * 100) / 100;
        imgSize += " MB";
    }
    return imgSize;
}

export const imageDetails = {
    width: Image.naturalWidth,
    height: Image.naturalHeight,
    fileSize: undefined
}

export function updateDetails(obj={ width: imageSettings.width, height: imageSettings.height }) {
    imageDetails.width = obj.width;
    imageDetails.height = obj.height;
    imageDetails.fileSize = imageFileSize()
    return imageDetails
}

export function imageResize(element) {
    if (NewImage) {
        changeSize(NewImage, element)
    } else {
        changeSize(Image, element)
    }
    const tempImage = (NewImage) ? NewImage.cloneNode(true) : Image.cloneNode(true)
    tempImage.width = imageSettings.newWidth
    tempImage.height = imageSettings.newHeight
    setDimension(tempImage)
}

export function resizing(img, element) {
    const max = Number(element.max)
    const min =  Number(element.min)
    if (max === Number(element.value)) {
        imageSettings.newWidth = img.width
        imageSettings.newHeight = img.height
        return
    }
    const factorWidth = Math.ceil((img.width - imageOptions.minWidth)  / ( max - min + 1))
    const factorHeight = Math.ceil((img.height - imageOptions.minHeight) / (max - min + 1))
    const divParam = (max  - Number(element.value)) + 1
    let width = Math.ceil(img.width - (divParam * factorWidth))
    let height = Math.ceil(img.height - (divParam * factorHeight))
    if(width > imageOptions.minWidth && height > imageOptions.minHeight){
        imageSettings.newWidth = width
        imageSettings.newHeight = height
    } else {
        if (width < imageOptions.minWidth) alert(`طول کمتر از ${imageOptions.minWidth}`)
        if (height < imageOptions.minHeight) alert(`عرض  کمتر از ${imageOptions.minHeight}`)
        for (let i=1; i < max; i++) {
            if(Math.floor(img.width - ((max - i + 1) * factorWidth)) > imageOptions.minWidth || Math.floor(img.height - ((max - i + 1) * factorHeight)) > imageOptions.minHeight) {
                width = Math.ceil(img.width - ((max - i + 1) * factorWidth))
                height =  Math.ceil(img.height - ((max - i + 1) * factorHeight))
                element.value = i
                break;
            }
        }
        imageSettings.newWidth = width;
        imageSettings.newHeight = height;
    }
}

function changeSize(img, element) {
    resizing(img, element)
    deleteCanvas()
    drawImage({
        width: imageSettings.newWidth,
        height: imageSettings.newHeight,
        left: 0,
        top: 0,
        resize: true
    })
    $('.image-wrapper').appendChild(Canvas)

    updateDetails({
        width: imageSettings.newWidth,
        height: imageSettings.newHeight,
    })
}

export function cancelResize() {

    $('#image-size-range').value = imageOptions.maxSizeRang
    imageResize($('#image-size-range'))
}

export function resize() {
    createNewImage(imageSettings.newWidth, imageSettings.newHeight, imageSettings.ratio)
}

export function setQuality(element) {
    imageSettings.quality = (Number(element.value) /Number(element.max))
    imageSettings.quality = (imageSettings.quality > 0.82) ? 0.82 : imageSettings.quality
    updateDetails()
}

export function undo() {
    NewImage = undefined
    changeImageSettings({
        width: Image.width,
        height: Image.height,
        ratio: (Image.naturalWidth / Image.naturalHeight),
        top: 0,
        left: 0,
        nw: null,
        nh: null
    })
    setDimension(Image)
    deleteCanvas()
    clearRange()
    setQuality($('#image-quality-range'))
    drawImage({
        width: Image.width,
        height: Image.height,
        left: 0,
        top: 0,
        resize: false
    })
    $('.image-wrapper').insertBefore(Canvas, $('.image-wrapper').children[0])
    updateDetails()
}
