/**
 * 发现模块状态管理
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as discoveryApi from '../api'
import type {
  PersonalizedRecommendations,
  RecommendationItem,
  RecommendationSlot,
} from '@/types/discovery'

export const useDiscoveryStore = defineStore('discovery', () => {
  // State
  const recommendations = ref<RecommendationItem[]>([])
  const personalized = ref<PersonalizedRecommendations | null>(null)
  const newReleases = ref<any[]>([])
  const editorsPick = ref<any[]>([])
  const trending = ref<any[]>([])
  const topics = ref<any[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const homepageLoading = ref(false)
  const homepageError = ref<Error | null>(null)

  // Getters
  const hasRecommendations = computed(() => recommendations.value.length > 0)
  const banners = computed(() => recommendations.value.filter((item) => item.slot === 'banner'))
  const forYouBooks = computed(() => personalized.value?.books.forYou ?? [])
  const booklists = computed(() => {
    const recommendations = personalized.value?.booklists
    if (!recommendations) return []
    return recommendations.recommended.length > 0
      ? recommendations.recommended
      : recommendations.popular
  })
  const trendingList = computed(() => trending.value)

  // Actions
  /**
   * 获取推荐内容
   */
  async function fetchRecommendations(slot?: RecommendationSlot) {
    loading.value = true
    error.value = null
    try {
      const data = await discoveryApi.getRecommendations(slot)
      recommendations.value = data
    } catch (err) {
      error.value = err as Error
      console.error('获取推荐失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载发现首页数据，单个接口失败时保留其他区块的结果。
   */
  async function fetchHomepageData() {
    homepageLoading.value = true
    homepageError.value = null
    try {
      const [recommendationsResult, personalizedResult] = await Promise.allSettled([
        discoveryApi.getRecommendations('banner'),
        discoveryApi.getPersonalizedRecommendations(),
      ])

      if (recommendationsResult.status === 'fulfilled') {
        recommendations.value = recommendationsResult.value
      }
      if (personalizedResult.status === 'fulfilled') {
        personalized.value = personalizedResult.value
      }

      const failedResult = [recommendationsResult, personalizedResult].find(
        (result) => result.status === 'rejected',
      )
      const hasBooklists =
        personalizedResult.status === 'fulfilled' &&
        (personalizedResult.value.booklists.recommended.length > 0 ||
          personalizedResult.value.booklists.popular.length > 0)
      if (!hasBooklists) {
        try {
          const fallback = await discoveryApi.getEditorsPick({ page: 1, size: 6 })
          editorsPick.value = fallback.list
        } catch (err) {
          homepageError.value = err as Error
        }
      }
      if (!homepageError.value && failedResult?.status === 'rejected') {
        homepageError.value = failedResult.reason as Error
      }
    } finally {
      homepageLoading.value = false
    }
  }

  /**
   * 获取个性化推荐
   */
  async function fetchPersonalized() {
    loading.value = true
    try {
      const data = await discoveryApi.getPersonalizedRecommendations()
      personalized.value = data
    } catch (err) {
      console.error('获取个性化推荐失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取新书推荐
   */
  async function fetchNewReleases() {
    loading.value = true
    try {
      const response = await discoveryApi.getNewReleases()
      newReleases.value = response.list
    } catch (err) {
      console.error('获取新书推荐失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取编辑推荐
   */
  async function fetchEditorsPick() {
    loading.value = true
    try {
      const response = await discoveryApi.getEditorsPick()
      editorsPick.value = response.list
    } catch (err) {
      console.error('获取编辑推荐失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取热门榜单
   */
  async function fetchTrending(type: 'daily' | 'weekly' | 'monthly' = 'daily') {
    try {
      const data = await discoveryApi.getTrending({ type })
      trending.value = data
    } catch (err) {
      console.error('获取热门榜单失败:', err)
    }
  }

  /**
   * 获取话题列表
   */
  async function fetchTopics(): Promise<boolean> {
    try {
      const response = await discoveryApi.getTopics()
      topics.value = response.list
      return true
    } catch (err) {
      console.error('获取话题列表失败:', err)
      return false
    }
  }

  return {
    // State
    recommendations,
    personalized,
    newReleases,
    editorsPick,
    trending,
    topics,
    loading,
    error,
    homepageLoading,
    homepageError,
    banners,
    forYouBooks,
    booklists,
    trendingList,
    // Getters
    hasRecommendations,
    // Actions
    fetchRecommendations,
    fetchHomepageData,
    fetchPersonalized,
    fetchNewReleases,
    fetchEditorsPick,
    fetchTrending,
    fetchTopics,
  }
})
