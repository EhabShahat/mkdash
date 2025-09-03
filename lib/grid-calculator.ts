export const calculateGrid = (totalCards: number): { cols: number; rows: number } => {
  if (totalCards === 0) return { cols: 1, rows: 1 }
  
  // Find the best grid dimensions that fit the screen nicely
  const sqrt = Math.sqrt(totalCards)
  let cols = Math.ceil(sqrt)
  let rows = Math.ceil(totalCards / cols)
  
  // Adjust for better aspect ratios
  if (cols * (rows - 1) >= totalCards) {
    rows = rows - 1
  }
  
  // Ensure we don't have too many columns on mobile
  if (typeof window !== 'undefined') {
    const isMobile = window.innerWidth < 768
    if (isMobile && cols > 2) {
      cols = 2
      rows = Math.ceil(totalCards / cols)
    }
  }
  
  return { cols, rows }
}

export const getGridClasses = (totalCards: number): string => {
  const { cols } = calculateGrid(totalCards)
  
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
  }
  
  return gridClasses[cols as keyof typeof gridClasses] || 'grid-cols-4'
}