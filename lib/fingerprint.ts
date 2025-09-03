// Modern fingerprinting without WebGL context issues
export const generateFingerprint = (): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('server-side-fallback')
      return
    }

    try {
      const components: string[] = []
      
      // Screen properties
      components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`)
      components.push(`${screen.availWidth}x${screen.availHeight}`)
      
      // Timezone
      components.push(Intl.DateTimeFormat().resolvedOptions().timeZone)
      
      // Language
      components.push(navigator.language)
      components.push(navigator.languages?.join(',') || '')
      
      // Platform info
      components.push(navigator.platform)
      components.push(navigator.userAgent)
      
      // Memory (if available)
      if ('deviceMemory' in navigator) {
        components.push(String((navigator as any).deviceMemory))
      }
      
      // Hardware concurrency
      components.push(String(navigator.hardwareConcurrency || 0))
      
      // Cookie enabled
      components.push(String(navigator.cookieEnabled))
      
      // Do not track
      components.push(String((navigator as any).doNotTrack || 'unknown'))
      
      // Canvas fingerprint (safe, no WebGL)
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = 200
          canvas.height = 50
          ctx.textBaseline = 'top'
          ctx.font = '14px Arial'
          ctx.fillText('Fingerprint test 🔒', 2, 2)
          components.push(canvas.toDataURL())
        }
      } catch (e) {
        components.push('canvas-error')
      }
      
      // Simple hash function
      const hash = simpleHash(components.join('|'))
      resolve(hash)
      
    } catch (error) {
      console.warn('Fingerprint generation error:', error)
      // Fallback to timestamp + random
      resolve(`fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
    }
  })
}

// Simple hash function to replace x64hash128
function simpleHash(str: string): string {
  let hash = 0
  if (str.length === 0) return hash.toString()
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}