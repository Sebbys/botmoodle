const moodle_client = require('moodle-client');

// Initialize Moodle client
moodle_client.init({
    wwwroot: "https://lms.ittelkom-pwt.ac.id",
    token: "b2d7dc4b53ccc048001dd6027a54d80c",

}).then(function(client) {
    return fetch_events(client);

}).catch(function(err) {
    console.log("Unable to initialize the client: " + err);
});

function do_something(client) {
    return client.call({
        wsfunction: "core_webservice_get_site_info",

    }).then(function(info) {
        console.log("Hello %s, welcome to %s", info.fullname, info.sitename);
        return;
    });
}

async function fetch_events(client) {
	return client
	  .call({
		wsfunction: "core_calendar_get_calendar_upcoming_view",
	  })
	  .then(function (response) {
		let formattedEvents = response.events.map((event) => ({
		  name: event.name,
		  url: event.url,
		  deadline: new Date(event.timestart * 1000).toLocaleString(), // Convert Unix timestamp to human-readable date/time
		}));
		console.log(formattedEvents)
		return formattedEvents;
	  });
  }