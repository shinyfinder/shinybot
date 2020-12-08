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
			fs.access("./config.json", error => {
				if (!error) {
					var config = require("../config.json");
					fetchURL(config);
				} else {
					var config = process.env;
					fetchURL(config);
				}
			});

			async function fetchURL(config) {
				//const res = await fetch('https://raw.githubusercontent.com/shinyfinder/hello-world/master/weather_14.json.gz');
				//const res = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/topcities/150?apikey=${config.accukey}`);
				//const buffer = await res.buffer();
				
				
				//const res = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/topcities/150?apikey=${config.accukey}`);
				const res = await fetch('https://raw.githubusercontent.com/shinyfinder/hello-world/master/accuRes.json');
				const json = await res.json();

				var layer = 'wind_new';
				var URL = `https://tile.openweathermap.org/map/${layer}/3/30/30.png?appid=${config.owkey}`;
				const imgRes = await fetch(URL);
				const imgBuffer = await imgRes.buffer();

				unZip(json, imgBuffer);
			}

			function unZip(json, img) {			
				/*zlib.gunzip(buffer, (err,buffer) => {
					if (err) {throw err;};
					var text = buffer.toString('utf8');

					// gitconfigs
					try {
*/
						// if in master, make changes to file
						// then, commit changes to github on master
						// switch to weather
						// git checkout master weather.json
						// git commit -m 'message'
						// git push origin weather
						// git checkout master
						//console.log(simpleGit.branch(["--show-current"]));

						// see if path exists
						fs.access("./config.json", error => {
							if (!error) {
								var config = require("../config.json");
								const repo = 'shinybot';
								const user = config.gituser;
								const pwd = config.gitpwd;
								const gitURL = `https://${user}:${pwd}@github.com/${user}/${repo}`;
								console.log('exists');
								gitUpdateLocal(gitURL, json, img);
							} else {
								var config = process.env;
								const repo = 'shinybot';
								const user = config.gituser;
								const pwd = config.gitpwd;
								const gitURL = `https://${user}:${pwd}@github.com/${user}/${repo}`;
								console.log('does not exist');
								gitUpdateHeroku(gitURL, json, img);
							}
						});

						

						

						function gitUpdateLocal(gitURL, json, img) {
							simpleGit.init()
							.then(function onInit (initResult) {console.log('initialized');})
							.then(() => simpleGit.removeRemote('origin'))
							.then(function onRemoteRemove (removeRemoteResult) {})
							.then(() => simpleGit.addRemote('origin',gitURL))
							.then(function onRemoteAdd (addRemoteResult) {})
							.then(() => simpleGit.fetch(gitURL,'master', 'all'))
							.then(function onFetch (fetchResult) {console.log('fetched');})
							.then(() => simpleGit.reset('hard','origin/master'))
							.then(function onReset (resetResult) {console.log('reset');})
							.then(() => simpleGit.checkout('weather'))
							.then(function onCheckout (checkoutResult) {console.log('branch switched');})
							.then(() => fs.writeFile('weather.json', JSON.stringify(json,null,' '), function (err) {
								if (err) return console.log(err);
								console.log('write done');
								fs.writeFile('wind.png',img, function (err) {
									if (err) return console.log(err);
									console.log('wind write done');
									simpleGit.add(['weather.json', 'wind.png'])
									.then(function onAdd (addResult) {console.log('file added');})
									.then(() => simpleGit.commit('update weather'))
									.then(function onCommit (commitResult) {console.log('file committed');})
									.then(() => simpleGit.push('origin','weather'))
									.then(function onPush (pushResult) {console.log('result pushed');})
									.then(() => simpleGit.checkout('master'))
									.then(function onCheckoutReset (checkoutResetResult) {console.log('returned to master');})
									.catch(err => console.log(err));

								})

							}))						
							.catch(err => console.log(err));
						}

						function gitUpdateHeroku(gitURL, json, img) {
							simpleGit.init()
							.then(function onInit (initResult) {console.log('initialized');})

							.then(() => simpleGit.addConfig('user.email','none'))
							.then(function onEmail (emailResult) {})
							.then(() => simpleGit.addConfig('user.name','sf'))
							.then(function onInit (initResult) {})

							.then(() => simpleGit.addRemote('origin',gitURL))
							.then(function onRemoteAdd (addRemoteResult) {'added remote'})
							.then(() => simpleGit.remote('update'))
							.then(function onRemoteUpdate (addRemoteResult) {'updated remote'})
							.then(() => simpleGit.fetch())
							.then(function onFetch (fetchResult) {console.log('fetched');})
							.then(() => simpleGit.reset('hard','origin/master'))
							.then(function onReset (resetResult) {console.log('reset');})
							.then(() => simpleGit.checkout('origin/weather',['--track', '--force']))
							.then(function onCheckout (checkoutResult) {console.log('branch switched');})
							.then(() => fs.writeFile('weather.json', JSON.stringify(json,null,' '), function (err) {
								if (err) return console.log(err);
								console.log('write done');
								simpleGit.add('weather.json')
								.then(function onAdd (addResult) {console.log('file added');})
								.then(() => simpleGit.commit('update weather'))
								.then(function onCommit (commitResult) {console.log('file committed');})
								.then(() => simpleGit.push('origin','weather'))
								.then(function onPush (pushResult) {console.log('result pushed');})
								.then(() => simpleGit.checkout('origin/master', ['--force']))
								.then(function onCheckoutReset (checkoutResetResult) {console.log('returned to master');})
								.then(() => fs.rmdir('.git',{'recursive': true}, function (err) {
									if (err) return console.log(err);
									console.log('git removed');
								}))
								
								.catch(err => console.log(err));
							}))						
							.catch(err => console.log(err));
						}



						


					//}
					//catch(e) {console.log(e);};




				//});

}

} catch (err) {
	return console.log(err);
}

}
};