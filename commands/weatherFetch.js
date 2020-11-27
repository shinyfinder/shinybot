const zlib = require('zlib');
const fs = require('fs');
const simpleGit = require('simple-git') ();
const simpleGitPromise = require('simple-git/promise') ();
const config = require('../config.json');

module.exports = {
	name: "weatherFetch",
	description: 'Retrieve weather data from Open Weather and push to github.',
	aliases: ['weather','wf'],
	execute: async (message) => {
		try {
			const res = await fetch('https://raw.githubusercontent.com/shinyfinder/hello-world/master/weather_14.json.gz');
			const buffer = await res.buffer();

			//const text = await res.text();
			zlib.gunzip(buffer, (err,buffer) => {
				if (err) {throw err;};
				var text = buffer.toString('utf8');

				fs.writeFile('weather.json', text, function (err) {
					if (err) return console.log(err);
					console.log('write done');
					
					// push to github
					const repo = 'hello-world';
					const user = config.gituser;
					const pwd = config.gitpwd;
					const gitURL = `https://${user}:${pwd}@github.com/${user}/${repo}`;
					// gitconfigs
					try {
					/*
					//simpleGit.init();
					//simpleGit.addConfig('user.email', 'none');
					//simpleGit.addConfig('user.name', 'sf');

					// add remote repo url as origin to repo
					simpleGitPromise.removeRemote('origin');
					simpleGitPromise.addRemote('origin',gitURL);
					// add file for commit
					simpleGitPromise.add('../weather.json')
					.then(
						(addSuccess) => {
							console.log(addSuccess);
						}, (failedAdd) => {
							console.log('adding files failed');
						});

					// commit files
					simpleGitPromise.commit('update weather files')
					.then(
						(successCommit) => {
							console.log(successCommit);
						}, (failed) => {
							console.log('failed commmit');
						});

					// push to repo
					simpleGitPromise.push('origin','master')
					.then((success) => {
						console.log('repo successfully pushed');
					},(failed)=> {
						console.log('repo push failedd');
					});
					*/
				}
				catch(e) {console.log(e);};


				})

			});
			

			
		} catch (err) {
			return console.log(err);
		}

	}
};