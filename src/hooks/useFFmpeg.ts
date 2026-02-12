import { useState, useCallback } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

// Core oficial; requer headers COOP/COEP (configurados no Vite e na Vercel) para SharedArrayBuffer
const CORE_VERSION = '0.12.6'
const CORE_CDN = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`

export interface ConversionItem {
  id: string
  file: File
  status: 'pending' | 'converting' | 'completed' | 'error'
  progress: number
  resultBlob?: Blob
  error?: string
}

export function useFFmpeg() {
  const [ffmpeg] = useState(() => new FFmpeg())
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (loaded) return
    setLoading(true)
    setError(null)
    try {
      const timeout = 60000 // 60s
      const withTimeout = <T>(p: Promise<T>) =>
        Promise.race([
          p,
          new Promise<T>((_, rej) =>
            setTimeout(() => rej(new Error('Carregamento demorou muito. Verifique a conexão.')), timeout)
          ),
        ])

      const coreURL = await withTimeout(
        toBlobURL(`${CORE_CDN}/ffmpeg-core.js`, 'text/javascript')
      )
      const wasmURL = await withTimeout(
        toBlobURL(`${CORE_CDN}/ffmpeg-core.wasm`, 'application/wasm')
      )
      await withTimeout(ffmpeg.load({ coreURL, wasmURL }))
      setLoaded(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao carregar FFmpeg')
    } finally {
      setLoading(false)
    }
  }, [ffmpeg, loaded])

  const convertToMp3 = useCallback(
    async (file: File, onProgress?: (progress: number) => void): Promise<Blob> => {
      if (!loaded) await load()
      if (onProgress) onProgress(0)
      setProgress(0)
      setError(null)
      const inputName = 'input.mp4'
      const outputName = 'output.mp3'
      try {
        const data = new Uint8Array(await file.arrayBuffer())
        await ffmpeg.writeFile(inputName, data)
        
        // Criar handler temporário para progresso individual
        const progressHandler = ({ progress: p }: { progress: number }) => {
          const progressPercent = Math.round(p * 100)
          if (onProgress) {
            onProgress(progressPercent)
          }
          setProgress(progressPercent)
        }
        
        // Remover qualquer handler anterior e adicionar o novo
        ffmpeg.off('progress')
        ffmpeg.on('progress', progressHandler)
        
        await ffmpeg.exec([
          '-i', inputName,
          '-vn',
          '-acodec', 'libmp3lame',
          '-q:a', '2',
          outputName
        ])
        
        // Remover handler após conversão
        ffmpeg.off('progress', progressHandler)
        
        const out = await ffmpeg.readFile(outputName)
        await ffmpeg.deleteFile(inputName)
        await ffmpeg.deleteFile(outputName)
        const blob = new Blob([out], { type: 'audio/mpeg' })
        if (onProgress) onProgress(100)
        return blob
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro na conversão'
        setError(msg)
        throw new Error(msg)
      }
    },
    [ffmpeg, loaded, load]
  )

  const convertBatch = useCallback(
    async (
      items: ConversionItem[],
      onItemUpdate: (id: string, updates: Partial<ConversionItem>) => void
    ): Promise<void> => {
      if (!loaded) await load()
      setError(null)

      // Processar sequencialmente
      for (const item of items) {
        if (item.status === 'completed' || item.status === 'error') continue

        try {
          onItemUpdate(item.id, { status: 'converting', progress: 0 })
          
          const blob = await convertToMp3(item.file, (progress) => {
            onItemUpdate(item.id, { progress })
          })
          
          onItemUpdate(item.id, {
            status: 'completed',
            progress: 100,
            resultBlob: blob,
            error: undefined
          })
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : 'Falha na conversão'
          onItemUpdate(item.id, {
            status: 'error',
            error: errorMsg,
            progress: 0
          })
        }
      }
    },
    [ffmpeg, loaded, load, convertToMp3]
  )

  return { load, convertToMp3, convertBatch, loaded, loading, progress, error }
}
