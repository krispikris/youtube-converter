import React, { useState } from 'react';
import axios from 'axios';

const YouTubeConverter = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3001/convert',
        { youtubeUrl: url },
        {
          responseType: 'blob', // This ensures you get the file data as a blob
        },
      );

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      console.log('contentDisposition:', contentDisposition);
      let filename = 'download.mp3'; // Default filename

      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Create a URL for the blob and initiate a download
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename); // Set the file name for the download
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
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
