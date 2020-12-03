const zlib = require('zlib');
const fs = require('fs');
const simpleGit = require('simple-git') ();
const simpleGitPromise = require('simple-git/promise') ();

//const config = require('../config.json');

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

				if (fs.existsSync("../config.json")) {
					const config = require("../config.json");
				} else {
					const config = process.env;
					console.log(config.test);
					// push to github
					const repo = 'shinybot';
					const user = config.gituser;
					const pwd = config.gitpwd;
					const gitURL = `https://${user}:${pwd}@github.com/${user}/${repo}`;
				}

					// gitconfigs
					try {

						// if in master, make changes to file
						// then, commit changes to github on master
						// switch to weather
						// git checkout master weather.json
						// git commit -m 'message'
						// git push origin weather
						// git checkout master
						//console.log(simpleGit.branch(["--show-current"]));
						simpleGit.init()
						.then(function onInit (initResult) {console.log('initialized');})
						//.then(() => simpleGit.removeRemote('origin'))
						//.then(function onRemoteRemove (removeRemoteResult) {})
						.then(() => simpleGit.addRemote('origin',gitURL))
						.then(function onRemoteAdd (addRemoteResult) {})
						.then(() => simpleGit.fetch(gitURL,'master', 'all'))
						.then(function onFetch (fetchResult) {console.log('fetched');})
						.then(() => simpleGit.reset('hard','origin/master'))
						.then(function onReset (resetResult) {console.log('reset');})
						.then(() => simpleGit.checkout('weather'))
						.then(function onCheckout (checkoutResult) {console.log('branch switched');})
						.then(() => fs.writeFile('weather.json', text, function (err) {
							if (err) return console.log(err);
							console.log('write done');
							simpleGit.add('weather.json')
							.then(function onAdd (addResult) {console.log('file added');})
							.then(() => simpleGit.commit('update weather'))
							.then(function onCommit (commitResult) {console.log('file committed');})
							.then(() => simpleGit.push('origin','weather'))
							.then(function onPush (pushResult) {console.log('result pushed');})
							.then(() => simpleGit.checkout('master'))
							.then(function onCheckoutReset (checkoutResetResult) {console.log('returned to master');})
							.catch(err => console.log(err));
						}))						
						.catch(err => console.log(err));

					}
					catch(e) {console.log(e);};




				});
			

			
		} catch (err) {
			return console.log(err);
		}

	}
};