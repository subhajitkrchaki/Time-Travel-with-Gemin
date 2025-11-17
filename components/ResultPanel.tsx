
import React from 'react';
import type { GeneratedContent } from '../types';
import { SparklesIcon, PhotoIcon } from './icons';

interface ResultPanelProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-indigo-300">Generating your masterpiece...</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full bg-red-900/20 border border-red-500 rounded-lg p-4 text-center">
        <p className="font-semibold text-red-400 mb-2">An Error Occurred</p>
        <p className="text-red-300 text-sm">{message}</p>
    </div>
);

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <div className="p-4 bg-gray-700/50 rounded-full mb-4">
             <SparklesIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-300">Your AI-generated content will appear here</h3>
        <p className="mt-1 text-sm">Upload an image and choose an action to begin.</p>
    </div>
);


export const ResultPanel: React.FC<ResultPanelProps> = ({ content, isLoading, error }) => {
    return (
        <div className="bg-gray-800 rounded-xl w-full h-full p-4 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-gray-700/20 [mask-image:linear-gradient(0deg,#000000,transparent)]"></div>
            <div className="relative w-full h-full">
                {isLoading && <LoadingSpinner />}
                {!isLoading && error && <ErrorDisplay message={error} />}
                {!isLoading && !error && !content && <Placeholder />}
                {!isLoading && !error && content && (
                    content.type === 'image' ? (
                        <img 
                            src={`data:image/png;base64,${content.data}`} 
                            alt="Generated content" 
                            className="object-contain w-full h-full rounded-lg" 
                        />
                    ) : (
                        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-gray-100 p-4 overflow-y-auto h-full w-full">
                            <p>{content.data}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
};
