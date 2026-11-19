import test from 'node:test'
import assert from 'node:assert/strict'
import { createStandaloneHtml } from '../src/services/exportService.js'

test('builds a self-contained HTML document with the selected design theme and system typography', () => {
  const html = createStandaloneHtml({
    markup: '<article class="template template-minimal"><h1>Example</h1></article>',
    title: 'project <script>alert(1)</script>',
    templateId: 'minimal',
    theme: 'dark',
    designTheme: 'golden',
  })

  assert.match(html, /^<!doctype html>/i)
  assert.match(html, /project &lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.match(html, /preview-theme-dark/)
  assert.match(html, /--design-gradient:linear-gradient\(125deg,#704b16,#dfab4e\)/)
  assert.match(html, /font-family:system-ui/)
  assert.doesNotMatch(html, /Georgia|Times New Roman/)
  assert.match(html, /template template-minimal/)
})

test('uses safe defaults for invalid export preferences', () => {
  const html = createStandaloneHtml({
    markup: '<p>text</p>',
    title: 'Example',
    templateId: 'unknown',
    theme: 'auto',
    designTheme: 'unknown',
  })

  assert.match(html, /template-modern preview-theme-light/)
  assert.match(html, /--design-gradient:linear-gradient\(125deg,#262b3c,#64578c\)/)
})

test('exports all five supported gradient themes', () => {
  const themes = [
    ['violet', '#262b3c,#64578c'],
    ['hot-pink', '#702248,#f04e82'],
    ['green', '#145447,#63ad78'],
    ['blue-violet', '#174b81,#7659d8'],
    ['golden', '#704b16,#dfab4e'],
  ]

  for (const [designTheme, gradient] of themes) {
    const html = createStandaloneHtml({
      markup: '<p>text</p>',
      title: 'Example',
      templateId: 'modern',
      theme: 'light',
      designTheme,
    })
    assert.ok(html.includes(`linear-gradient(125deg,${gradient})`), `${designTheme} gradient should be exported`)
  }
})
