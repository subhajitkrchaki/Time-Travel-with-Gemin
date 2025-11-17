
import React, { useState, useCallback } from 'react';
import { analyzeImageWithGemini, editImageWithGemini } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { ResultPanel } from './components/ResultPanel';
import { ControlPanel } from './components/ControlPanel';
import { AppMode } from './types';
import type { GeneratedContent } from './types';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.Edit);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setPrompt('');
  };

  const resetState = () => {
    setUploadedFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setPrompt('');
    setActiveMode(AppMode.Edit);
  };
  
  const handleGenerate = useCallback(async (generationPrompt: string) => {
    if (!uploadedFile || !generationPrompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedImageBase64 = await editImageWithGemini(uploadedFile, generationPrompt);
      setResult({ type: 'image', data: generatedImageBase64 });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile]);

  const handleAnalyze = useCallback(async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisText = await analyzeImageWithGemini(uploadedFile);
      setResult({ type: 'text', data: analysisText });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center gap-3">
          <SparklesIcon className="w-10 h-10" />
          Gemini Time-Travel Booth
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          Upload a photo to analyze it, or use text prompts to edit your image and travel through time!
        </p>
      </header>

      <main className="flex-grow">
        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Panel: Image Preview & Reset */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full bg-black rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/20">
                {imagePreview && (
                  <img src={imagePreview} alt="Uploaded preview" className="object-contain w-full h-full" />
                )}
              </div>
              <button
                onClick={resetState}
                disabled={isLoading}
                className="w-full bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
              >
                Start Over
              </button>
            </div>
            
            {/* Right Panel: Controls & Results */}
            <div className="grid grid-rows-2 gap-8">
                <ControlPanel 
                    activeMode={activeMode}
                    onModeChange={setActiveMode}
                    prompt={prompt}
                    onPromptChange={setPrompt}
                    onGenerate={handleGenerate}
                    onAnalyze={handleAnalyze}
                    isLoading={isLoading}
                />
                <ResultPanel 
                    content={result}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
