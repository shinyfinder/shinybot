module.exports = {
	name: "puppies",
	description: 'Pulls random image of a puppy posted to r/puppies',
	aliases: ['puppy', 'dog'],
	usage: ' ',
	
	execute: async (message) => {
		try {
			const res = await fetch('https://www.reddit.com/r/puppies/top/.json?sort=top&t=all&limit=50');
			const json = await res.json();
			const posts = json.data.children
				.filter(f => message.channel.nsfw || !f.nsfw);

			if (!posts.length) return message.channel.send("No cute puppies!");
			//const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
			//const allowed = body.length;

			//if (!allowed.length) return message.channel.send('It seems we are out of cute kittens!, Try again later.');
			const randomnumber = Math.floor(Math.random() * posts.length);
			//const embed = new Discord.MessageEmbed()
			//.setColor(0x00A2E8)
			//.setTitle(posts[randomnumber].data.title)
			//.setDescription("Posted by: " + posts[randomnumber].data.author)
			//.setImage(posts[randomnumber].data.url)
			//.addField("Other info:", "Up votes: " + posts[randomnumber].data.ups + " / Comments: " + posts[randomnumber].data.num_comments)
			//.setFooter("Kittens provided by r/kittens")
			//message.channel.send(randomnumber);
			message.channel.send(posts[randomnumber].data.url);
		} catch (err) {
			return console.log(err);
		}
	}
};