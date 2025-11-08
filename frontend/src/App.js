import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ResumeInput from './components/ResumeInput';
import Results from './components/Results';
import LoadingSpinner from './components/LoadingSpinner';
import { api } from './api';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (input) => {
    setLoading(true);
    setError(null);
    
    try {
      if (typeof input === 'string') {
        // Text input
        console.log('Analyzing text input...');
        const response = await api.post('/api/jobs/match', {
          resumeText: input
        });
        setResults(response.data);
      } else {
        // File input
        console.log('Uploading PDF file...');
        const formData = new FormData();
        formData.append('resume', input);
        
        // First upload PDF to get text
        const uploadResponse = await api.post('/api/jobs/upload-pdf', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Check if we got text back
        if (uploadResponse.data.text) {
          // Then analyze the text
          const matchResponse = await api.post('/api/jobs/match', {
            resumeText: uploadResponse.data.text
          });
          setResults(matchResponse.data);
        } else {
          throw new Error('Could not extract text from PDF');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Failed to analyze resume. ';
      
      if (error.response) {
        errorMessage += error.response.data.message || error.response.data.error || 'Please try again.';
      } else if (error.request) {
        errorMessage += 'Cannot connect to server. Please check if the backend is running on port 5000.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {!results && !loading && (
          <>
            <ResumeInput onAnalyze={handleAnalyze} />
            {error && (
              <div className="mt-4 max-w-3xl mx-auto">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              </div>
            )}
          </>
        )}
        
        {loading && <LoadingSpinner />}
        
        {results && !loading && <Results data={results} onReset={handleReset} />}
      </main>
      
      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-gray-600 text-sm">
        <p>SkillLink © 2024 - AI-Powered Resume Analyzer</p>
      </footer>
    </div>
  );
}

export default App;
