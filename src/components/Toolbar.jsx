import React from 'react'

export default function Toolbar({ onImportImage, onRemoveBg, onRotate, onResize, onDownload, onAddText, onAddLogo, onSuggest, currentSize, onChangeSize, palette, onAddPaletteColor }) {
  const sizes = [
    { key: 'ig-square', label: 'Instagram 1080x1080', w: 1080, h: 1080 },
    { key: 'ig-story', label: 'IG Story 1080x1920', w: 1080, h: 1920 },
    { key: 'fb-feed', label: 'Facebook Feed 1200x628', w: 1200, h: 628 },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white/80 backdrop-blur border rounded-xl shadow-sm">
      <select className="px-3 py-2 rounded-md border bg-white" value={currentSize} onChange={e => onChangeSize(e.target.value)}>
        {sizes.map(s => (
          <option key={s.key} value={s.key}>{s.label}</option>
        ))}
      </select>

      <button className="px-3 py-2 rounded-md bg-gray-900 text-white" onClick={onImportImage}>Import Image</button>
      <button className="px-3 py-2 rounded-md bg-emerald-600 text-white" onClick={onRemoveBg}>Remove BG</button>
      <button className="px-3 py-2 rounded-md bg-indigo-600 text-white" onClick={onRotate}>Rotate</button>
      <button className="px-3 py-2 rounded-md bg-blue-600 text-white" onClick={onResize}>Resize</button>
      <button className="px-3 py-2 rounded-md bg-violet-600 text-white" onClick={onAddText}>Add Text</button>
      <button className="px-3 py-2 rounded-md bg-pink-600 text-white" onClick={onAddLogo}>Add Logo</button>
      <button className="px-3 py-2 rounded-md bg-amber-600 text-white" onClick={onSuggest}>Suggest Layouts</button>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-2">
          {palette.map((c, i) => (
            <button key={i} className="w-6 h-6 rounded-full border" style={{ background: c }} title={c} onClick={() => onAddPaletteColor(c)} />
          ))}
        </div>
        <label className="px-3 py-2 rounded-md border bg-white cursor-pointer">
          Add Color
          <input type="color" className="hidden" onChange={e => onAddPaletteColor(e.target.value)} />
        </label>
        <button className="px-3 py-2 rounded-md border" onClick={onDownload}>Download</button>
      </div>
    </div>
  )
}
