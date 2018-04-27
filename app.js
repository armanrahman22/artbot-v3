"use strict";
exports.__esModule = true;
var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var explore_1 = require("./explore");
require('es6-promise').polyfill();
require('isomorphic-fetch');
require('dotenv').load();
exports.helpMessage = "You can: \n \n    Start by showing artwork by saying something like 'Show me paintings by Picasso'. \n\n    Get details about the piece you're looking at: 'Tell me more about this painting'. \n\n    Get details about the artist: 'Tell me about Picasso' or \"Who is Picasso\".";
// getAllPaintingsFromAPI();
// getAllArtistsFromAPI();
exports.ALL_PAINTINGS = explore_1.getFamousPaintingsFromFile();
exports.ALL_ARTISTS = explore_1.getAllArtistsFromFile();
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});
// Listen for messages from users 
server.post('/api/messages', connector.listen());
/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot.
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */
var inMemoryStorage = new builder.MemoryBotStorage();
// Create your bot with a function to receive messages from the user.
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
    // If the object for storing notes in session.userData doesn't exist yet, initialize it
    var userMessage = session.message.text;
    console.log("you said: " + userMessage);
    if (!session.userData.registered) {
        session.userData.registered = true;
        session.send(exports.helpMessage);
    }
}).set('storage', inMemoryStorage);
// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var LuisModelUrl = 'https://eastus2.api.cognitive.microsoft.com/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;
console.log(LuisModelUrl);
// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);
bot.dialog('Explore_artist', function (session, args) {
    var userMessage = session.message.text;
    console.log("you said: " + userMessage);
    var intent = args.intent;
    var artist_entity = builder.EntityRecognizer.findEntity(intent.entities, 'Artist');
    if (artist_entity != null) {
        var bio = explore_1.getArtistInfo(artist_entity.entity);
        session.send(bio);
    }
    else {
        session.send("Didn't recognize: " + userMessage);
        session.send(exports.helpMessage);
    }
    session.endDialog();
}).triggerAction({
    matches: 'Explore_artist'
});
bot.dialog('Explore_painting', function (session, args) {
    var userMessage = session.message.text;
    console.log("you said: " + userMessage);
    var strArray = userMessage.split(" ");
    if (/^\d+$/.test(strArray[-1])) {
        var description = explore_1.explorePainting(parseInt(strArray[-1]));
        session.send(description);
    }
    else {
        session.send("Didn't recognize: " + userMessage);
        session.send(exports.helpMessage);
    }
    session.endDialog();
}).triggerAction({
    matches: 'Explore_painting'
});
bot.dialog('Show', function (session, args) {
    var userMessage = session.message.text;
    console.log("you said: " + userMessage);
    var intent = args.intent;
    var artist_entity = builder.EntityRecognizer.findEntity(intent.entities, 'Artist');
    if (artist_entity != null) {
        var paintings = explore_1.getPaintings(artist_entity.entity);
        session.send(paintings);
    }
    else {
        session.send("Didn't recognize: " + userMessage);
        session.send(exports.helpMessage);
    }
    session.endDialog();
}).triggerAction({
    matches: 'Show'
});
