import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const frontendRoot = path.resolve(scriptDir, '..')
const modulesRoot = path.join(frontendRoot, 'src', 'modules')
const factorySignature =
  'export const getApi = (axiosInstance: AxiosInstance = axios) => {'
const normalizedSignature =
  'export const getApi = (_axiosInstance: AxiosInstance = axios) => {'

function collectGeneratedFiles(directory) {
  if (!fs.existsSync(directory)) return []

  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectGeneratedFiles(entryPath))
    } else if (entry.isFile() && entry.name.endsWith('.ts') && entryPath.includes(`${path.sep}api${path.sep}generated${path.sep}`)) {
      files.push(entryPath)
    }
  }
  return files
}

let changed = 0
for (const filePath of collectGeneratedFiles(modulesRoot)) {
  const source = fs.readFileSync(filePath, 'utf8')
  if (!source.includes(factorySignature)) continue

  fs.writeFileSync(filePath, source.replaceAll(factorySignature, normalizedSignature))
  changed += 1
}

console.log(`Normalized Orval factory parameters in ${changed} generated file(s).`)
