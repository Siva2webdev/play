const axios = require('axios');
const fs = require('fs');

// Array of URLs to parse
const playlistUrls = [
    'http://mega4k.one:8080/get.php?username=ramizghachi&password=874473256&type=m3u_plus',
    'http://watchindia.net:8880/get.php?username=65596&password=46234&type=m3u_plus',
    'http://b1g.ooo:80/get.php?username=93736&password=93736&type=m3u_plus'
];

// Function to fetch and parse the M3U playlist
async function parsePlaylist(url, index) {
    try {
        // Fetch the contents of the M3U playlist
        const response = await axios.get(url);
        const playlistContent = response.data;

        // Split the playlist content into lines
        const lines = playlistContent.split('\n');

        // Initialize an array to store channel names and stream URLs
        const channels = [];

        // Parse each line of the playlist
        lines.forEach((line, i) => {
            // Process each line based on the M3U format
            if (line.startsWith('#EXTINF:')) {
                // Extract metadata (e.g., channel name) from the line
                const metadata = line.substring('#EXTINF:'.length).trim();

                // Move to the next line to extract the stream URL
                const streamUrl = lines[i + 1] ? lines[i + 1].trim() : '';

                // Add channel name and stream URL to the channels array
                if (streamUrl) {
                    channels.push({ name: metadata, url: streamUrl });
                }
            }
        });

        // Write channels to a new M3U file
        writeM3UFile(channels, `ps${index + 1}.m3u`);
    } catch (error) {
        console.error(`Error fetching or parsing the playlist from ${url}:`, error.message);
    }
}

// Function to write channels to a new M3U file
function writeM3UFile(channels, filename) {
    try {
        // Initialize M3U file content with header
        let m3uContent = '#EXTM3U\n';

        // Add each channel to the M3U file content
        channels.forEach(channel => {
            m3uContent += `#EXTINF:-1,${channel.name}\n${channel.url}\n`;
        });

        // Write M3U content to a new file
        fs.writeFileSync(filename, m3uContent);
        console.log(`${filename} created successfully.`);
    } catch (error) {
        console.error(`Error writing M3U file (${filename}):`, error.message);
    }
}

// Loop through each URL and parse the playlist
playlistUrls.forEach((url, index) => {
    parsePlaylist(url, index);
});
