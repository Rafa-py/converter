# MP4 → MP3 | Conversor

Conversor de vídeo MP4 para áudio MP3 que roda **100% no navegador**, sem necessidade de backend ou envio de arquivos para servidores. Processa múltiplos arquivos simultaneamente com progresso individual e conversão sequencial.

## 📋 Sobre o Projeto

Este projeto permite converter arquivos de vídeo MP4 para áudio MP3 diretamente no navegador do usuário. Todas as operações são realizadas localmente usando WebAssembly (WASM), garantindo privacidade total e processamento offline.

### Funcionalidades

- ✅ Upload múltiplo de arquivos MP4
- ✅ Conversão em lote (sequencial)
- ✅ Progresso individual por arquivo
- ✅ Download individual ou em lote
- ✅ Interface moderna e responsiva
- ✅ Processamento 100% local (sem servidor)

## 🔧 Como Funciona

O projeto utiliza **FFmpeg.wasm**, uma versão compilada do FFmpeg para WebAssembly que roda diretamente no navegador. O processo funciona da seguinte forma:

1. **Upload**: O usuário seleciona um ou múltiplos arquivos MP4 via drag-and-drop ou input de arquivo
2. **Carregamento**: O FFmpeg.wasm é carregado uma única vez (core + WASM)
3. **Conversão**: Cada arquivo é processado sequencialmente:
   - O vídeo é lido e carregado na memória do FFmpeg
   - O FFmpeg extrai apenas o áudio (`-vn`) e converte para MP3 (`libmp3lame`)
   - O resultado é gerado como um Blob no navegador
4. **Download**: O usuário pode baixar os arquivos convertidos individualmente ou todos de uma vez

A conversão sequencial evita sobrecarga de memória e CPU, garantindo melhor performance no navegador.

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite 6** - Build tool e dev server de alta performance
- **FFmpeg.wasm** (`@ffmpeg/ffmpeg`) - FFmpeg compilado para WebAssembly
- **CSS puro** - Estilização sem bibliotecas de UI

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório** (ou navegue até a pasta do projeto):
   ```bash
   git clone <url-do-repositorio>
   cd converter
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**:
   Abra [http://localhost:5173](http://localhost:5173) no seu navegador

5. **Teste a aplicação**:
   - Clique em "Iniciar conversor" para carregar o FFmpeg
   - Arraste arquivos MP4 ou clique para selecionar
   - Clique em "Converter" para processar os arquivos
   - Baixe os arquivos convertidos individualmente ou todos de uma vez

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção na pasta `dist/`
- `npm run preview` - Visualiza o build de produção localmente

## ⚠️ Observações Importantes

- **Performance**: Vídeos muito longos ou em alta resolução podem demorar mais ou consumir muita memória
- **Recomendação**: Para melhor experiência, use arquivos menores (alguns MB, poucos minutos de duração)
- **Privacidade**: Nenhum arquivo é enviado para servidores externos - tudo acontece no seu dispositivo
- **Navegadores**: Requer um navegador moderno com suporte a WebAssembly

## 📝 Estrutura do Projeto

```
converter/
├── src/
│   ├── components/
│   │   ├── Converter.tsx      # Componente principal
│   │   └── Converter.css      # Estilos do conversor
│   ├── hooks/
│   │   └── useFFmpeg.ts       # Hook para gerenciar FFmpeg
│   ├── App.tsx                # Componente raiz
│   └── main.tsx               # Ponto de entrada
├── package.json
└── README.md
```

## 📄 Licença

Este é um projeto de estudos, livre para uso e modificação.
