import React, { useState } from 'react';
import { FaUpload, FaFileAlt, FaLightbulb } from 'react-icons/fa';

const ResumeInput = ({ onAnalyze }) => {
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState(null);
  const [inputType, setInputType] = useState('text');

  const sampleResume = `John Doe
Full Stack Developer

Email: john.doe@email.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe

SKILLS:
- Languages: JavaScript, Python, Java, HTML, CSS
- Frontend: React, Angular, Vue.js, Bootstrap
- Backend: Node.js, Express, Django
- Databases: MongoDB, MySQL, PostgreSQL
- Tools: Git, Docker, AWS, Jenkins

EXPERIENCE:
Senior Full Stack Developer | Tech Company | 2020-Present
- Developed scalable web applications using React and Node.js
- Implemented RESTful APIs and microservices architecture
- Optimized database queries improving performance by 40%

EDUCATION:
Bachelor of Science in Computer Science | University Name | 2016-2020`;

  const handleSubmit = () => {
    if (inputType === 'text' && resumeText.trim()) {
      onAnalyze(resumeText);
    } else if (inputType === 'file' && file) {
      onAnalyze(file);
    } else {
      alert('Please provide resume text or upload a file');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const loadSampleResume = () => {
    setResumeText(sampleResume);
    setInputType('text');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
      <p className="text-gray-600 mb-4">Get matched with suitable jobs based on your skills</p>
      
      <div className="flex mb-4">
        <button
          onClick={() => setInputType('text')}
          className={`px-4 py-2 rounded-l-lg transition-colors ${
            inputType === 'text' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaFileAlt className="inline mr-2" />
          Paste Text
        </button>
        <button
          onClick={() => setInputType('file')}
          className={`px-4 py-2 rounded-r-lg transition-colors ${
            inputType === 'file' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaUpload className="inline mr-2" />
          Upload PDF
        </button>
      </div>

      {inputType === 'text' ? (
        <>
          <textarea
            className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {resumeText.length} characters
            </span>
            <button
              onClick={loadSampleResume}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              <FaLightbulb className="mr-1" />
              Load sample resume
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> For best results, we recommend using the "Paste Text" option. 
              PDF parsing may not extract all information accurately.
            </p>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <FaUpload className="text-5xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">
                {file ? file.name : 'Click to upload PDF'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: 5MB
              </p>
            </label>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        Analyze Resume
      </button>
    </div>
  );
};

export default ResumeInput;
