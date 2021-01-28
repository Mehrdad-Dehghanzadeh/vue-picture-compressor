<template>
  <div id="image-editor">
    <div>
      <h1>Hello world</h1>
      <input type="file" @change="uploadFile" />
    </div>
    <my-image v-if="file" :src="src" />
  </div>
</template>

<script>
import myImage from "./myImage";
import {
  Image,
  checkInput,
  imageEditorInit,
  element,
  imageSettings
} from "../core/image";
import { clearInput } from "../core/cropper";

export default {
  name: "image-editor",
  components: {
    myImage
  },
  data() {
    return {
      file: undefined,
      src: undefined
    };
  },
  methods: {
    uploadFile(event) {
      this.file = "";
      if (checkInput(event.target.files)) {
        imageEditorInit(event.target);
        this.file = element.files[0];
      } else {
        clearInput(event.target);
      }
    }
  },

  watch: {
    file() {
      if (this.file) {
        let reader = new FileReader();
        let that = this;
        reader.onload = function(event) {
          Image.src = event.target.result;
          Image.onload = () => {
            imageSettings.ratio = Image.naturalWidth / Image.naturalHeight;
            imageSettings.type = that.file.type;
            that.src = event.target.result;
          };
        };
        reader.readAsDataURL(this.file);
      } else {
        Image.src = "";
        this.src = "";
      }
    }
  }
};
</script>

<style lang="scss" src="../assets/styles/mains.scss">

</style>
