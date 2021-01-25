<template>
  <div class="row">
    <div
      class="my-image-component"
      :style="{ maxWidth: maxWidth + 'px', maxHeight: maxHeight + 'px' }"
    >
      <div class="image-wrapper" :style="{ maxHeight: maxHeight + 'px' }"></div>
      <image-cropper
        @cropResize="cropResize"
        :style="{
          top: top + 'px',
          left: left + 'px',
          maxWidth: maxWidth + 'px',
          maxHeight: maxHeight + 'px',
          width: width + 'px',
          height: height + 'px'
        }"
        :width="width"
        :height="height"
        :top="top"
        :left="left"
        v-show="showCropper"
      />
    </div>
    <image-editor-console
      :details="imgDetails"
      @showCropper="setCropper"
      @crop="crop"
      @cropResize="cropResize"
      @imageResize="imageResize"
      @undo="undoEdit"
    ></image-editor-console>
  </div>
</template>

<script>
import imageEditorConsole from "./imageEditorConsole";
import imageCropper from "./imageCropper";
import {
  Image,
  Canvas,
  drawImage,
  imageSettings,
  updateDetails,
  imageDetails,
  setDimension,
  clearRange,
  undo
} from "../core/image";
import { changeCoordinate } from "../core/cropper";
import { $ } from "../core/helper";

export default {
  name: "myImage",
  data() {
    return {
      maxHeight: undefined,
      maxWidth: undefined,
      width: undefined,
      height: undefined,
      top: 0,
      left: 0,
      ratio: Image.ratio,
      showCropper: false,
      imgDetails: {},
      canvas: undefined
    };
  },
  props: {
    src: {
      type: String,
      default: ""
    },
    alt: {
      type: String,
      default: ""
    }
  },
  components: {
    imageEditorConsole,
    imageCropper
  },
  methods: {
    cropResize(
      sizes = {
        width:
          imageSettings.maxWidth > $(".my-image-component").clientWidth
            ? $(".my-image-component").clientWidth
            : imageSettings.maxWidth,
        height:
          imageSettings.maxHeight > $(".my-image-component").clientHeight
            ? $(".my-image-component").clientHeight
            : imageSettings.maxHeight,
        top: 0,
        left: 0
      }
    ) {
      if (sizes.width) this.width = sizes.width;
      if (sizes.height) this.height = sizes.height;
      if (sizes.top || sizes.top === 0) this.top = sizes.top;
      if (sizes.left || sizes.left === 0) this.left = sizes.left;
      changeCoordinate(sizes);
    },

    imageResize(size) {
      this.maxWidth = size.maxWidth;
      this.maxHeight = size.maxHeight;
      this.updatingDetails();
    },

    crop(object) {
      this.cropResize();
      this.maxWidth = object.maxWidth;
      this.maxHeight = object.maxHeight;
      this.height = object.maxHeight;
      this.updatingDetails();
    },

    setCropper(value) {
      this.showCropper = value;
    },

    updatingDetails(obj) {
      if (obj) {
        this.imgDetails = updateDetails({ ...imageDetails, ...obj });
      } else {
        this.imgDetails = updateDetails();
      }
    },

    undoEdit() {
      undo();
      this.cropResize();
      this.maxHeight = imageSettings.maxHeight;
      this.maxWidth = imageSettings.maxWidth;
    }
  },

  watch: {
    src() {
      drawImage();
      $(".image-wrapper").insertBefore(Canvas, $(".image-wrapper").children[0]);
      setDimension();
      this.maxHeight = imageSettings.maxHeight;
      this.maxWidth = imageSettings.maxWidth;
      this.cropResize();
      this.updatingDetails({
        width: imageSettings.width,
        height: imageSettings.height
      });
      clearRange();
    }
  }
};
</script>
