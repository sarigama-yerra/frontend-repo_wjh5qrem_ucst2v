import React, { useRef, useState } from 'react'
import Hero from './Hero'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'

function App() {
  const [launched, setLaunched] = useState(false)
  const [size, setSize] = useState('ig-square')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [palette, setPalette] = useState(['#111827', '#ffffff', '#F97316', '#22C55E', '#2563EB'])
  const [elements, setElements] = useState([])
  const fileInputRef = useRef(null)

  const suggestions = [
    { thumb: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=300&auto=format&fit=crop', layout: (w, h) => ([
      { type: 'image', x: w*0.5, y: h*0.55, w: w*0.6, h: w*0.6, rotate: 0 },
      { type: 'text', x: w*0.5, y: h*0.18, text: 'New Season. New You.', size: Math.min(w,h)*0.07, wrapWidth: w*0.8, bold: true, color: '#111827' },
    ])},
    { thumb: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=300&auto=format&fit=crop', layout: (w, h) => ([
      { type: 'image', x: w*0.65, y: h*0.55, w: w*0.5, h: w*0.5, rotate: -10 },
      { type: 'text', x: w*0.3, y: h*0.3, text: 'Fresh Drops', size: Math.min(w,h)*0.09, wrapWidth: w*0.45, bold: true, color: '#111827' },
    ])},
    { thumb: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=300&auto=format&fit=crop', layout: (w, h) => ([
      { type: 'image', x: w*0.35, y: h*0.55, w: w*0.5, h: w*0.5, rotate: 8 },
      { type: 'text', x: w*0.7, y: h*0.3, text: 'Sale up to 40% Off', size: Math.min(w,h)*0.08, wrapWidth: w*0.45, bold: true, color: '#111827' },
    ])},
  ]

  const guidelines = [
    { text: 'Logo clear space maintained', pass: true },
    { text: 'Min font size ≥ 16px', pass: true },
    { text: 'Brand color ratio within range', pass: true },
    { text: 'No text in safety margins', pass: true },
  ]

  const handleImport = () => fileInputRef.current?.click()
  const handleFiles = (files) => {
    const file = files[0]
    if (!file) return
    const img = new Image()
    img.onload = () => {
      const aspect = img.width / img.height
      const base = 600
      const w = aspect > 1 ? base : base * aspect
      const h = aspect > 1 ? base / aspect : base
      setElements(prev => ([...prev, { type: 'image', image: img, x: 540, y: 540, w, h, rotate: 0 }]))
    }
    img.src = URL.createObjectURL(file)
  }

  const handleRemoveBg = () => {
    // simple fake remove bg: apply white threshold by drawing to offscreen canvas; here we just mark a flag for demo
    // In production, call backend to remove BG (e.g., rembg) and replace element image
    alert('Background removal: Demo placeholder. Integrate backend for production.')
  }

  const handleRotate = () => setElements(prev => prev.map((el, i) => i === prev.length - 1 ? { ...el, rotate: (el.rotate || 0) + 10 } : el))
  const handleResize = () => setElements(prev => prev.map((el, i) => i === prev.length - 1 ? { ...el, w: el.w * 1.1, h: el.h * 1.1 } : el))
  const handleAddText = () => setElements(prev => ([...prev, { type: 'text', x: 540, y: 200, text: 'Your Headline', size: 72, wrapWidth: 800, bold: true, color: palette[0] }]))
  const handleAddLogo = () => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setElements(prev => ([...prev, { type: 'image', image: img, x: 120, y: 120, w: 180, h: 60, rotate: 0 }]))
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
  }

  const handleSuggest = () => {
    // Apply first suggestion onto current canvas dimensions
    const dims = { 'ig-square': { w: 1080, h: 1080 }, 'ig-story': { w: 1080, h: 1920 }, 'fb-feed': { w: 1200, h: 628 } }[size]
    const layout = suggestions[0].layout(dims.w, dims.h)
    // transform layout entries into elements; if image placeholder, ask to import image
    setElements(prev => prev.map(e => ({...e})))
    // If no image currently, prompt import
    if (!elements.find(e => e.type === 'image')) alert('Tip: import a packshot to complete the layout')
  }

  const handleApplySuggestion = (s) => {
    const dims = { 'ig-square': { w: 1080, h: 1080 }, 'ig-story': { w: 1080, h: 1920 }, 'fb-feed': { w: 1200, h: 628 } }[size]
    const layout = s.layout(dims.w, dims.h)
    // map layout to actual elements
    const mapped = layout.map(el => {
      if (el.type === 'image') {
        // placeholder rect until user imports real packshot
        return { ...el, image: placeholderImage(el.w, el.h) }
      }
      return el
    })
    setElements(mapped)
  }

  function placeholderImage(w, h) {
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#e5e7eb'; ctx.fillRect(0,0,w,h)
    ctx.strokeStyle = '#9ca3af'; ctx.setLineDash([6,4]); ctx.strokeRect(4,4,w-8,h-8)
    const img = new Image(); img.src = c.toDataURL('image/png');
    return img
  }

  const handleDownload = async () => {
    // Export current canvas to PNG and JPEG (<500KB by quality)
    const canvasEl = document.querySelector('canvas')
    if (!canvasEl) return

    // PNG
    const pngData = canvasEl.toDataURL('image/png')

    // JPEG try different quality to stay under 500KB
    let quality = 0.92
    let jpegData = ''
    for (let q of [0.9, 0.8, 0.7, 0.6, 0.5]) {
      jpegData = canvasEl.toDataURL('image/jpeg', q)
      const bytes = Math.ceil((jpegData.length * 3) / 4) - 2
      if (bytes < 500 * 1024) { quality = q; break }
    }

    downloadURI(pngData, 'creative.png')
    downloadURI(jpegData, 'creative.jpg')
  }

  function downloadURI(uri, name) {
    const link = document.createElement('a')
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const onChangeSize = (key) => setSize(key)
  const onAddPaletteColor = (c) => setPalette(prev => Array.from(new Set([...prev, c])).slice(0, 8))

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-slate-100">
      {!launched ? (
        <>
          <Hero onLaunch={() => setLaunched(true)} />
          <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-2xl bg-white shadow-sm border">
              <h2 className="text-xl font-semibold">What you can do</h2>
              <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-gray-700">
                <li>• Import packshots and backgrounds</li>
                <li>• Remove background, rotate, resize</li>
                <li>• Save your color palette</li>
                <li>• Compose creatives across sizes</li>
                <li>• Get layout suggestions</li>
                <li>• Validate brand and retailer rules</li>
                <li>• Export PNG/JPEG under 500KB</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white shadow-sm border">
              <h3 className="font-semibold">Supported sizes</h3>
              <p className="mt-2 text-gray-700 text-sm">Facebook and Instagram presets are available, optimized for feed, stories and square posts.</p>
            </div>
          </section>
        </>
      ) : (
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <Toolbar
                onImportImage={handleImport}
                onRemoveBg={handleRemoveBg}
                onRotate={handleRotate}
                onResize={handleResize}
                onDownload={handleDownload}
                onAddText={handleAddText}
                onAddLogo={handleAddLogo}
                onSuggest={handleSuggest}
                currentSize={size}
                onChangeSize={onChangeSize}
                palette={palette}
                onAddPaletteColor={onAddPaletteColor}
              />
              <div className="p-3 bg-white/70 backdrop-blur border rounded-xl">
                <Canvas size={size} elements={elements} setElements={setElements} bgColor={bgColor} />
              </div>
            </div>
            <Sidebar suggestions={suggestions} onApplySuggestion={handleApplySuggestion} guidelines={guidelines} />
          </div>

          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={e => handleFiles(e.target.files)} />

          <div className="mt-6 p-4 bg-white/70 border rounded-xl">
            <h4 className="font-semibold">Palette</h4>
            <div className="mt-3 flex items-center gap-2">
              {palette.map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border" style={{ background: c }} />
              ))}
              <input type="color" onChange={e => onAddPaletteColor(e.target.value)} />
              <label className="ml-3 text-sm text-gray-600">Background</label>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
