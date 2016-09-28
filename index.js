const Promise = require('bluebird');
const moment = require('moment');
const axios = require('axios');
const config = require('config');
const inquirer = require('inquirer');
const ProgressBar = require('progress');
const fs = require('fs');

const fetchVideoMetadata = Promise.coroutine(function* (videoID) {
	const response = yield axios.get(`https://api.twitch.tv/kraken/videos/v${videoID}?client_id=${config.get('twitch.clientID')}`);
	return response.data;
});

Promise.coroutine(function* () {
	if (!config.get('twitch.clientID')) {
		console.log('I see that you have not set up a Twitch Client ID. See README.md for more details.');
		console.log('I can\'t let you pass at this point.')
		return;
	}

	const userInput = yield inquirer.prompt([
		{
			type: 'input',
			name: 'videoUrl',
			message: 'Please tell me your video URL'
		},
		{
			type: 'input',
			name: 'outputFile',
			message: 'Please tell me where to write the transcript to'
		}
	]);

	const videoID = userInput.videoUrl.match(/\d+/)[0];
	const responses = [];

	// Retrieve video metadata.
	const videoMetadata = yield fetchVideoMetadata(videoID);
	const start = moment(videoMetadata['recorded_at']).unix();
	const end = start + videoMetadata.length;
	const bar = new ProgressBar('fetching [:bar] :percent :etas', {
		total: parseInt(videoMetadata.length),
		width: 20
	});
	const segmentSize = 30;
	let downloaded = 0;
	let duration = end - start;

	for (let segmentStart = start; segmentStart < end; segmentStart += segmentSize) {
		let response = yield axios.get(`https://rechat.twitch.tv/rechat-messages?start=${segmentStart}&video_id=v${videoID}`);
		responses.push(response.data);
		downloaded += segmentSize;
		bar.tick(segmentSize);
	}

	fs.writeFileSync(userInput.outputFile, JSON.stringify(responses, null, 2));
})();
