const Promise = require('bluebird');
const fs = require('fs');
const moment = require('moment');
const inquirer = require('inquirer');

Promise.coroutine(function* () {
	const userInput = yield inquirer.prompt([
		{
			type: 'input',
			name: 'inputFile',
			message: 'Please tell me your input transcript (in JSON format)'
		},
		{
			type: 'input',
			name: 'outputFile',
			message: 'Please tell me your output human-readable transcript'
		}
	]);

	const transcript = require(`./${userInput.inputFile}`);

	let output = "";
	transcript.map(response => {
		response.data.map(line => {
			output += `[${moment(line.attributes.timestamp).toISOString()}] ${line.attributes.from}: ${line.attributes.message}\r\n`
		})
	});

	fs.writeFileSync(userInput.outputFile, output);
})();
