<template>
  <el-card :class="cardClasses" :shadow="props.shadow">
    <template v-if="$slots.header || props.title" #header>
      <div class="qy-form-card__header">
        <slot name="header"
          ><h3 class="qy-form-card__title">{{ props.title }}</h3>
          <p v-if="props.description" class="qy-form-card__description">
            {{ props.description }}
          </p></slot
        >
      </div>
    </template>
    <div class="qy-form-card__content"><slot /></div>
    <template v-if="$slots.footer || props.showFooter" #footer>
      <div class="qy-form-card__footer">
        <slot name="footer">
          <el-button v-if="props.showCancel" @click="handleCancel">{{
            props.cancelText
          }}</el-button>
          <el-button type="primary" :loading="props.loading" @click="handleSubmit">{{
            props.submitText
          }}</el-button>
        </slot>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  description?: string
  shadow?: 'always' | 'hover' | 'never'
  showFooter?: boolean
  showCancel?: boolean
  submitText?: string
  cancelText?: string
  loading?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  shadow: 'hover',
  showFooter: true,
  showCancel: true,
  submitText: '提交',
  cancelText: '取消',
  loading: false,
  bordered: false,
})
const emit = defineEmits<{ submit: []; cancel: [] }>()
const cardClasses = computed(() => ['qy-form-card', { 'qy-form-card--bordered': props.bordered }])
const handleSubmit = () => emit('submit')
const handleCancel = () => emit('cancel')
</script>

<style scoped>
.qy-form-card {
  margin-bottom: 1.5rem;
}
.qy-form-card--bordered {
  border: 1px solid #e0e0e0;
}
.qy-form-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.qy-form-card__title {
  margin: 0;
  color: #212121;
  font-size: 1.125rem;
  font-weight: 600;
}
.qy-form-card__description {
  margin: 0.25rem 0 0;
  color: #757575;
  font-size: 0.875rem;
}
.qy-form-card__content {
  padding: 0.5rem 0;
}
.qy-form-card__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
:deep(.el-card__header) {
  padding: 1.25rem 1.5rem;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}
:deep(.el-card__body) {
  padding: 1.5rem;
}
:deep(.el-card__footer) {
  padding: 1rem 1.5rem;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
}
</style>
