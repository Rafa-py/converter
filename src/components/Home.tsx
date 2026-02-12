import { Logo } from './Logo'
import './Home.css'

interface ConverterCard {
  id: string
  title: string
  description: string
  from: string
  to: string
  icon: string
  available: boolean
  comingSoon?: boolean
}

const converters: ConverterCard[] = [
  {
    id: 'mp4-to-mp3',
    title: 'MP4 para MP3',
    description: 'Extraia áudio de vídeos MP4',
    from: 'MP4',
    to: 'MP3',
    icon: '🎵',
    available: true
  },
  {
    id: 'mp3-to-wav',
    title: 'MP3 para WAV',
    description: 'Converta áudio MP3 em WAV',
    from: 'MP3',
    to: 'WAV',
    icon: '🔊',
    available: false,
    comingSoon: true
  },
  {
    id: 'docx-to-pdf',
    title: 'DOCX para PDF',
    description: 'Converta documentos Word em PDF',
    from: 'DOCX',
    to: 'PDF',
    icon: '📄',
    available: false,
    comingSoon: true
  },
  {
    id: 'png-to-jpg',
    title: 'PNG para JPG',
    description: 'Converta imagens PNG em JPG',
    from: 'PNG',
    to: 'JPG',
    icon: '🖼️',
    available: false,
    comingSoon: true
  },
  {
    id: 'pdf-to-docx',
    title: 'PDF para DOCX',
    description: 'Converta PDFs em documentos Word',
    from: 'PDF',
    to: 'DOCX',
    icon: '📝',
    available: false,
    comingSoon: true
  },
  {
    id: 'jpg-to-png',
    title: 'JPG para PNG',
    description: 'Converta imagens JPG em PNG',
    from: 'JPG',
    to: 'PNG',
    icon: '🎨',
    available: false,
    comingSoon: true
  }
]

interface HomeProps {
  onSelectConverter: (id: string) => void
}

export function Home({ onSelectConverter }: HomeProps) {
  return (
    <div className="home">
      <header className="home-header">
        <Logo size="large" />
        <h1 className="home-title">Conversão de Arquivos</h1>
        <p className="home-subtitle">
          Converta seus arquivos de forma rápida, segura e gratuita.
          Tudo acontece no seu navegador, sem envio para servidores.
        </p>
      </header>

      <div className="converters-grid">
        {converters.map((converter) => (
          <div
            key={converter.id}
            className={`converter-card ${converter.available ? 'available' : 'coming-soon'}`}
            onClick={() => converter.available && onSelectConverter(converter.id)}
            role={converter.available ? 'button' : undefined}
            tabIndex={converter.available ? 0 : undefined}
            onKeyDown={(e) => {
              if (converter.available && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                onSelectConverter(converter.id)
              }
            }}
          >
            <div className="converter-icon">{converter.icon}</div>
            <div className="converter-info">
              <h3 className="converter-title">{converter.title}</h3>
              <p className="converter-description">{converter.description}</p>
              <div className="converter-format">
                <span className="format-from">{converter.from}</span>
                <span className="format-arrow">→</span>
                <span className="format-to">{converter.to}</span>
              </div>
            </div>
            {converter.comingSoon && (
              <div className="coming-soon-badge">Em breve</div>
            )}
            {converter.available && (
              <div className="available-badge">Disponível</div>
            )}
          </div>
        ))}
      </div>

      <footer className="home-footer">
        <p className="footer-text">
          🔒 100% seguro • 🚀 Rápido • 💯 Gratuito • 🌐 Sem servidor
        </p>
      </footer>
    </div>
  )
}
