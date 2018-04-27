var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
import {getArtistInfo, Artist, getAllArtistsFromFile, getAllArtistsFromAPI, Artwork, 
    getAllPaintingsFromAPI, getFamousPaintingsFromFile, getPaintings, explorePainting} from './explore';

require('es6-promise').polyfill();
require('isomorphic-fetch');
require('dotenv').load();

export const helpMessage = 
    `You can: \n 
    Start by showing artwork by saying something like 'Show me paintings by Rothko'. \n
    Get details about the piece you're looking at: 'Tell me more about this painting'. \n
    Get details about the artist: 'Tell me about Rothko' or "Who is Rothko".`;

// getAllPaintingsFromAPI();
// getAllArtistsFromAPI();
export const ALL_PAINTINGS: Artwork[] = getFamousPaintingsFromFile();
export const ALL_ARTISTS: Artist[] = getAllArtistsFromFile();

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
    if (!session.userData.registered) {
        session.userData.registered = true;
        session.send(helpMessage);
    }
}).set('storage', inMemoryStorage);


// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;

const LuisModelUrl = 'https://eastus2.api.cognitive.microsoft.com/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

console.log(LuisModelUrl);
// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

bot.dialog('Explore_artist',
    (session, args) => {
        var intent = args.intent;
        var artist_entity = builder.EntityRecognizer.findEntity(intent.entities, 'Artist');
        if(artist_entity.entity != null ){
            let bio: string = getArtistInfo(artist_entity.entity);
            session.send(bio);
        }
        session.endDialog();
    }
).triggerAction({
    matches: 'Explore_artist'
});

bot.dialog('Explore_painting',
    (session, args) => {
        let description: string = explorePainting();
        session.send(description);
        session.endDialog();
    }
).triggerAction({
    matches: 'Explore_painting'
});

bot.dialog('Show',
    (session, args) => {
        var intent = args.intent;
        var artist_entity = builder.EntityRecognizer.findEntity(intent.entities, 'Artist');
        if(artist_entity.entity != null ){
            let paintings: string = getPaintings(artist_entity.entity);
            session.send(paintings);
        }
        session.endDialog();
    }
).triggerAction({
    matches: 'Show'
});