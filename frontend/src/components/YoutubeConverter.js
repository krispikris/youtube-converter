import React, { useState } from 'react';
import axios from 'axios';

const YouTubeConverter = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/convert', {
        youtubeUrl: url,
      });
      const link = document.createElement('a');
      link.href = response.data;
      link.download = response.data.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      console.error('Error converting video:', error);
      setLoading(false);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Data:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Message:', error.message);
      }
      console.error('Config:', error.config);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YouTube URL"
        disabled={isLoading}
      />
      <button onClick={handleConvert} disabled={isLoading}>
        {isLoading ? 'Converting...' : 'Convert to MP3'}
      </button>
    </div>
  );
};

export default YouTubeConverter;
