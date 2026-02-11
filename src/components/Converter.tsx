import { useState, useCallback } from 'react'
import { useFFmpeg } from '../hooks/useFFmpeg'
import './Converter.css'

export function Converter() {
  const { load, convertToMp3, loaded, loading, progress, error } = useFFmpeg()
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [convertError, setConvertError] = useState<string | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('video/') || f?.name.endsWith('.mp4')) {
      setFile(f)
      setResultBlob(null)
      setConvertError(null)
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setResultBlob(null)
      setConvertError(null)
    }
  }, [])

  const handleConvert = useCallback(async () => {
    if (!file) return
    setConverting(true)
    setConvertError(null)
    try {
      const blob = await convertToMp3(file)
      setResultBlob(blob)
    } catch {
      setConvertError('Falha na conversão. Tente um vídeo menor ou mais curto.')
    } finally {
      setConverting(false)
    }
  }, [file, convertToMp3])

  const handleDownload = useCallback(() => {
    if (!resultBlob || !file) return
    const name = file.name.replace(/\.[^.]+$/, '') + '.mp3'
    const url = URL.createObjectURL(resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }, [resultBlob, file])

  const displayError = error ?? convertError

  return (
    <div className="converter">
      <header className="converter-header">
        <h1>MP4 → MP3</h1>
        <p>Envie um vídeo e baixe o áudio em MP3. Tudo no seu navegador.</p>
      </header>

      {!loaded && !loading && (
        <button type="button" className="btn btn-primary" onClick={load}>
          Iniciar conversor
        </button>
      )}

      {loading && (
        <div className="converter-status">Carregando FFmpeg…</div>
      )}

      {loaded && (
        <>
          <div
            className={`dropzone ${file ? 'has-file' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="video/mp4,video/*,.mp4"
              onChange={handleFileInput}
              id="file-input"
            />
            <label htmlFor="file-input">
              {file
                ? file.name
                : 'Arraste um MP4 aqui ou clique para escolher'}
            </label>
          </div>

          {file && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConvert}
              disabled={converting}
            >
              {converting ? `Convertendo… ${progress}%` : 'Converter para MP3'}
            </button>
          )}

          {converting && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

          {resultBlob && (
            <div className="result">
              <span className="result-label">Pronto!</span>
              <button type="button" className="btn btn-success" onClick={handleDownload}>
                Baixar MP3
              </button>
            </div>
          )}
        </>
      )}

      {displayError && (
        <div className="converter-error" role="alert">
          {displayError}
        </div>
      )}
    </div>
  )
}
