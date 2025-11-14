import React from 'react'

export default function Sidebar({ suggestions, onApplySuggestion, guidelines }) {
  return (
    <aside className="w-full md:w-80 bg-white/70 backdrop-blur border rounded-xl p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900">Guideline Checks</h3>
        <ul className="mt-2 space-y-2 text-sm text-gray-700">
          {guidelines.map((g, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className={`mt-1 w-2 h-2 rounded-full ${g.pass ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{g.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">Suggested Layouts</h3>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => onApplySuggestion(s)} className="border rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition">
              <img src={s.thumb} alt="suggestion" className="w-full h-20 object-cover" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
