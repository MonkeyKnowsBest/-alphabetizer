import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

function App() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const words = content.trim().split('\t');
        
        // Filter for words starting with $ and sort them
        const sortedWords = words
          .filter(word => word.startsWith('$'))
          .sort((a, b) => a.localeCompare(b))
          .join('\t');

        setResult(sortedWords);
        setError('');
      } catch (err) {
        setError('Error processing file. Please ensure it\'s a valid text file with tab-separated words.');
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileUpload({ target: input } as any);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            $ Symbol Word Sorter
          </h1>
          
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your text file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              File should contain tab-separated words starting with $
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Sorted Result:
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="whitespace-pre font-mono text-gray-700">
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;