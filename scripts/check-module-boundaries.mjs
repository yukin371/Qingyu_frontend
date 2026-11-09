import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourceRoot = path.join(root, 'src')
const strict = process.argv.includes('--strict')
const sourceExtensions = new Set(['.ts', '.tsx', '.vue', '.js', '.jsx'])
const violations = []
const advisories = []
const baselinePath = path.join(root, 'scripts/module-boundary-baseline.json')
const baseline = new Set(JSON.parse(fs.readFileSync(baselinePath, 'utf8')))

function collectFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectFiles(entryPath)
    return sourceExtensions.has(path.extname(entry.name)) ? [entryPath] : []
  })
}

function importsFrom(source) {
  const matches = source.matchAll(/(?:from\s*|import\s*\()(['"])(@\/[^'"`]+)\1/g)
  return [...matches].map((match) => match[2])
}

function moduleName(importPath) {
  const match = importPath.match(/^@\/modules\/([^/]+)/)
  return match?.[1] ?? null
}

for (const filePath of collectFiles(sourceRoot)) {
  const relativeFile = path.relative(root, filePath).replaceAll(path.sep, '/')
  const source = fs.readFileSync(filePath, 'utf8')
  const currentModule = relativeFile.match(/^src\/modules\/([^/]+)/)?.[1] ?? null
  const isDesignSystem = relativeFile.startsWith('src/design-system/')
  const isShared = relativeFile.startsWith('src/shared/')

  for (const importPath of importsFrom(source)) {
    if (importPath === '@/shared/components/design-system' || importPath.startsWith('@/shared/components/design-system/')) {
      violations.push(`${relativeFile}: 禁止引用冻结设计系统入口 ${importPath}`)
    }

    const importedModule = moduleName(importPath)
    const isModuleApiEntry =
      importedModule !== null &&
      importPath === `@/modules/${importedModule}/api` &&
      fs.existsSync(path.join(sourceRoot, 'modules', importedModule, 'api', 'index.ts'))
    if ((isDesignSystem || isShared) && importedModule) {
      violations.push(`${relativeFile}: ${isDesignSystem ? 'design-system' : 'shared'} 层反向依赖业务模块 ${importPath}`)
    }

    const isModuleEntry =
      /^@\/modules\/[^/]+(?:\/(?:index|public))?$/.test(importPath) ||
      importPath.endsWith('/index')
    if (
      currentModule &&
      importedModule &&
      currentModule !== importedModule &&
      !isModuleEntry &&
      !isModuleApiEntry
    ) {
      advisories.push(`${relativeFile}: 跨模块深层导入 ${importPath}`)
    }
  }
}

const newViolations = violations.filter((item) => !baseline.has(item))
const baselineViolations = violations.filter((item) => baseline.has(item))

console.log(`模块边界检查：${strict ? 'strict' : 'report'} 模式`)
console.log(`新严格违规：${newViolations.length}`)
console.log(`已登记待迁移违规：${baselineViolations.length}`)
console.log(`跨模块深层导入提示：${advisories.length}`)

for (const item of newViolations) console.error(`ERROR ${item}`)
for (const item of baselineViolations) console.warn(`TODO ${item}`)
for (const item of advisories) console.log(`WARN ${item}`)

if (strict && newViolations.length > 0) process.exitCode = 1
