
// import formattedData from '../../../src/modules/helper/formatting_data.js'; // Adjust path
// import fs from 'fs/promises';
// import { basename } from 'path';
// import delay from '../../../src/modules/helper/delay.js';
// import sendWebhook from '../../../src/modules/discord_msg/news_notify.js';

// // Mock dependencies
// jest.mock('fs/promises');
// jest.mock('../../../src/modules/helper/delay.js');
// jest.mock('../../../src/modules/discord_msg/news_notify.js');

// describe('formattedData', () => {
//   beforeEach(() => {
//     // Reset mocks before each test
//     jest.clearAllMocks();
//   });

//   // Mock isWithin23HoursSource1 (assuming it’s imported indirectly)
//   const mockIsWithin23HoursSource1 = jest.fn();
//   jest.doMock('../../../src/modules/helper/time_filter_src_1.js', () => ({
//     default: mockIsWithin23HoursSource1,
//   }));

//   test('processes stories.json correctly with isWithin23HoursSource1', async () => {
//     // Mock filePath and data for stories.json
//     const filePath = '/Users/datdo/Desktop/work/Coding/TinTang/7tinh-hub-AIO/src/data/source1/stories.json';
//     const mockData = [
//       {
//         headline: 'News 1',
//         pictureUrl: 'https://example.com/image1.jpg',
//         postUrl: 'https://example.com/news1',
//         timestamp: '1 hour ago',
//       },
//       {
//         headline: 'News 2',
//         pictureUrl: 'https://example.com/image2.jpg',
//         postUrl: 'https://example.com/news2',
//         timestamp: '2 days ago',
//       },
//     ];

//     // Mock fs.readFile to return the JSON data
//     fs.readFile.mockResolvedValue(JSON.stringify(mockData));

//     // Mock isWithin23HoursSource1 to return true for "1 hour ago" and false for "2 days ago"
//     mockIsWithin23HoursSource1.mockImplementation((timestamp) => {
//       const match = timestamp.match(/(\d+)\s+(hour|day)s?\s+ago/i);
//       if (!match) return false;
//       const value = parseInt(match[1], 10);
//       const unit = match[2].toLowerCase();
//       if (unit === 'hour') return value >= 1 && value <= 23;
//       return false;
//     });

//     // Mock sendWebhook to track calls
//     const mockSendWebhook = jest.fn();
//     sendWebhook.mockImplementation(mockSendWebhook);

//     // Mock delay to avoid actual delays
//     delay.mockResolvedValue(undefined);

//     // Run the function
//     await formattedData(filePath);

//     // Assertions
//     expect(fs.readFile).toHaveBeenCalledWith(filePath, { encoding: 'utf-8' });
//     expect(basename).toHaveBeenCalledWith(filePath);
//     expect(mockIsWithin23HoursSource1).toHaveBeenCalledTimes(2);
//     expect(mockIsWithin23HoursSource1).toHaveBeenCalledWith('1 hour ago');
//     expect(mockIsWithin23HoursSource1).toHaveBeenCalledWith('2 days ago');
//     expect(mockSendWebhook).toHaveBeenCalledTimes(1); // Only "1 hour ago" should trigger
//     expect(mockSendWebhook).toHaveBeenCalledWith('News 1', 'https://example.com/image1.jpg', 'https://example.com/news1');
//     expect(console.log).toHaveBeenCalledWith('Processing file: stories.json');
//   });

//   test('processes stories2.json correctly without timestamp filter', async () => {
//     // Mock filePath and data for stories2.json
//     const filePath = '/Users/datdo/Desktop/work/Coding/TinTang/7tinh-hub-AIO/src/data/source1/stories2.json';
//     const mockData = [
//       {
//         title: 'News A',
//         imageUrl: 'https://example.com/imageA.jpg',
//         postUrl: 'https://example.com/newsA',
//       },
//       {
//         title: 'News B',
//         imageUrl: 'https://example.com/imageB.jpg',
//         postUrl: 'https://example.com/newsB',
//       },
//     ];

//     // Mock fs.readFile to return the JSON data
//     fs.readFile.mockResolvedValue(JSON.stringify(mockData));

//     // Mock sendWebhook to track calls
//     const mockSendWebhook = jest.fn();
//     sendWebhook.mockImplementation(mockSendWebhook);

//     // Mock delay to avoid actual delays
//     delay.mockResolvedValue(undefined);

//     // Run the function
//     await formattedData(filePath);

//     // Assertions
//     expect(fs.readFile).toHaveBeenCalledWith(filePath, { encoding: 'utf-8' });
//     expect(basename).toHaveBeenCalledWith(filePath);
//     expect(mockIsWithin23HoursSource1).not.toHaveBeenCalled(); // No timestamp filter for stories2.json
//     expect(mockSendWebhook).toHaveBeenCalledTimes(2); // All items processed
//     expect(mockSendWebhook).toHaveBeenCalledWith('News A', 'https://example.com/imageA.jpg', 'https://example.com/newsA');
//     expect(mockSendWebhook).toHaveBeenCalledWith('News B', 'https://example.com/imageB.jpg', 'https://example.com/newsB');
//     expect(console.log).toHaveBeenCalledWith('Processing file: stories2.json');
//   });

//   test('handles unknown file format as default', async () => {
//     // Mock filePath and data for an unknown file
//     const filePath = '/Users/datdo/Desktop/work/Coding/TinTang/7tinh-hub-AIO/src/data/source1/unknown.json';
//     const mockData = [
//       {
//         headline: 'Unknown 1',
//         pictureUrl: 'https://example.com/imageX.jpg',
//         postUrl: 'https://example.com/newsX',
//         timestamp: '1 hour ago',
//       },
//     ];

//     // Mock fs.readFile to return the JSON data
//     fs.readFile.mockResolvedValue(JSON.stringify(mockData));

//     // Mock isWithin23HoursSource1
//     mockIsWithin23HoursSource1.mockReturnValue(true);

//     // Mock sendWebhook to track calls
//     const mockSendWebhook = jest.fn();
//     sendWebhook.mockImplementation(mockSendWebhook);

//     // Mock delay
//     delay.mockResolvedValue(undefined);

//     // Run the function
//     await formattedData(filePath);

//     // Assertions
//     expect(fs.readFile).toHaveBeenCalledWith(filePath, { encoding: 'utf-8' });
//     expect(basename).toHaveBeenCalledWith(filePath);
//     expect(mockIsWithin23HoursSource1).toHaveBeenCalledTimes(1);
//     expect(mockSendWebhook).toHaveBeenCalledTimes(1);
//     expect(mockSendWebhook).toHaveBeenCalledWith('Unknown 1', 'https://example.com/imageX.jpg', 'https://example.com/newsX');
//     expect(console.log).toHaveBeenCalledWith('Processing file: unknown.json');
//     expect(console.log).toHaveBeenCalledWith('Unknown file format, processing as default...');
//   });

//   test('handles error when reading file', async () => {
//     // Mock fs.readFile to throw an error
//     const filePath = '/Users/datdo/Desktop/work/Coding/TinTang/7tinh-hub-AIO/src/data/source1/stories.json';
//     fs.readFile.mockRejectedValue(new Error('File not found'));

//     // Spy on console.error
//     const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

//     // Run the function
//     await formattedData(filePath);

//     // Assertions
//     expect(fs.readFile).toHaveBeenCalledWith(filePath, { encoding: 'utf-8' });
//     expect(consoleErrorSpy).toHaveBeenCalledWith('Error scraping data', expect.any(Error));
//     expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

//     // Restore the spy
//     consoleErrorSpy.mockRestore();
//   });
// });