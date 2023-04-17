const knex = require("../data/db");
const { sendEventNotification } = require('./sendToMail');
const {sendNotificationToClient} = require('./socketNotificator')
const CronJob = require('cron').CronJob;


module.exports = new CronJob(
	'0 1 * * * *', // every hour
	//'*/2 * * * * *', // every even second
	async function() {
		const now = new Date();
 		const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
		const events = await  knex('events')
		.select('*')
		.where('start_date', '>', now.toISOString())
		.where('start_date', '<=', thirtyMinutesFromNow.toISOString())
		.where('is_notified', false)
		for (let i = 0; i < events.length; i++) {
			const company = await knex('companies')
			.select('*')
			.where('id', events[i].company_id)
			.first()
			const date = new Date(events[i].start_date).toLocaleString('en-US', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				hour12: true
			  }).toUpperCase()
			sendEventNotification(company.email, events[i].title, date)
			sendNotificationToClient(`Event ${events[i].title} starts at date`, events[i].owner)
			await knex("events")
			  .where({
				id: events[i].id,
			  })
			  .update('is_notified', true)
			console.log('Notification for event with id ' + events[0].id + ' has been send');
		}
	},
	null,
	true,
	'America/Los_Angeles'
);