//Playlist file Generator (url to .m3u file)


const axios = require('axios');
const fs = require('fs');

// URL of the M3U playlist
const playlistUrl = 'http://youtube.xxx69.in/get.php?username=3h5WsvkMrP&password=SfLuWxZQ4z&type=m3u_plus';

// Function to fetch and parse the M3U playlist
async function parsePlaylist() {
    try {
        // Fetch the contents of the M3U playlist
        const response = await axios.get(playlistUrl);
        const playlistContent = response.data;

        // Split the playlist content into lines
        const lines = playlistContent.split('\n');

        // Initialize an array to store channel names and stream URLs
        const channels = [];

        // Parse each line of the playlist
        lines.forEach(line => {
            // Process each line based on the M3U format
            if (line.startsWith('#EXTINF:')) {
                // Extract metadata (e.g., channel name) from the line
                const metadata = line.substring('#EXTINF:'.length);

                // Move to the next line to extract the stream URL
                const streamUrl = lines[lines.indexOf(line) + 1];

                // Add channel name and stream URL to the channels array
                channels.push({ name: metadata, url: streamUrl });
            }
        });

        // Write channels to a new M3U file
        writeM3UFile(channels);
    } catch (error) {
        console.error('Error fetching or parsing the playlist:', error.message);
    }
}

// Function to write channels to a new M3U file
function writeM3UFile(channels) {
    try {
        // Initialize M3U file content with header
        let m3uContent = '#EXTM3U\n';

        // Add each channel to the M3U file content
        channels.forEach(channel => {
            m3uContent += `#EXTINF:-1,${channel.name}\n${channel.url}\n`;
        });

        // Write M3U content to a new file
        fs.writeFileSync('tox.m3u', m3uContent);
        console.log('M3U file created successfully.');
    } catch (error) {
        console.error('Error writing M3U file:', error.message);
    }
}

// Call the function to parse the playlist
parsePlaylist();
