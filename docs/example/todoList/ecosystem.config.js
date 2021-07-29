module.exports = {
	apps : [{
		name: 'My TodoList',
		script: 'http-server -p 52168',
		instances: 1,
		cron_restart: '59 59 23 * * *',
	}]
}

