# MP4 → MP3 | Conversor

Conversor de vídeo MP4 para áudio MP3 rodando **100% no navegador** (ffmpeg.wasm). Projeto de estudos, deploy na Vercel.

## Rodar em desenvolvimento

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # opcional: testar o build localmente
```

## Deploy na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) (pode usar GitHub).
2. Instale o CLI (opcional): `npm i -g vercel`
3. **Pelo site:**
   - Conecte o repositório do projeto no Vercel.
   - Root: pasta do projeto (onde está `package.json`).
   - Build: `npm run build`
   - Output: `dist`
   - Deploy.
4. **Pelo CLI:** na pasta do projeto rode `vercel` e siga o assistente.

Depois do deploy, o site estará em `https://seu-projeto.vercel.app`. A conversão acontece no dispositivo do usuário; não há backend.

## Observações

- Vídeos muito longos ou em alta resolução podem travar ou demorar no navegador.
- Para estudo, use arquivos pequenos (alguns MB, poucos minutos).
- Nada é enviado a servidor: privacidade total.

## Stack

- React 18 + TypeScript
- Vite 5
- FFmpeg.wasm (@ffmpeg/ffmpeg)
- CSS (sem lib de UI)
