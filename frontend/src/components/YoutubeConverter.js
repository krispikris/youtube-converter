import React, { useState } from 'react';
import axios from 'axios';

const YoutubeToMp3 = () => {
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

export default YoutubeToMp3;
