// default setting
import ImageEditor from "./components/imageEditor"
import defaultOptions from "./core/defaultOptions"

let imageOptions = undefined
const imageEditor =  {
    install (Vue, opts) {

        //set settings
        imageOptions = { ...defaultOptions, ...opts }
        //inject function in component
        Vue.component(ImageEditor.name, ImageEditor)
    }
}
//for auto install
// if (typeof window !== 'undefined' && window.Vue) {
//     window.Vue.use(imageEditor)
// }
export { imageOptions }
export default imageEditor