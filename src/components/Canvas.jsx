import React, { useRef, useState, useEffect } from 'react'

export default function Canvas({ size, elements, setElements, bgColor }) {
  const canvasRef = useRef(null)
  const [dragIndex, setDragIndex] = useState(null)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const dimsByKey = {
    'ig-square': { w: 1080, h: 1080 },
    'ig-story': { w: 1080, h: 1920 },
    'fb-feed': { w: 1200, h: 628 },
  }
  const { w, h } = dimsByKey[size] || dimsByKey['ig-square']

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // scale down to fit container width while maintaining pixel density
    const dpr = window.devicePixelRatio || 1
    const containerWidth = canvas.parentElement.clientWidth
    const scale = containerWidth / w
    const displayW = Math.min(containerWidth, w)
    const displayH = h * scale

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = displayW + 'px'
    canvas.style.height = displayH + 'px'

    ctx.scale(dpr, dpr)
    ctx.fillStyle = bgColor || '#ffffff'
    ctx.fillRect(0, 0, w, h)

    elements.forEach(el => {
      ctx.save()
      ctx.translate(el.x, el.y)
      ctx.rotate((el.rotate || 0) * Math.PI / 180)
      if (el.type === 'image' && el.image?.complete) {
        ctx.drawImage(el.image, -el.w / 2, -el.h / 2, el.w, el.h)
      }
      if (el.type === 'text') {
        ctx.font = `${el.bold ? '700' : '400'} ${el.size || 64}px Inter, sans-serif`
        ctx.fillStyle = el.color || '#111827'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        wrapText(ctx, el.text || 'Your Headline', 0, 0, el.wrapWidth || (w * 0.8), 1.2)
      }
      ctx.restore()
    })
  }, [elements, size, bgColor])

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ')
    let line = ''
    let lines = []
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line)
        line = words[n] + ' '
      } else {
        line = testLine
      }
    }
    lines.push(line)
    lines.forEach((l, i) => {
      ctx.fillText(l.trim(), x, y + (i * (parseInt(ctx.font) * lineHeight)))
    })
  }

  const onPointerDown = (e) => {
    const rect = e.target.getBoundingClientRect()
    const scaleX = w / rect.width
    const scaleY = h / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    // hit test: naive bounding boxes
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i]
      const bb = { x: el.x - el.w / 2, y: el.y - el.h / 2, w: el.w, h: el.h }
      if (el.type === 'text') {
        bb.w = el.wrapWidth || w * 0.8
        bb.h = el.size * 1.4
        bb.x = el.x - bb.w / 2
        bb.y = el.y - bb.h / 2
      }
      if (x >= bb.x && x <= bb.x + bb.w && y >= bb.y && y <= bb.y + bb.h) {
        setDragIndex(i)
        setLastPos({ x, y })
        return
      }
    }
    setDragIndex(null)
  }

  const onPointerMove = (e) => {
    if (dragIndex === null) return
    const rect = e.target.getBoundingClientRect()
    const scaleX = w / rect.width
    const scaleY = h / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    const dx = x - lastPos.x
    const dy = y - lastPos.y
    setLastPos({ x, y })

    setElements(prev => prev.map((el, i) => i === dragIndex ? { ...el, x: el.x + dx, y: el.y + dy } : el))
  }

  const onPointerUp = () => setDragIndex(null)

  return (
    <div className="w-full">
      <div className="relative w-full border rounded-xl overflow-hidden bg-[var(--canvas-bg,#ffffff)]" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        <canvas ref={canvasRef} className="block w-full h-auto" />
      </div>
    </div>
  )
}
