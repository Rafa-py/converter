import './Logo.css'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

export function Logo({ size = 'medium', showText = true }: LogoProps) {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large'
  }

  return (
    <div className={`logo-container ${sizeClasses[size]}`}>
      <svg
        className="logo-icon"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Círculo de fundo com gradiente amarelo */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="url(#logoGradient)"
          className="logo-circle"
        />
        
        {/* Ícone de conversão/transformação - setas circulares */}
        <path
          d="M35 60 L50 45 M50 45 L50 55 L65 55 L65 45 M85 60 L70 75 M70 75 L70 65 L55 65 L55 75"
          stroke="#2b2b35"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-arrows"
        />
        
        {/* Círculo central */}
        <circle
          cx="60"
          cy="60"
          r="8"
          fill="url(#logoGradientDark)"
          className="logo-center"
        />
        
        {/* Gradientes */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
          <linearGradient id="logoGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <div className="logo-text">
          <span className="logo-name">Jimmy</span>
          <span className="logo-subtitle">Free Converter</span>
        </div>
      )}
    </div>
  )
}
