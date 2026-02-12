import { useState, useCallback } from 'react'
import { useFFmpeg, ConversionItem } from '../hooks/useFFmpeg'
import './Converter.css'

export function Converter() {
  const { load, convertBatch, loaded, loading, error } = useFFmpeg()
  const [items, setItems] = useState<ConversionItem[]>([])
  const [converting, setConverting] = useState(false)
  const [convertError, setConvertError] = useState<string | null>(null)

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return
    
    const newItems: ConversionItem[] = Array.from(files)
      .filter(f => f.type.startsWith('video/') || f.name.endsWith('.mp4'))
      .map((file, index) => ({
        id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        status: 'pending' as const,
        progress: 0
      }))
    
    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems])
      setConvertError(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    // Reset input para permitir selecionar o mesmo arquivo novamente
    e.target.value = ''
  }, [addFiles])

  const updateItem = useCallback((id: string, updates: Partial<ConversionItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const handleConvert = useCallback(async () => {
    const pendingItems = items.filter(item => item.status === 'pending')
    if (pendingItems.length === 0) return
    
    setConverting(true)
    setConvertError(null)
    try {
      await convertBatch(items, updateItem)
    } catch {
      setConvertError('Falha na conversão. Tente vídeos menores ou mais curtos.')
    } finally {
      setConverting(false)
    }
  }, [items, convertBatch, updateItem])

  const handleDownload = useCallback((item: ConversionItem) => {
    if (!item.resultBlob) return
    const name = item.file.name.replace(/\.[^.]+$/, '') + '.mp3'
    const url = URL.createObjectURL(item.resultBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleDownloadAll = useCallback(() => {
    items
      .filter(item => item.status === 'completed' && item.resultBlob)
      .forEach(item => handleDownload(item))
  }, [items, handleDownload])

  const completedCount = items.filter(item => item.status === 'completed').length
  const hasPending = items.some(item => item.status === 'pending')
  const hasCompleted = completedCount > 0

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
            className={`dropzone ${items.length > 0 ? 'has-file' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="video/mp4,video/*,.mp4"
              onChange={handleFileInput}
              id="file-input"
              multiple
            />
            <label htmlFor="file-input">
              {items.length === 0
                ? 'Arraste MP4s aqui ou clique para escolher (múltiplos arquivos)'
                : `${items.length} arquivo${items.length > 1 ? 's' : ''} selecionado${items.length > 1 ? 's' : ''}`}
            </label>
          </div>

          {items.length > 0 && (
            <div className="files-list">
              {items.map((item) => (
                <div key={item.id} className="file-item">
                  <div className="file-info">
                    <span className="file-name" title={item.file.name}>
                      {item.file.name}
                    </span>
                    <span className="file-size">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  
                  {item.status === 'converting' && (
                    <div className="file-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                      <span className="progress-text">{item.progress}%</span>
                    </div>
                  )}
                  
                  {item.status === 'completed' && (
                    <div className="file-actions">
                      <span className="status-success">✓ Pronto</span>
                      <button
                        type="button"
                        className="btn btn-success btn-small"
                        onClick={() => handleDownload(item)}
                      >
                        Baixar
                      </button>
                    </div>
                  )}
                  
                  {item.status === 'error' && (
                    <div className="file-error">
                      <span className="error-text">{item.error || 'Erro na conversão'}</span>
                    </div>
                  )}
                  
                  {item.status === 'pending' && (
                    <div className="file-pending">
                      <span className="status-pending">Aguardando...</span>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remover arquivo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {hasPending && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConvert}
              disabled={converting}
            >
              {converting ? 'Convertendo...' : `Converter ${items.filter(i => i.status === 'pending').length} arquivo${items.filter(i => i.status === 'pending').length > 1 ? 's' : ''}`}
            </button>
          )}

          {hasCompleted && (
            <button
              type="button"
              className="btn btn-success"
              onClick={handleDownloadAll}
            >
              Baixar todos ({completedCount})
            </button>
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
