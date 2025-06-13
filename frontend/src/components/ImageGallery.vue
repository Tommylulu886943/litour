<template>
  <div class="image-gallery">
    <img
      :src="currentImage"
      :alt="alt"
      class="main-image"
      @error="onImgError"
    />
    <div v-if="images.length > 1" class="thumbnails">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        :alt="alt + ' ' + (index + 1)"
        @error="onImgError"
        @click="setImage(index)"
        :class="['thumbnail', { active: index === currentIndex }]"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import noImage from '@/assets/images/no-image.svg';

export default {
  name: 'ImageGallery',
  props: {
    images: {
      type: Array,
      default: () => []
    },
    alt: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const currentIndex = ref(0);
    const setImage = (index) => {
      currentIndex.value = index;
    };
    const currentImage = computed(() => props.images[currentIndex.value] || '');

    const onImgError = (e) => {
      e.target.onerror = null;
      e.target.src = noImage;
    };

    return {
      currentIndex,
      setImage,
      currentImage,
      onImgError
    };
  }
};
</script>

<style scoped>
.image-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
}

.thumbnails {
  display: flex;
  margin-top: 10px;
  overflow-x: auto;
  gap: 8px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

.thumbnail.active {
  border-color: var(--primary-color);
}
</style>
