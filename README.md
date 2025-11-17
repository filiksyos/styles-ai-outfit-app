# Styles - AI Outfit Generator

An AI-powered virtual wardrobe application that generates realistic outfit visualizations using Google's Gemini 2.5 Flash model via OpenRouter. Upload your photo and body measurements to see what you'd look like in different clothes.

## ✨ Features

- 📸 **Image Upload & Validation** - Drag-and-drop interface with file validation
- 🤖 **AI Outfit Generation** - Powered by Gemini 2.5 Flash via OpenRouter
- 📊 **Body Data Storage** - Optional measurements for better AI accuracy
- 📥 **Result Display & Download** - View and save generated outfits
- ⏳ **Loading States** - Multi-stage progress tracking
- ❌ **Error Handling** - Comprehensive error messages with retry logic

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/filiksyos/styles-ai-outfit-app.git
   cd styles-ai-outfit-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **AI Provider**: OpenRouter (Gemini 2.5 Flash)
- **AI SDK**: Vercel AI SDK 4.1.8

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-outfit/
│   │       └── route.ts          # API route for AI generation
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── components/
│   ├── BodyDataForm.tsx          # Body measurements form
│   ├── ImageUpload.tsx           # Image upload component
│   ├── ResultDisplay.tsx         # Results display
│   ├── LoadingDisplay.tsx        # Loading states
│   ├── ErrorDisplay.tsx          # Error handling
│   └── index.ts                  # Component exports
├── lib/
│   └── utils.ts                  # Utility functions
└── types/
    └── index.ts                  # TypeScript definitions
```

## 🎯 How It Works

1. **Add Your Data** - Enter body measurements (optional) and upload your photo
2. **Upload Clothing** - Upload a photo of the clothing item you want to try on
3. **AI Processing** - Gemini 2.5 Flash analyzes both images and your body data
4. **View Results** - See the AI-generated visualization and download it

## 🔒 Privacy & Security

- API keys are stored server-side only (never exposed to client)
- Body data is stored locally in your browser (localStorage)
- Images are processed securely and not permanently stored

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key |
| `OPENROUTER_SITE_URL` | No | Your site URL for attribution |
| `OPENROUTER_APP_NAME` | No | Your app name for attribution |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenRouter](https://openrouter.ai/) and Google's Gemini 2.5 Flash
- Inspired by [nano-banana-wardrobe](https://github.com/aksharth/nano-banana-wardrobe) and [ai_outfit_app](https://github.com/filiksyos/ai_outfit_app)

---

**Note**: This is an MVP (Minimum Viable Product). The Gemini 2.5 Flash model currently returns text descriptions rather than generated images. For actual image generation, you would need to use a different AI model or approach (e.g., Stable Diffusion, DALL-E, or Midjourney via their respective APIs).