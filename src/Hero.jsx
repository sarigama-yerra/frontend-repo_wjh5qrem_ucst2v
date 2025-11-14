import React from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero({ onLaunch }) {
  return (
    <section className="relative w-full h-[72vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto text-white">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Generative AI • Creative Builder • Compliance Ready
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Retail Media Creative Tool Hackathon
          </h1>
          <p className="mt-4 text-white/90 text-base sm:text-lg md:text-xl">
            Build guideline-compliant, professional creatives. Import packshots, compose visuals, validate, and export ready-to-run sets.
          </p>
          <div className="mt-8">
            <button onClick={onLaunch} className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition">
              Launch the Builder
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5 4.5a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V6.31l-7.22 7.22a.75.75 0 1 1-1.06-1.06l7.22-7.22h-3.44a.75.75 0 0 1-.75-.75Z"/><path d="M5.25 5.25A2.25 2.25 0 0 0 3 7.5v11.25A2.25 2.25 0 0 0 5.25 21h11.25A2.25 2.25 0 0 0 18.75 18.75V12a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 1 .75-.75H12a.75.75 0 0 0 0-1.5H5.25Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
