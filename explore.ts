import {ALL_ARTISTS, helpMessage} from './app';
const FuzzySet = require('fuzzyset.js');
const fs = require('fs');
const JSSoup = require('jssoup').default;
const uuidv1 = require('uuid/v1');

const ARTISTS: string[] = ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet', 'Salvador Dali', 'Henri Matisse', 'Rembrandt',
'Andy Warhol', "Georgia O'Keeffe", 'Michelangelo', 'Peter Paul Rubens', 'Edgar Degas', 'Caravaggio', 'Pierre-Auguste Renoir', 'Raphael', 'Paul Cezanne', 
'Marc Chagall', 'Titian', 'Joan Miro', 'Jackson Pollock', 'Gustav Klimt', 'Albrecht Durer', 'Edward Hopper', 'Wassily Kandinsky', 'Jan Vermeer', 'Paul Klee', 
'Edvard Munch', 'Goya', 'Janet Fish', 'Edouard Manet'];
const FUZZYFULLNAMES = FuzzySet(ARTISTS);


export interface Artist {
    contentId: number,
    artistName: string,
    url: string,
    lastNameFirst: string,
    birthDay: number,
    deathDay: number,
    birthDayAsString: string,
    deathDayAsString: string,
    image: string,
    wikipediaUrl: string,
    periodsOfWork: string,
    series: string,
    activeYearsStart: number,
    activeYearsCompletion: number,
    biography: string,
    story: string,
    gender: string,
    originalArtistName: string,
    relatedArtistsIds: number[],
    popularPaintings: Artwork[],
    rangePaintings: Artwork[]
}

export interface Artwork {
    artistName: string,
    artistContentId: number,
    paintingContentId: number,
    paintingTitle: string,
    paintingInfo: string,
    paintingDescription: string,
    paintingImageUrl: string
}

export interface ReturnJson {
    intent: string,
    textResponse: string,
    jsonResponse: Artwork[]
}


export function getBestmatch(value: string) : string {
    let matches: [number, string][] = FUZZYFULLNAMES.get(value);
    if(matches != null && matches.length > 0) {
        let bestMatch: string;
        let bestMatchValue: number = 0.0;
        for(let match of matches) {
            if (match[0] > bestMatchValue) {
                bestMatch = match[1];
                bestMatchValue = match[0];
            }
        }
        if(bestMatchValue > .8){
            return bestMatch;
        } 
    } 
    return null;
}


export function getAllArtistsFromFile(): Artist[]{
    let json_data: Artist[] = JSON.parse(fs.readFileSync('FamousArtists.json', 'utf8'));
    return json_data;
}


export function getFamousPaintingsFromFile(){
    let json_data = JSON.parse(fs.readFileSync('FamousPaintings.json', 'utf8'));
    return json_data;
}


export async function getAllArtistsFromAPI(){
    console.log("Getting from API...");
    let response = await fetch("https://www.wikiart.org/en/App/Artist/AlphabetJson?v=new&inPublicDomain=true");
    let data = await response.json();
    let all_urls: string[] = [];
    let all_artists: Artist[] = [];
    data.forEach(artist_json => {
        let match = getBestmatch(artist_json.artistName);
        if(match != null){
            all_urls.push(artist_json.url);
        }
    });
    
    let count = 0;
    for(let artist_url of all_urls) {
        console.log(`working on artist ${artist_url} number: ${count}`);
        count ++;
        let url = "http://www.wikiart.org/en/" + artist_url + "?json=2";
        try {
            let response = await fetch(url);
            let artist_json = await response.json();
            let artist: Artist = {
                contentId: artist_json.contentId,
                artistName: artist_json.artistName,
                url: artist_json.url,
                lastNameFirst: artist_json.lastNameFirst,
                birthDay: artist_json.birthDay,
                deathDay: artist_json.deathDay,
                birthDayAsString: artist_json.birthDayAsString,
                deathDayAsString: artist_json.deathDayAsString,
                image: artist_json.image,
                wikipediaUrl: artist_json.wikipediaUrl,
                periodsOfWork: artist_json.periodsOfWork,
                series: artist_json.series,
                activeYearsStart: artist_json.activeYearsStart,
                activeYearsCompletion: artist_json.activeYearsCompletion,
                biography: artist_json.biography,
                story: artist_json.story,
                gender: artist_json.gender,
                originalArtistName: artist_json.originalArtistName,
                relatedArtistsIds: artist_json.relatedArtistsIds,
                popularPaintings: null,
                rangePaintings: null
            }
            // artist.rangePaintings = await paintings_by_artist_range(artist.url);
            artist.popularPaintings = paintings_by_artist_famous(artist.contentId, artist.artistName);
            if(artist.popularPaintings.length == 0){
                artist.popularPaintings = await paintings_by_artist_range(artist.url);
            }
            all_artists.push(artist);
        }
        catch(err){
            console.log(err);
        }
    }
    
    let jsonData = JSON.stringify(all_artists);
    fs.writeFile("FamousArtists.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("DONE");
}


export function paintings_by_artist_famous(artist_id: number, artist_name: string): Artwork[]{
    let json_data = getFamousPaintingsFromFile();
    let paintingList: Artwork[] = [];
    let paintingIdCounter: number = artist_id * 10;
    for(let artist of json_data.artists) {
        if(artist.artist_name == artist_name){
            console.log(artist_name);
            for(let jsonPainting of artist.paintings) {
                let painting: Artwork = {
                    paintingTitle: jsonPainting.painting_title,
                    artistName: artist_name,
                    artistContentId: artist_id,
                    paintingContentId: paintingIdCounter,
                    paintingInfo: jsonPainting.painting_info,
                    paintingImageUrl: jsonPainting.painting_image_url,
                    paintingDescription: jsonPainting.painting_description
                };
                paintingList.push(painting)
                paintingIdCounter++;
            }
        }
    }
    console.log(`   getting ${paintingList.length} famous paintings`)
    return paintingList;
}


export async function paintings_by_artist_range(artist_url: string): Promise<Artwork[]> {
    let request_uri = `https://www.wikiart.org/en/App/Painting/PaintingsByArtist?artistUrl=${artist_url}&json=2`;
    let paintingIdsList: number[] = [];
    try{
        let response = await fetch(request_uri);
        let data = await response.json();
        for(let artwork of data) {
            paintingIdsList.push(artwork.contentId);
        }
    }
    catch(err){
        console.log(err);
    }
    console.log(`   getting ${paintingIdsList.length} range paintings`);
    let paintingList: Artwork[] = await fillPaintingsFromIds(paintingIdsList);
    return paintingList;
}

async function fillPaintingsFromIds(paintingIdsList: number[]): Promise<Artwork[]> {
    let paintingList: Artwork[] = [];
    let unwantedPaintingList: Artwork[] = [];
    let count = 0;
    let descriptionCount = 0;
    let length = paintingIdsList.length;
    let mod = Math.floor(length/10);
    for(let id of paintingIdsList) {
        if(descriptionCount < 10){
            let request_uri = `http://www.wikiart.org/en/App/Painting/ImageJson/${id}`;
            if(count%mod == 0 ){
                console.log(`     Processing artwork number ${count} of ${length}. ` + (10 - descriptionCount) + " descriptions left.");
            }
            count++;
            try{
                let response = await fetch(request_uri);
                let data = await response.json();
                let description = data.description;
                if(!description){
                    description = await getWikiInfo(data.artistName, data.title);
                }
                if(description){
                    let painting: Artwork = {
                        paintingTitle: data.title,
                        artistName: data.artistName,
                        artistContentId: data.artistContentId,
                        paintingContentId: data.contentId,
                        paintingInfo: data.yearAsString,
                        paintingImageUrl: data.url,
                        paintingDescription: description
                    }
                    paintingList.push(painting);
                    descriptionCount++;
                } else if (count%mod == 0) {
                    let painting: Artwork = {
                        paintingTitle: data.title,
                        artistName: data.artistName,
                        artistContentId: data.artistContentId,
                        paintingContentId: data.contentId,
                        paintingInfo: data.yearAsString,
                        paintingImageUrl: data.url,
                        paintingDescription: description
                    }
                    unwantedPaintingList.push(painting);
                }
            }
            catch(err){
                console.log(err);
            }
        }
    }
    if(descriptionCount < 11 ){
        console.log( "      " + (10 - descriptionCount) + " undescribed paintings found.")
    }
    while(descriptionCount < 10){
        paintingList.push(unwantedPaintingList.pop());
        descriptionCount++
    }
    return paintingList;
}


export async function getWikiInfo(artist_name: string, painting_name: string): Promise<string> {
    let url_artist_name: string = artist_name.split(" ")[0];
    let url_painting_name: string = painting_name.replace(/ /g, "_");
    let request_uri = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${url_painting_name}+${url_artist_name}`;
    try{
        let response = await fetch(request_uri);
        let data = await response.json();
        if (data.length && data[3][0]){
            let wiki_name = data[3][0].split("/").slice(-1)[0];
            console.log("           got description: " + wiki_name);
            request_uri = `https://en.wikipedia.org/w/api.php?action=query&titles=${wiki_name}&format=json`;
            response = await fetch(request_uri);
            data = await response.json();
            let pageid = data.query.pages[Object.keys(data.query.pages)[0]].pageid;
            if(pageid){
                request_uri = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${pageid}&exintro=1&explaintext=1`;
                response = await fetch(request_uri);
                data = await response.json();
                let extract = data.query.pages[Object.keys(data.query.pages)[0]].extract;
                return extract;
            }
        }
    }
    catch(err){
        console.log(err);
    }
    console.log("           No wiki description found: " + request_uri);
    return null;
}

export function getArtistInfo(artist_name: string): string{
    for(let artist of ALL_ARTISTS) {
        if(artist.artistName.search(new RegExp(artist_name, 'i')) != -1) {
            let json: ReturnJson = {
                intent: "Explore_artist",
                textResponse: artist.biography.replace(/ *\[[^)]*\] */g, ""),
                jsonResponse: null
            }
            return JSON.stringify(json);
        }
    }
    let json: ReturnJson = {
        intent: "Explore_artist",
        textResponse: `No artist found with name: ${artist_name}`,
        jsonResponse: null
    }
    return  JSON.stringify(json);
}


export function explorePainting(paintingID: number): string {
    for(let artist of ALL_ARTISTS) {
        for(let painting of artist.popularPaintings){
            if(painting.paintingContentId == paintingID){
                let json: ReturnJson = {
                    intent: "Explore_painting",
                    textResponse: painting.paintingDescription.replace(/ *\[[^)]*\] */g, ""),
                    jsonResponse: null
                }
                return JSON.stringify(json);
            }
        }
    }
    let json: ReturnJson = {
        intent: "Explore_artist",
        textResponse: `No descrtiption for that painting found!`,
        jsonResponse: null
    }
    return  JSON.stringify(json);
}


export function getPaintings(artist_name: string): string {
    for(let artist of ALL_ARTISTS) {
        if(artist.artistName.search(new RegExp(artist_name, 'i')) != -1) {
            let json: ReturnJson = {
                intent: "Show",
                textResponse: null,
                jsonResponse: artist.popularPaintings
            }
            return JSON.stringify(json);
            
        }
    }
    let json: ReturnJson = {
        intent: "Explore_artist",
        textResponse: `No paintings by ${artist_name} found!`,
        jsonResponse: null
    }
    return  JSON.stringify(json);
}