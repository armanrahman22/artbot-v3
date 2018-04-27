import {ALL_ARTISTS, ALL_PAINTINGS, helpMessage} from './app';
const FuzzySet = require('fuzzyset.js');
var fs = require('fs');

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
    title: string,
    artistName: string,
    artistContentId: number,
    completitionYear: number,
    yearAsString: string,
    width: number,
    height: number,
    image: string,
    contentId: number,
    artistUrl: string,
    url: string,
    location: string,
    period: string,
    serie: string,
    genre: string,
    material: string,
    style: string,
    technique: string,
    sizeX: number,
    sizeY: number,
    diameter: number,
    auction: string,
    yearOfTrade: number,
    lastPrice: string,
    galleryName: string,
    tags: string,
    description: string
    
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
        return null;
    } 
    return null;
}


export function getAllArtistsFromFile(): Artist[]{
    let json_data: Artist[] = JSON.parse(fs.readFileSync('FamousArtists.json', 'utf8'));
    return json_data;
}

export function getFamousPaintingsFromFile(): Artwork[]{
    let json_data: Artwork[] = JSON.parse(fs.readFileSync('FamousPaintings.json', 'utf8'));
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
        console.log("working on artist number: " + count);
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
            artist.rangePaintings = await paintings_by_artist_range(artist.url);
            artist.popularPaintings = paintings_by_artist_famous(artist.contentId);
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

export async function getAllPaintingsFromAPI(){
    console.log("Getting famous paintings...");
    let paintingIdsList: number[] = [];
    let request_uri = `https://www.wikiart.org/en/App/Painting/MostViewedPaintings?randomSeed=123&json=2&inPublicDomain=true`;
    try{
        let response = await fetch(request_uri);
        let data = await response.json();
        data.forEach(painting_json => {
            paintingIdsList.push(painting_json.contentId);
        });
    }
    catch(err){
        console.log(err);
    }
    let paintingList: Artwork[] = await fillPaintingsFromIds(paintingIdsList);
    let jsonData = JSON.stringify(paintingList);
    fs.writeFile("FamousPaintings.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("DONE");
}


export function paintings_by_artist_famous(artist_id: number): Artwork[]{
    let paintingList: Artwork[] = [];
    for(let painting of ALL_PAINTINGS) {
        if(painting.artistContentId == artist_id){
            paintingList.push(painting);
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
        let indexer = Math.floor(data.length/10);
        let i = 0;
        while (i < data.length){
            if(data[i]){
                paintingIdsList.push(data[i].contentId);
            } 
            i = i + indexer;
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
    let count = 0;
    let length = paintingIdsList.length;
    let mod = Math.floor(length/10);
    for(let id of paintingIdsList) {
        let request_uri = `http://www.wikiart.org/en/App/Painting/ImageJson/${id}`;
        if(count%mod == 0 ){
            console.log(`     Processing artwork number ${count} of ${length}`);
        }
        count++;
        try{
            let response = await fetch(request_uri);
            let data = await response.json();
            let painting: Artwork = {
                title: data.title,
                artistName: data.artistName,
                artistContentId: data.artistContentId,
                completitionYear: data.completitionYear,
                yearAsString: data.yearAsString,
                width: data.width,
                height: data.height,
                image: data.image,
                contentId: data.contentId,
                artistUrl: data.artistUrl,
                url: data.url,
                location: data.location,
                period: data.period,
                serie: data.serie,
                genre: data.genre,
                material: data.material,
                style: data.style,
                technique: data.technique,
                sizeX: data.sizeX,
                sizeY: data.sizeY,
                diameter: data.diameter,
                auction: data.auction,
                yearOfTrade: data.yearOfTrade,
                lastPrice: data.lastPrice,
                galleryName: data.galleryName,
                tags: data.tags,
                description: data.description
            }
            paintingList.push(painting);
        }
        catch(err){
            console.log(err);
        }
    }
    return paintingList;
}


export function getArtistInfo(artist_name: string): string{
    for(let artist of ALL_ARTISTS) {
        if(artist.artistName.search(new RegExp(artist_name, 'i')) != -1) {
            return artist.biography.replace(/ *\[[^)]*\] */g, "");
        }
    }
    return `No artist found with name: ${artist_name}`;
}


export function explorePainting(): string {
    // TODO: get real ID 
    let paintingID = 0;
    for(let artist of ALL_ARTISTS) {
        for(let painting of artist.rangePaintings){
            if(painting.contentId == paintingID){
                return painting.description.replace(/ *\[[^)]*\] */g, "");
            }
        }
    }
    return `No descrtiption for that painting found!`;
}


export function getPaintings(artist_name: string): string {
    for(let artist of ALL_ARTISTS) {
        if(artist.artistName.search(new RegExp(artist_name, 'i')) != -1) {
            return JSON.stringify(artist.rangePaintings);
        }
    }
    return `No paintings by ${artist_name} found!`;
}