// Import necessary modules
const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/convert', async (req, res) => {
  const { youtubeUrl } = req.body;
  if (!ytdl.validateURL(youtubeUrl)) {
    return res.status(400).send('Invalid URL');
  }

  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const title = info.videoDetails.title;
    const output = path.resolve(__dirname, `${title}.mp3`);

    const stream = ytdl(youtubeUrl, { format: 'mp4' });
    ffmpeg(stream)
      .audioBitrate(128)
      .save(output)
      .on('end', () => {
        res.download(output, `${title}.mp3`, () => {
          fs.unlinkSync(output);
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error converting video');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
