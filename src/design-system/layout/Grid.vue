<template>
  <div :class="gridClasses" :style="gridStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ResponsiveColumns = { sm?: number; md?: number; lg?: number; xl?: number }

interface Props {
  cols?: number | ResponsiveColumns
  gap?: 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

const props = withDefaults(defineProps<Props>(), {
  cols: 3,
  gap: 'md',
  align: 'stretch',
  justify: 'start',
})

const gridClasses = computed(() => [
  'qy-grid',
  `qy-grid--gap-${props.gap}`,
  `qy-grid--align-${props.align}`,
  `qy-grid--justify-${props.justify}`,
])

const gridStyle = computed(() => {
  if (typeof props.cols === 'number') {
    return { gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))` }
  }
  return {
    '--qy-grid-sm': props.cols.sm ?? 1,
    '--qy-grid-md': props.cols.md ?? props.cols.sm ?? 1,
    '--qy-grid-lg': props.cols.lg ?? props.cols.md ?? props.cols.sm ?? 1,
    '--qy-grid-xl': props.cols.xl ?? props.cols.lg ?? props.cols.md ?? props.cols.sm ?? 1,
  }
})
</script>

<style scoped>
.qy-grid {
  display: grid;
}
.qy-grid--gap-sm {
  gap: 0.5rem;
}
.qy-grid--gap-md {
  gap: 1rem;
}
.qy-grid--gap-lg {
  gap: 1.5rem;
}
.qy-grid--align-start {
  align-items: start;
}
.qy-grid--align-center {
  align-items: center;
}
.qy-grid--align-end {
  align-items: end;
}
.qy-grid--align-stretch {
  align-items: stretch;
}
.qy-grid--justify-start {
  justify-content: start;
}
.qy-grid--justify-center {
  justify-content: center;
}
.qy-grid--justify-end {
  justify-content: end;
}
.qy-grid--justify-between {
  justify-content: space-between;
}
.qy-grid--justify-around {
  justify-content: space-around;
}

@media (max-width: 640px) {
  .qy-grid {
    grid-template-columns: repeat(var(--qy-grid-sm, 1), minmax(0, 1fr));
  }
}
@media (min-width: 641px) {
  .qy-grid {
    grid-template-columns: repeat(var(--qy-grid-md, 1), minmax(0, 1fr));
  }
}
@media (min-width: 1025px) {
  .qy-grid {
    grid-template-columns: repeat(var(--qy-grid-lg, 1), minmax(0, 1fr));
  }
}
@media (min-width: 1281px) {
  .qy-grid {
    grid-template-columns: repeat(var(--qy-grid-xl, 1), minmax(0, 1fr));
  }
}
</style>
