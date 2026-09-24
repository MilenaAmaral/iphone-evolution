import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import iphoneCatalog from '../src/data/iphoneCatalog.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDirectory = path.join(root, 'public', 'images', 'iphones')

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function getStyle(device) {
  if (device.year <= 2013) return { body: '#b8b7b2', edge: '#6f7070', screen: '#172332', radius: 30, camera: '#1d1f23' }
  if (device.year <= 2017) return { body: '#c9cbd0', edge: '#797c84', screen: '#141a24', radius: 24, camera: '#1c2028' }
  if (device.year <= 2020) return { body: '#b8beca', edge: '#737b88', screen: '#101722', radius: 26, camera: '#202633' }
  if (device.year <= 2024) return { body: '#aab0bc', edge: '#687080', screen: '#111925', radius: 27, camera: '#202633' }
  return { body: '#c0b8a8', edge: '#817767', screen: '#111821', radius: 28, camera: '#252229' }
}

function renderSvg(device, side) {
  const style = getStyle(device)
  const title = `${device.name} - ${side === 'front' ? 'vista frontal' : 'vista traseira'}`
  const camera = side === 'back'
    ? `<g fill="${style.camera}"><rect x="48" y="60" width="68" height="82" rx="18"/><circle cx="70" cy="84" r="11" fill="#0a0b0e"/><circle cx="95" cy="108" r="11" fill="#0a0b0e"/><circle cx="94" cy="78" r="5" fill="#d8b26b"/></g>`
    : ''
  const screen = side === 'front'
    ? `<rect x="34" y="28" width="116" height="244" rx="${Math.max(18, style.radius - 7)}" fill="${style.screen}"/><path d="M48 214c22-28 50-33 88-5" fill="none" stroke="#d8b26b" stroke-opacity=".42" stroke-width="2"/><circle cx="92" cy="47" r="3" fill="#697786"/>`
    : `<path d="M92 142c-18-18-42-1-42 18 0 30 42 55 42 55s42-25 42-55c0-19-24-36-42-18Z" fill="#d8b26b" fill-opacity=".72"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184 300" role="img" aria-labelledby="title"><title id="title">${escapeXml(title)}</title><defs><linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${style.body}"/><stop offset="1" stop-color="${style.edge}"/></linearGradient></defs><rect x="20" y="10" width="144" height="280" rx="${style.radius}" fill="url(#edge)"/><rect x="25" y="15" width="134" height="270" rx="${style.radius - 4}" fill="${style.body}" stroke="#f2f1ee" stroke-opacity=".24"/>${screen}${camera}<text x="92" y="265" fill="#f2f1ee" fill-opacity=".28" font-family="sans-serif" font-size="7" text-anchor="middle">${escapeXml(device.name)}</text></svg>`
}

await fs.mkdir(outputDirectory, { recursive: true })

for (const device of iphoneCatalog.filter((item) => item.type === 'image')) {
  await Promise.all(['front', 'back'].map((side) => fs.writeFile(
    path.join(outputDirectory, `${device.id}-${side}.svg`),
    renderSvg(device, side),
    'utf8',
  )))
}

console.log(`Generated ${iphoneCatalog.filter((item) => item.type === 'image').length * 2} local SVG assets.`)