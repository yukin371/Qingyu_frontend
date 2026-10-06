/**
 * 阅读器主题管理 API
 */
import { request } from '@/utils/request-adapter'

// 主题类型
export type ThemeType = 'light' | 'dark' | 'sepia' | 'eye-care' | 'night' | 'custom'

// 主题配色
export interface ThemeColors {
  background: string
  foreground: string
  accent: string
  secondary: string
  border: string
  shadow: string
}

// 主题配置
export interface Theme {
  id: string
  name: string
  type: ThemeType
  colors: ThemeColors
  preview?: string
  is_builtin: boolean
  created_at?: string
}

// 自定义主题创建参数
export interface CreateThemeParams {
  name: string
  type: 'custom'
  colors: ThemeColors
}

interface ReaderThemeResponse {
  id: string
  name: string
  displayName: string
  description?: string
  isBuiltIn: boolean
  isPublic: boolean
  colors: {
    background: string
    textPrimary: string
    textSecondary: string
    accentColor: string
    borderColor: string
    shadowColor: string
  }
  createdAt?: string
}

interface ReaderThemeListResponse {
  themes: ReaderThemeResponse[]
  total: number
}

function toTheme(theme: ReaderThemeResponse): Theme {
  return {
    id: theme.isBuiltIn ? theme.name : theme.id,
    name: theme.displayName || theme.name,
    type: theme.isBuiltIn ? (theme.name as ThemeType) : 'custom',
    colors: {
      background: theme.colors.background,
      foreground: theme.colors.textPrimary,
      accent: theme.colors.accentColor,
      secondary: theme.colors.textSecondary,
      border: theme.colors.borderColor,
      shadow: theme.colors.shadowColor,
    },
    is_builtin: theme.isBuiltIn,
    created_at: theme.createdAt,
  }
}

/**
 * 获取所有可用主题
 */
export function getThemes() {
  return request<ReaderThemeListResponse>({
    url: '/api/v1/reader/themes',
    method: 'get',
  }).then((response) => response.themes.map(toTheme))
}

/**
 * 获取内置主题
 */
export function getBuiltinThemes() {
  return getThemes().then((themes) => themes.filter((theme) => theme.is_builtin))
}

/**
 * 获取用户自定义主题
 */
export function getCustomThemes() {
  return getThemes().then((themes) => themes.filter((theme) => !theme.is_builtin))
}

/**
 * 获取当前激活主题
 */
export function getActiveTheme() {
  return request<Theme>({
    url: '/api/v1/reader/themes/active',
    method: 'get',
  })
}

/**
 * 设置激活主题
 */
export function setActiveTheme(themeId: string) {
  return request<{ success: boolean }>({
    url: `/api/v1/reader/themes/${themeId}/activate`,
    method: 'post',
  })
}

/**
 * 创建自定义主题
 */
export function createCustomTheme(data: CreateThemeParams) {
  return request<Theme>({
    url: '/api/v1/reader/themes',
    method: 'post',
    data,
  })
}

/**
 * 更新自定义主题
 */
export function updateCustomTheme(themeId: string, data: Partial<CreateThemeParams>) {
  return request<Theme>({
    url: `/api/v1/reader/themes/${themeId}`,
    method: 'put',
    data,
  })
}

/**
 * 删除自定义主题
 */
export function deleteCustomTheme(themeId: string) {
  return request<{ success: boolean }>({
    url: `/api/v1/reader/themes/${themeId}`,
    method: 'delete',
  })
}

/**
 * 导出主题
 */
export function exportTheme(themeId: string) {
  return request<{ theme: Theme; data: string }>({
    url: `/api/v1/reader/themes/${themeId}/export`,
    method: 'get',
  })
}

/**
 * 导入主题
 */
export function importTheme(data: { name: string; theme_data: string }) {
  return request<Theme>({
    url: '/api/v1/reader/themes/import',
    method: 'post',
    data,
  })
}

// 预定义主题配色
export const builtinThemes: Theme[] = [
  {
    id: 'light',
    name: '明亮',
    type: 'light',
    colors: {
      background: '#ffffff',
      foreground: '#333333',
      accent: '#409EFF',
      secondary: '#909399',
      border: '#DCDFE6',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    is_builtin: true,
  },
  {
    id: 'dark',
    name: '暗黑',
    type: 'dark',
    colors: {
      background: '#1a1a1a',
      foreground: '#e0e0e0',
      accent: '#409EFF',
      secondary: '#909399',
      border: '#4c4d4f',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
    is_builtin: true,
  },
  {
    id: 'sepia',
    name: '护眼',
    type: 'sepia',
    colors: {
      background: '#f4ecd8',
      foreground: '#5c4b37',
      accent: '#d4a058',
      secondary: '#8b7355',
      border: '#e3d5b8',
      shadow: 'rgba(92, 75, 55, 0.1)',
    },
    is_builtin: true,
  },
  {
    id: 'eye-care',
    name: '夜间护眼',
    type: 'eye-care',
    colors: {
      background: '#c7edcc',
      foreground: '#2d5a30',
      accent: '#52c41a',
      secondary: '#5a8d5f',
      border: '#a8d5ae',
      shadow: 'rgba(45, 90, 48, 0.1)',
    },
    is_builtin: true,
  },
  {
    id: 'night',
    name: '夜间',
    type: 'night',
    colors: {
      background: '#0f0f0f',
      foreground: '#b0b0b0',
      accent: '#5D5D5D',
      secondary: '#707070',
      border: '#2a2a2a',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
    is_builtin: true,
  },
]
