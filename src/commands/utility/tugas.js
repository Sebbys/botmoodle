const { SlashCommandBuilder } = require('discord.js');
const moodle_client = require('moodle-client');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tugas')
        .setDescription('Fetches upcoming tasks from Moodle'),
    async execute(interaction) {
        await interaction.reply({ content: 'Fetching tasks...', fetchReply: true });
        moodle_client
          .init({
            wwwroot: "https://lms.ittelkom-pwt.ac.id",
            token: "79f0dec8c9cca0adc148a87166aa3254", // Replace with your actual token
          })
          .then(function (client) {
            return fetch_events(client);
          })
          .then(function ({ events, userInfo }) {
            let reply = `Hello ${userInfo.fullname}\n\n`;
            if (events.length === 0) {
                reply += 'You have no upcoming tasks.';
            } else {
                events.forEach(event => {
                    reply += `Name: ${event.name}\nURL: ${event.url}\nDeadline: ${event.deadline}\n\n`;
                });
            }
            interaction.editReply(reply);
          })
          .catch(function (err) {
            console.error("Unable to initialize the client:", err);
          });
    },
};

async function fetch_events(client) {
    return client
        .call({
            wsfunction: "core_webservice_get_site_info",
        })
        .then(function (info) {
            return {
                userInfo: {
                    fullname: info.fullname,
                    sitename: info.sitename
                },
                client
            };
        })
        .then(function ({ userInfo, client }) {
            return client.call({
                wsfunction: "core_calendar_get_calendar_upcoming_view",
            }).then(function (response) {
                let formattedEvents = response.events.map((event) => ({
                    name: event.name,
                    url: event.url,
                    deadline: new Date(event.timestart * 1000).toLocaleString(), // Convert Unix timestamp to human-readable date/time
                }));
                return { events: formattedEvents, userInfo };
            });
        });
}