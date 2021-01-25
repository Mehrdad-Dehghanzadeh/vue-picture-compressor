import { coordinates } from "./cropper"
import { $ } from './helper'
const HAS_WINDOWS = typeof window !== 'undefined'
const HAS_NAVIGATOR = typeof navigator !== 'undefined'
const IS_TOUCH = HAS_WINDOWS && ('ontouchstart' in window || (HAS_NAVIGATOR && navigator.msMaxTouchPoints > 0))


export default  {
    EVENT: IS_TOUCH ? 'ontouchmove' : 'onmousemove',
    CLIENT_Y: IS_TOUCH ? 'touches' : 'clientY',
    CLIENT_X: IS_TOUCH ? 'touches' : 'clientX',
    
    clearEvents() {
        $('body').style.cursor = "default"
        $('.image-cropper').style.cursor = "move"
        $('.image-cropper')[this.EVENT] = null
        $('body')[this.EVENT] = null
    },

    initEvents(vue) {
        if(!vue) console.error('Please Enter your Instance for example "this"')
        window.onmouseup = () => {
            this.clearEvents()
        }
        window.ontouchend = () => {
            this.clearEvents()
        }
        window.ontouchcancel = () => {
            this.clearEvents()
        }
        window.onresize = () => {
            vue.$emit('cropResize',{
                width: $('.my-image-component').clientWidth,
                height: $('.my-image-component').clientHeight,
                top: 0,
                left:0
            })
        }
    },

    validate: {
        top(dtY) {
            return (($('.image-cropper').offsetTop + dtY) >= 0 && coordinates.top >= 0)
        },
        right(dtX) {
            return (coordinates.left + (coordinates.width - dtX) <= $('.image-wrapper').clientWidth)
        },
        bottom(dtY) {
            return ((coordinates.height - dtY) + coordinates.top <= $('.image-wrapper').clientHeight)
        },
        left(dtX){
            return (($('.image-cropper').offsetLeft + dtX) >= 0 && coordinates.left >= 0)
        }
    }
}
