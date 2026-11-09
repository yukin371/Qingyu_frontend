<template>
  <div class="discovery-view">
    <div class="container">
      <!-- 顶部Tab导航 -->
      <div class="tabs-section">
        <el-tabs v-model="activeTab" class="discovery-tabs" @tab-change="handleTabChange">
          <!-- 推荐 Tab -->
          <el-tab-pane label="推荐" name="recommend">
            <div v-if="store.homepageLoading" class="loading-wrapper">
              <el-skeleton :rows="8" animated />
            </div>
            <template v-else>
              <el-alert
                v-if="store.homepageError"
                title="部分推荐内容暂时无法加载"
                type="warning"
                :closable="false"
                show-icon
              />
              <!-- Banner 轮播 -->
              <section class="section-card">
                <div class="section-header">
                  <h2 class="section-title">精选推荐</h2>
                </div>
                <div v-if="store.banners.length > 0" class="banner-scroll">
                  <div
                    v-for="banner in store.banners"
                    :key="banner.id"
                    class="banner-card"
                    @click="handleBannerClick(banner)"
                  >
                    <span class="banner-placeholder-icon">🎯</span>
                    <img
                      v-if="banner.cover"
                      :src="banner.cover"
                      :alt="banner.title"
                      class="banner-img"
                      @load="($event.target as HTMLImageElement).style.opacity = '1'"
                      @error="($event.target as HTMLImageElement).style.display = 'none'"
                    />
                    <div class="banner-overlay">
                      <h3 class="banner-title">{{ banner.title }}</h3>
                      <p v-if="banner.description" class="banner-desc">{{ banner.description }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="section-empty">
                  <span class="section-empty-icon">🎯</span>
                  <p class="section-empty-text">暂无精选推荐</p>
                </div>
              </section>

              <!-- 猜你喜欢 -->
              <section class="section-card">
                <div class="section-header">
                  <h2 class="section-title">猜你喜欢</h2>
                </div>
                <div v-if="store.forYouBooks.length > 0" class="book-scroll">
                  <div
                    v-for="book in store.forYouBooks"
                    :key="book.id"
                    class="book-card-mini"
                    @click="router.push('/book/' + book.id)"
                  >
                    <div class="book-cover-mini">
                      <img
                        :src="resolveBookCover(book)"
                        :alt="book.title"
                        @error="handleCoverError($event, book)"
                      />
                    </div>
                    <span class="book-title-mini">{{ book.title }}</span>
                    <span class="book-author-mini">{{ book.author }}</span>
                  </div>
                </div>
                <div v-else class="section-empty">
                  <span class="section-empty-icon">📖</span>
                  <p class="section-empty-text">暂无推荐书籍</p>
                </div>
              </section>

              <!-- 热门讨论 -->
              <section class="section-card">
                <div class="section-header">
                  <h2 class="section-title">热门讨论</h2>
                  <router-link to="/community" class="section-link">
                    更多
                    <el-icon><ArrowRight /></el-icon>
                  </router-link>
                </div>
                <DiscussionFeed :maxPosts="3" />
              </section>

              <!-- 精选书单 -->
              <section class="section-card">
                <div class="section-header">
                  <h2 class="section-title">精选书单</h2>
                  <router-link
                    v-if="store.booklists.length === 0"
                    to="/discovery/editors-pick"
                    class="section-link"
                  >
                    查看编辑推荐
                    <el-icon><ArrowRight /></el-icon>
                  </router-link>
                </div>
                <BooklistFeed v-if="store.booklists.length > 0" :booklists="store.booklists" />
                <div v-else-if="store.editorsPick.length > 0" class="book-scroll">
                  <div
                    v-for="book in store.editorsPick"
                    :key="book.id"
                    class="book-card-mini"
                    @click="router.push('/book/' + book.id)"
                  >
                    <div class="book-cover-mini">
                      <img
                        :src="resolveBookCover(book)"
                        :alt="book.title"
                        @error="handleCoverError($event, book)"
                      />
                    </div>
                    <span class="book-title-mini">{{ book.title }}</span>
                    <span class="book-author-mini">{{ book.author }}</span>
                  </div>
                </div>
                <div v-else class="section-empty">
                  <span class="section-empty-icon">📚</span>
                  <p class="section-empty-text">暂无精选书单</p>
                </div>
              </section>

              <!-- 热门趋势 Top 5 -->
              <section class="section-card">
                <div class="section-header">
                  <h2 class="section-title">热门趋势</h2>
                  <router-link to="/bookstore/ranking" class="section-link">
                    完整榜单
                    <el-icon><ArrowRight /></el-icon>
                  </router-link>
                </div>
                <div v-if="store.trendingList.length > 0" class="trending-list">
                  <div
                    v-for="(item, index) in store.trendingList.slice(0, 5)"
                    :key="item.id || index"
                    class="trending-item"
                    @click="router.push('/book/' + item.id)"
                  >
                    <span class="trending-rank" :class="{ 'top-three': index < 3 }">
                      {{ index + 1 }}
                    </span>
                    <div class="trending-info">
                      <span class="trending-title">{{ item.title }}</span>
                      <span v-if="item.author" class="trending-author">{{ item.author }}</span>
                    </div>
                    <span v-if="item.rating" class="trending-rating">
                      <el-icon color="#f7ba2a"><StarFilled /></el-icon>
                      {{ item.rating }}
                    </span>
                  </div>
                </div>
                <div v-else class="section-empty">
                  <span class="section-empty-icon">🔥</span>
                  <p class="section-empty-text">暂无热门趋势</p>
                </div>
              </section>
            </template>
          </el-tab-pane>

          <!-- 话题 Tab -->
          <el-tab-pane label="话题" name="topic">
            <div v-if="topicLoading" class="loading-wrapper">
              <el-skeleton :rows="4" animated />
            </div>
            <div v-else-if="store.topics.length" class="topic-grid">
              <button
                v-for="topic in store.topics"
                :key="topic.id"
                type="button"
                class="topic-card"
                @click="handleTopicClick(topic)"
              >
                <h3 class="topic-title">{{ topic.title }}</h3>
                <p v-if="topic.description" class="topic-description">
                  {{ topic.description }}
                </p>
                <span class="topic-book-count">{{ topic.books?.length ?? 0 }} 本关联书籍</span>
              </button>
            </div>
            <div v-else class="section-empty">
              <span class="section-empty-icon">#</span>
              <p class="section-empty-text">暂无热门话题</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, StarFilled } from '@element-plus/icons-vue'
import { useDiscoveryStore } from '../stores/discovery.store'
import { resolveBookCover, getFallbackBookCover } from '@/modules/bookstore/public'
import DiscussionFeed from '../components/DiscussionFeed.vue'
import BooklistFeed from '../components/BooklistFeed.vue'

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
const store = useDiscoveryStore()

// 默认选中"推荐"tab
const activeTab = ref('recommend')
const topicLoading = ref(false)

// 记录是否已加载过话题数据
let topicLoaded = false

onMounted(async () => {
  // 并行加载首页数据
  await Promise.allSettled([store.fetchHomepageData(), store.fetchTrending('daily')])
})

function handleTabChange(tab: string | number) {
  if (tab === 'topic' && !topicLoaded) {
    topicLoaded = true
    topicLoading.value = true
    if (store.topics.length === 0) {
      store
        .fetchTopics()
        .then((loaded) => {
          if (!loaded) topicLoaded = false
        })
        .finally(() => {
          topicLoading.value = false
        })
    } else {
      topicLoading.value = false
    }
  }
}

function handleBannerClick(banner: any) {
  if (banner.link) {
    router.push(banner.link)
  } else if (banner.type === 'book' && banner.id) {
    router.push({ name: 'book-detail', params: { id: banner.id } })
  }
}

function handleTopicClick(topic: any) {
  router.push('/discovery/topic/' + (topic.name || topic.id))
}
</script>

<style scoped lang="scss">
.discovery-view {
  min-height: 100vh;
  background: #f8f9fb;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.tabs-section {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  min-height: calc(100vh - 40px);
}

.discovery-tabs {
  :deep(.el-tabs__header) {
    margin: 0 0 20px 0;
    border-bottom: 1px solid #e4e7ed;
  }

  :deep(.el-tabs__nav-wrap) {
    display: flex;
    &::after {
      display: none;
    }
  }

  :deep(.el-tabs__nav-scroll) {
    display: flex;
  }

  :deep(.el-tabs__nav) {
    display: flex;
    border: none;
  }

  :deep(.el-tabs__item) {
    font-size: 16px;
    font-weight: 500;
    color: #606266;
    padding: 0 24px;
    height: 44px;
    line-height: 44px;
    white-space: nowrap;
    border: none;
    transition: all 0.2s ease;

    &:hover {
      color: #409eff;
      background: #ecf5ff;
      border-radius: 8px;
    }

    &.is-active {
      color: #409eff;
      font-weight: 600;
      background: #ecf5ff;
      border-radius: 8px;
    }
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  :deep(.el-tabs__content) {
    overflow: visible;
  }
}

.loading-wrapper {
  padding: 40px 20px;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.topic-card {
  min-width: 0;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    border-color: #409eff;
    background: #f8fbff;
  }
}

.topic-title {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.topic-description {
  margin: 10px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.topic-book-count {
  color: #909399;
  font-size: 12px;
}

/* Section cards */
.section-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #409eff;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #66b1ff;
  }
}

/* Banner scroll */
.banner-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }
}

.banner-card {
  flex-shrink: 0;
  position: relative;
  width: 320px;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
  background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  .banner-placeholder-icon {
    font-size: 36px;
    opacity: 0.4;
  }

  .banner-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .banner-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
    color: white;
  }

  .banner-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  .banner-desc {
    font-size: 12px;
    margin: 0;
    opacity: 0.9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* Book scroll */
.book-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }
}

.book-card-mini {
  flex-shrink: 0;
  width: 120px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.book-cover-mini {
  margin-bottom: 8px;
  width: 120px;
  height: 160px;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.book-title-mini {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author-mini {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Trending list (top 5 on recommend tab) */
.trending-list {
  display: flex;
  flex-direction: column;
}

.trending-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f8f9fb;
  }
}

.trending-rank {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #999;
  background: #f0f2f5;

  &.top-three {
    color: #fff;
    background: linear-gradient(135deg, #f7ba2a, #ff8c00);
  }
}

.trending-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.trending-title {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trending-author {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.trending-rating {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #f7ba2a;
}

.section-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.section-empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.section-empty-text {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .banner-card {
    width: 260px;
    height: 130px;
  }

  .book-card-mini {
    width: 100px;
  }

  .book-cover-mini img {
    width: 100px;
    height: 133px;
  }
}
</style>
