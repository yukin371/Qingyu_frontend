<template>
  <transition name="fade">
    <div v-if="visible" :class="overlayClasses" @click="handleClick">
      <div class="qy-loading-overlay__content" @click.stop>
        <el-icon class="qy-loading-overlay__icon" :size="iconSize"><Loading /></el-icon>
        <p v-if="text" class="qy-loading-overlay__text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'

interface Props {
  visible?: boolean
  text?: string
  iconSize?: number
  fullscreen?: boolean
  background?: string
  closeOnClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  iconSize: 48,
  fullscreen: false,
  background: 'rgba(255, 255, 255, 0.9)',
  closeOnClick: false,
})
const emit = defineEmits<{ close: [] }>()
const overlayClasses = computed(() => [
  'qy-loading-overlay',
  { 'qy-loading-overlay--fullscreen': props.fullscreen },
])
const handleClick = () => {
  if (props.closeOnClick) emit('close')
}
</script>

<style scoped>
.qy-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: v-bind(background);
}
.qy-loading-overlay--fullscreen {
  position: fixed;
}
.qy-loading-overlay__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.qy-loading-overlay__icon {
  color: #2196f3;
  animation: rotate 1s linear infinite;
}
.qy-loading-overlay__text {
  margin: 0;
  color: #757575;
  font-size: 0.875rem;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
