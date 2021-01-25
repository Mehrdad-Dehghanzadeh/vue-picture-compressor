<template>
  <div id="image-editor-console">
    <div class="console">
      <div class="console__editor-wrapper">
        <div v-show="cropEditor">
          <button type="button" id="confirm-crop" @click="imageCrop">
            confirm
          </button>
          <button type="button" id="cancel-crop" @click="cancelEditor">
            cancel
          </button>
        </div>
        <div>
          <div v-show="sizeEditor">
            <label>
              Image Size :
              <input
                id="image-size-range"
                type="range"
                :min="1"
                :max="maxSizeRang"
                @change="changeSize"
              />
              <button type="button" id="confirm-size" @click="resizing">
                confirm
              </button>
              <button type="button" id="cancel-size" @click="cancelChangeSize">
                cancel
              </button>
            </label>
          </div>
          <div v-show="qualityEditor">
            <label>
              Image Quality :
              <input
                id="image-quality-range"
                type="range"
                min="1"
                :max="maxQualityRang"
                @click="quality"
              />
              <button type="button" id="confirm-quality" @click="changeQuality">
                confirm
              </button>
              <button type="button" id="cancel-quality" @click="cancelQuality">
                cancel
              </button>
            </label>
          </div>
        </div>
      </div>
      <div class="console__btn-wrapper" v-show="showConsole">
        <button type="button" @click="showCropEditor">crop</button>
        <button type="button" @click="showQualityEditor">change quality</button>
        <button type="button" @click="showSizeEditor">change Size</button>
        <button type="button" @click="undo">Undo</button>
      </div>
      <div class="console__image-detail">
        <div class="row">
          <strong>Width: </strong>
          <span>{{ details.width }}</span>
        </div>
        <div class="row">
          <strong>Height: </strong>
          <span>{{ details.height }}</span>
        </div>
        <div class="row">
          <strong>File Size: </strong>
          <span>{{ details.fileSize }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { crop } from "../core/cropper";
import { $ } from "../core/helper";
import { imageOptions } from "../install";
import {
  imageSettings,
  imageResize,
  cancelResize,
  resize,
  setQuality
} from "../core/image";

export default {
  name: "imageEditorConsole",
  data() {
    return {
      cropEditor: false,
      sizeEditor: false,
      qualityEditor: false,
      showConsole: true,
      maxSizeRang: imageOptions.maxSizeRang,
      maxQualityRang: imageOptions.maxQualityRang
    };
  },

  props: {
    details: Object
  },

  methods: {
    toggleConsole(str = undefined) {
      this.cropEditor = str === "cropEditor";
      this.sizeEditor = str === "sizeEditor";
      this.qualityEditor = str === "qualityEditor";
      this.showConsole = !str;
    },

    cancelEditor() {
      this.$emit("showCropper", false);
      this.toggleConsole();
    },

    imageCrop() {
      crop();
      this.toggleConsole();
      this.$emit("showCropper", false);
      this.$emit("crop", imageSettings);
    },

    showCropEditor() {
      this.$emit("cropResize");
      this.$emit("showCropper", true);
      this.toggleConsole("cropEditor");
    },

    showQualityEditor() {
      this.$emit("showCropper", false);
      this.toggleConsole("qualityEditor");
    },

    showSizeEditor() {
      this.$emit("showCropper", false);
      this.toggleConsole("sizeEditor");
    },

    quality(event) {
      setQuality(event.target);
    },

    changeQuality() {
      this.toggleConsole();
    },

    cancelQuality() {
      $("#image-quality-range").value = this.maxQualityRang;
      setQuality($("#image-quality-range"));
      this.toggleConsole();
    },

    changeSize(event) {
      imageResize(event.target);
      this.$emit("imageResize", imageSettings);
    },

    cancelChangeSize() {
      cancelResize();
      this.$emit("imageResize", imageSettings);
      this.toggleConsole();
    },

    resizing() {
      resize();
      $("#image-size-range").value = this.maxSizeRang;
      this.toggleConsole();
    },

    undo() {
      this.$emit("undo");
    }
  }
};
</script>
