<template>
  <div class="booklist-feed">
    <!-- 空状态 -->
    <div v-if="booklists.length === 0" class="empty-state">
      <el-icon :size="64" color="#ddd">
        <Collection />
      </el-icon>
      <p>暂无书单</p>
    </div>

    <!-- 书单列表 -->
    <div v-else class="booklist-grid">
      <div
        v-for="booklist in booklists"
        :key="booklist.id"
        class="booklist-card"
        @click="router.push('/booklist/' + booklist.id)"
      >
        <!-- 封面区域 -->
        <div class="booklist-cover">
          <div class="cover-images">
            <img
              v-for="(book, index) in (booklist.books || []).slice(0, 3)"
              :key="index"
              :src="resolveBookCover(book)"
              :alt="book.title"
              class="cover-image"
              :style="{
                transform: `rotate(${Number(index) * 5}deg) translateY(${Number(index) * 2}px)`,
              }"
              @error="handleCoverError($event, book)"
            />
          </div>
          <div class="cover-badge">{{ booklist.bookCount || 0 }}本书</div>
        </div>

        <!-- 内容区域 -->
        <div class="booklist-content">
          <h3 class="booklist-title">{{ booklist.title }}</h3>
          <p v-if="booklist.description" class="booklist-description">{{ booklist.description }}</p>

          <!-- 创建者信息 -->
          <div v-if="booklist.creator" class="creator-info">
            <Avatar size="sm" :src="booklist.creator.avatar" :alt="booklist.creator.nickname" />
            <span class="creator-name">{{ booklist.creator.nickname }}</span>
          </div>

          <!-- 统计信息 -->
          <div
            v-if="booklist.viewCount !== undefined || booklist.favoriteCount !== undefined"
            class="booklist-stats"
          >
            <div v-if="booklist.viewCount !== undefined" class="stat-item">
              <el-icon><View /></el-icon>
              <span>{{ formatCount(booklist.viewCount) }}</span>
            </div>
            <div v-if="booklist.favoriteCount !== undefined" class="stat-item">
              <el-icon><Star /></el-icon>
              <span>{{ formatCount(booklist.favoriteCount) }}</span>
            </div>
            <div v-if="booklist.bookCount !== undefined" class="stat-item">
              <el-icon><Collection /></el-icon>
              <span>{{ formatCount(booklist.bookCount) }}</span>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="booklist.tags?.length" class="booklist-tags">
            <el-tag v-for="tag in booklist.tags.slice(0, 3)" :key="tag" size="small" type="info">
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Collection, View, Star } from '@element-plus/icons-vue'
import { Avatar } from '@/design-system/base'
import { resolveBookCover, getFallbackBookCover } from '@/modules/bookstore/utils/cover-resolver'

interface Props {
  booklists?: any[]
}

withDefaults(defineProps<Props>(), {
  booklists: () => [],
})

const router = useRouter()

function handleCoverError(event: Event, book: any) {
  const img = event.target as HTMLImageElement
  if (!img.dataset.fallback) {
    img.dataset.fallback = 'true'
    img.src = getFallbackBookCover(book)
  } else {
    img.style.display = 'none'
  }
}

function formatCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}
</script>

<style scoped lang="scss">
.booklist-feed {
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #999;

  p {
    margin-top: 16px;
    font-size: 14px;
  }
}

.booklist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.booklist-card {
  background:
    linear-gradient(180deg, rgba(255, 252, 245, 0.96), rgba(247, 240, 230, 0.92)), #fffdfa;
  border: 1px solid rgba(120, 94, 62, 0.1);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow:
    0 18px 40px -28px rgba(86, 60, 24, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(176, 124, 52, 0.18);
    box-shadow:
      0 24px 48px -30px rgba(86, 60, 24, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.76);
  }
}

.booklist-cover {
  position: relative;
  height: 160px;
  background:
    radial-gradient(circle at top left, rgba(255, 247, 228, 0.95), transparent 46%),
    linear-gradient(145deg, #f1e1c3 0%, #d8b98e 52%, #b58a58 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(120, 94, 62, 0.08);

  .cover-images {
    display: flex;
    gap: 12px;
    padding: 20px;
  }

  .cover-image {
    width: 60px;
    height: 84px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.55);
    box-shadow:
      0 12px 18px -12px rgba(54, 35, 10, 0.48),
      0 2px 6px rgba(60, 36, 8, 0.18);
  }

  .cover-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 249, 238, 0.92);
    border: 1px solid rgba(161, 118, 57, 0.18);
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: #7d5521;
  }
}

.booklist-content {
  padding: 16px;
}

.booklist-title {
  font-size: 16px;
  font-weight: 600;
  color: #2f2416;
  margin: 0 0 8px 0;
  line-height: 1.4;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.booklist-description {
  font-size: 13px;
  color: #65584b;
  margin: 0 0 12px 0;
  line-height: 1.5;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.creator-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .creator-name {
    font-size: 12px;
    color: #8a745f;
  }
}

.booklist-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #7d6951;

    .el-icon {
      font-size: 14px;
    }
  }
}

.booklist-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .el-tag {
    border: 1px solid rgba(178, 140, 91, 0.18);
    background: rgba(255, 248, 235, 0.92);
    color: #7a5930;
  }
}
</style>
