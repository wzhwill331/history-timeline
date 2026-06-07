const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, 'dist')
const htmlPath = path.join(distDir, 'index.html')

let html = fs.readFileSync(htmlPath, 'utf-8')

// 读取 JS
const jsMatch = html.match(/src="\.\/(assets\/[^"]+\.js)"/)
if (jsMatch) {
  const jsPath = path.join(distDir, jsMatch[1])
  let jsCode = fs.readFileSync(jsPath, 'utf-8')

  // 转义所有 </script> 为 <\/script>（包括字符串和正则里的）
  jsCode = jsCode.split('</script>').join('<\\/script>')

  // 替换 HTML 中的 script 标签
  html = html.replace(
    /<script[^>]*src="[^"]*"[^>]*><\/script>/,
    '<script>' + jsCode + '</script>'
  )
  console.log('Inlined JS: ' + jsMatch[1] + ' (' + (jsCode.length / 1024).toFixed(0) + ' KB)')
}

// 读取 CSS（如果有）
const cssMatch = html.match(/href="\.\/(assets\/[^"]+\.css)"/)
if (cssMatch) {
  const cssPath = path.join(distDir, cssMatch[1])
  const cssCode = fs.readFileSync(cssPath, 'utf-8')
  html = html.replace(
    /<link[^>]*href="[^"]*\.css"[^>]*>/,
    '<style>' + cssCode + '</style>'
  )
  console.log('Inlined CSS: ' + cssMatch[1])
}

// 移除 type="module" 和 crossorigin
html = html.replace(/type="module"/g, '')
html = html.replace(/crossorigin/g, '')

// 写出
const outPath = path.join(distDir, '历史时光轴.html')
fs.writeFileSync(outPath, html, 'utf-8')

// 验证：检查闭合标签数量
const scriptCloseCount = (html.match(/<\/script>/g) || []).length
console.log('script close tags: ' + scriptCloseCount)
console.log('Done: ' + outPath)
console.log('Size: ' + (fs.statSync(outPath).size / 1024).toFixed(0) + ' KB')
