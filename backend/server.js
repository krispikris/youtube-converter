// Import necessary modules
const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

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

    // const stream = ytdl(youtubeUrl, { format: 'mp4' });
    const stream = ytdl(youtubeUrl, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    console.log('Stream download started');

    stream.on('finish', () => {
      console.log('Stream download finished');
    });

    console.log('Stream ffmpeg processing');

    ffmpeg(stream)
      .audioBitrate(128)
      .save(output)
      .on('end', () => {
        console.log('Ffmpeg processing finished');
        const formattedFileName = `${title}.mp3`
          .replace(/[^a-z0-9]/gi, '_')
          .toLowerCase(); // Format file name

        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${formattedFileName}"`,
        );
        res.download(output, formattedFileName, (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
          } else {
            console.log('File sent successfully');
          }
        });
      })

      // .on('end', () => {
      //   console.log('Ffmpeg processing finished');
      //   res.download(output, `${title}.mp3`, (err) => {
      //     // Use the defined output path and filename
      //     if (err) {
      //       console.error('Error sending file:', err);
      //       res.status(500).send('Error sending file');
      //     } else {
      //       console.log('File sent successfully');
      //     }
      //   });
      // })

      .on('error', (err, stdout, stderr) => {
        console.error('Ffmpeg error:', err);
        console.error('Ffmpeg stdout:', stdout);
        console.error('Ffmpeg stderr:', stderr);
        res.status(500).send('Error in ffmpeg conversion');
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
