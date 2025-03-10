import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import { resolve } from 'path';

dotenv.config({ path: resolve('../.env') });

async function main() {
  console.log('Application started');
  const url = 'https://kicksfinder.com/u9060eel';
  const filePath = resolve('../src/data/releaseInfo/releaseData.json');

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      },
    });

    const htmlContent = response.data; // Extract the HTML body
    await fs.writeFile(filePath, JSON.stringify({ html: htmlContent }, null, 2), { encoding: 'utf-8' });
    console.log('Data saved to', filePath);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

main();