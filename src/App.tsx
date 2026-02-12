import { useState } from 'react'
import { Home } from './components/Home'
import { Converter } from './components/Converter'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'converter'>('home')
  const [converterType, setConverterType] = useState<string>('mp4-to-mp3')

  const handleSelectConverter = (id: string) => {
    setConverterType(id)
    setCurrentView('converter')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  return (
    <div className="app">
      <div className="bg-canvas" aria-hidden="true">
        <div className="bg-gradient" />
        <div className="bg-vignette" />
        <div className="bg-particles" />
        <div className="bg-streak" />
      </div>
      <div className="app-content">
        {currentView === 'home' ? (
          <Home onSelectConverter={handleSelectConverter} />
        ) : (
          <Converter converterType={converterType} onBack={handleBackToHome} />
        )}
      </div>
    </div>
  )
}

export default App
