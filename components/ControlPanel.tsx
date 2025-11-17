
import React from 'react';
import { AppMode } from '../types';
import { SparklesIcon } from './icons';

interface ControlPanelProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: (prompt: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const timeTravelPrompts = [
    { name: "Ancient Rome", prompt: "Place the person in a realistic scene from Ancient Rome, like the Colosseum or a bustling market street." },
    { name: "1920s Speakeasy", prompt: "Transform the photo to look like it was taken in a 1920s speakeasy, with vintage clothing and a moody, atmospheric background." },
    { name: "Cyberpunk City", prompt: "Insert the person into a futuristic cyberpunk city with neon lights, towering skyscrapers, and flying vehicles." },
    { name: "Wild West", prompt: "Edit the photo to place the person in a classic Wild West town, dressed as a cowboy or cowgirl." },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  activeMode,
  onModeChange,
  prompt,
  onPromptChange,
  onGenerate,
  onAnalyze,
  isLoading,
}) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl flex flex-col gap-6 h-full">
      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 bg-gray-900 p-1 rounded-lg">
        <button
          onClick={() => onModeChange(AppMode.Edit)}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
            activeMode === AppMode.Edit ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
          } disabled:opacity-50`}
        >
          Time-Travel Edit
        </button>
        <button
          onClick={() => onModeChange(AppMode.Analyze)}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
            activeMode === AppMode.Analyze ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
          } disabled:opacity-50`}
        >
          Analyze Image
        </button>
      </div>

      {/* Content based on mode */}
      <div className="flex-grow flex flex-col gap-4">
        {activeMode === AppMode.Edit ? (
          <>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Describe your vision
              </label>
              <textarea
                id="prompt"
                rows={3}
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="e.g., Add a retro filter..."
              />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-300 mb-2">Or try a preset:</p>
                <div className="grid grid-cols-2 gap-2">
                    {timeTravelPrompts.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => onGenerate(p.prompt)}
                            disabled={isLoading}
                            className="text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md p-2 transition-colors duration-200 text-center"
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>
            <button
              onClick={() => onGenerate(prompt)}
              disabled={isLoading || !prompt.trim()}
              className="mt-auto w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-800/50 disabled:cursor-not-allowed"
            >
              <SparklesIcon className="w-5 h-5" />
              Generate Image
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-300 mb-4">Let Gemini analyze your image and provide a detailed description.</p>
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-800/50 disabled:cursor-not-allowed"
            >
              Analyze Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
