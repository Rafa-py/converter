import { Converter } from './components/Converter'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="bg-canvas" aria-hidden="true">
        <div className="bg-gradient" />
        <div className="bg-vignette" />
        <div className="bg-particles" />
        <div className="bg-streak" />
      </div>
      <div className="app-content">
        <Converter />
      </div>
    </div>
  )
}

export default App
