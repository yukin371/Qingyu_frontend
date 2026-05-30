<template>
  <div class="editor-pick-card" @click="emit('click', pick)">
    <!-- 封面区域 -->
    <div class="pick-cover">
      <img
        :src="resolveBookCover(pick)"
        :alt="pick.title"
        class="cover-img"
        @error="handleCoverError($event, pick)"
      />
      <div class="pick-badge">编辑推荐</div>
    </div>

    <!-- 内容区域 -->
    <div class="pick-content">
      <h3 class="pick-title">{{ pick.title }}</h3>
      <p v-if="pick.author" class="pick-author">{{ pick.author }}</p>
      <div v-if="pick.rating" class="pick-rating">
        <el-icon color="#f7ba2a"><StarFilled /></el-icon>
        <span>{{ pick.rating }}</span>
      </div>
      <p v-if="pick.reason" class="pick-reason">{{ pick.reason }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarFilled } from '@element-plus/icons-vue'
import { resolveBookCover, getFallbackBookCover } from '@/modules/bookstore/utils/cover-resolver'

interface Props {
  pick: {
    id: string
    title: string
    cover?: string
    author?: string
    rating?: number
    reason?: string
    [key: string]: unknown
  }
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'click', pick: Props['pick']): void
}>()

function handleCoverError(event: Event, book: any) {
  const img = event.target as HTMLImageElement
  if (!img.dataset.fallback) {
    img.dataset.fallback = 'true'
    img.src = getFallbackBookCover(book)
  } else {
    img.style.display = 'none'
  }
}
</script>

<style scoped lang="scss">
.editor-pick-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8f9fb;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #f0f2f5;
    transform: translateX(4px);
  }
}

.pick-cover {
  position: relative;
  flex-shrink: 0;

  .cover-img {
    width: 100px;
    height: 133px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .pick-badge {
    position: absolute;
    top: -8px;
    left: -8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }
}

.pick-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.pick-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pick-author {
  font-size: 13px;
  color: #999;
  margin: 0 0 8px 0;
}

.pick-rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #f7ba2a;
}

.pick-reason {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  flex: 1;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
