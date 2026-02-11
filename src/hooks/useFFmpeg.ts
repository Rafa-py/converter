import { useState, useCallback } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

// Core oficial; requer headers COOP/COEP (configurados no Vite e na Vercel) para SharedArrayBuffer
const CORE_VERSION = '0.12.6'
const CORE_CDN = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`

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
      ffmpeg.on('progress', ({ progress: p }) => setProgress(Math.round(p * 100)))
      await withTimeout(ffmpeg.load({ coreURL, wasmURL }))
      setLoaded(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao carregar FFmpeg')
    } finally {
      setLoading(false)
    }
  }, [ffmpeg, loaded])

  const convertToMp3 = useCallback(
    async (file: File): Promise<Blob> => {
      if (!loaded) await load()
      setProgress(0)
      setError(null)
      const inputName = 'input.mp4'
      const outputName = 'output.mp3'
      try {
        const data = new Uint8Array(await file.arrayBuffer())
        await ffmpeg.writeFile(inputName, data)
        await ffmpeg.exec([
          '-i', inputName,
          '-vn',
          '-acodec', 'libmp3lame',
          '-q:a', '2',
          outputName
        ])
        const out = await ffmpeg.readFile(outputName)
        await ffmpeg.deleteFile(inputName)
        await ffmpeg.deleteFile(outputName)
        return new Blob([out], { type: 'audio/mpeg' })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro na conversão'
        setError(msg)
        throw new Error(msg)
      } finally {
        setProgress(100)
      }
    },
    [ffmpeg, loaded, load]
  )

  return { load, convertToMp3, loaded, loading, progress, error }
}
