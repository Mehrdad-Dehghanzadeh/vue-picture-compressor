<template>
  <div class="image-cropper" @mouseup.prevent="clearEvent">
    <div
      class="line-dashed-wrapper"
      @touchstart="moveCropper"
      @mousedown.prevent="moveCropper"
    >
      <span class="line-dashed dashed-h" id="dashed-h-1"></span>
      <span class="line-dashed dashed-v" id="dashed-v-1"></span>
      <span class="line-dashed dashed-h" id="dashed-h-2"></span>
      <span class="line-dashed dashed-v" id="dashed-v-2"></span>
    </div>
    <div
      class="cropper-handler cropper-handler--horizontal"
      id="cropper-handler--top"
    >
      <div
        class="cropper-handler-bullet cropper-handler-bullet--horizontal"
        id="cropper-handler-bullet--top"
        @touchstart="cropTop"
        @mousedown="cropTop"
      ></div>
    </div>
    <div
      class="cropper-handler cropper-handler--vertical"
      id="cropper-handler--right"
    >
      <div
        class="cropper-handler-bullet cropper-handler-bullet--vertical"
        id="cropper-handler-bullet--right"
        @touchstart="cropRight"
        @mousedown="cropRight"
      ></div>
    </div>
    <div
      class="cropper-handler cropper-handler--horizontal"
      id="cropper-handler--bottom"
    >
      <div
        class="cropper-handler-bullet cropper-handler-bullet--horizontal"
        id="cropper-handler-bullet--bottom"
        @touchstart="cropBottom"
        @mousedown="cropBottom"
      ></div>
    </div>
    <div
      class="cropper-handler cropper-handler--vertical"
      id="cropper-handler--left"
    >
      <div
        class="cropper-handler-bullet cropper-handler-bullet--vertical"
        id="cropper-handler-bullet--left"
        @touchstart="cropLeft"
        @mousedown="cropLeft"
      ></div>
    </div>
  </div>
</template>

<script>
import cropperEvent from "../core/cropperEvent";
import cropper, { changeCoordinate } from "../core/cropper";
import { Image } from "../core/image";

export default {
  name: "imageCropper",
  data() {
    return {
      cropper: document.querySelector(".image-cropper")
    };
  },
  props: {
    width: {
      type: Number,
      require: true
    },
    height: {
      type: Number,
      require: true
    },
    top: {
      type: Number,
      require: true
    },
    left: {
      type: Number,
      require: true
    }
  },
  methods: {
    cropperInit() {
      this.cropper = document.querySelector(".image-cropper");
      cropperEvent.initEvents(this);
      changeCoordinate({
        width: Image.width,
        height: Image.height,
        left: 0,
        top: 0
      });
    },
    moveCropper(event) {
      let that = this;
      cropper.move(event, function(top, left) {
        that.$emit("cropResize", { top: top, left: left });
      });
    },
    cropBottom(event) {
      let that = this;
      cropper.cropBottom(event, function(dtY) {
        that.$emit("cropResize", { height: that.cropper.clientHeight - dtY });
      });
    },
    cropRight(event) {
      let that = this;
      cropper.cropRight(event, function(dtX) {
        that.$emit("cropResize", { width: that.cropper.clientWidth - dtX });
      });
    },
    cropLeft(event) {
      let that = this;
      cropper.cropLeft(event, function(dtX) {
        that.$emit("cropResize", {
          width: that.cropper.clientWidth - dtX,
          left: that.cropper.offsetLeft + dtX
        });
      });
    },
    cropTop(event) {
      let that = this;
      cropper.cropTop(event, function(dtY) {
        that.$emit("cropResize", {
          height: that.cropper.clientHeight - dtY,
          top: that.cropper.offsetTop + dtY
        });
      });
    },
    clearEvent() {
      cropperEvent.clearEvents();
    }
  },
  mounted() {
    this.cropperInit();
  }
};
</script>