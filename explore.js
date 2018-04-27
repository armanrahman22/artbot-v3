"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var app_1 = require("./app");
var FuzzySet = require('fuzzyset.js');
var fs = require('fs');
var ARTISTS = ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet', 'Salvador Dali', 'Henri Matisse', 'Rembrandt',
    'Andy Warhol', "Georgia O'Keeffe", 'Michelangelo', 'Peter Paul Rubens', 'Edgar Degas', 'Caravaggio', 'Pierre-Auguste Renoir', 'Raphael', 'Paul Cezanne',
    'Marc Chagall', 'Titian', 'Joan Miro', 'Jackson Pollock', 'Gustav Klimt', 'Albrecht Durer', 'Edward Hopper', 'Wassily Kandinsky', 'Jan Vermeer', 'Paul Klee',
    'Edvard Munch', 'Goya', 'Janet Fish', 'Edouard Manet'];
var FUZZYFULLNAMES = FuzzySet(ARTISTS);
function getBestmatch(value) {
    var matches = FUZZYFULLNAMES.get(value);
    if (matches != null && matches.length > 0) {
        var bestMatch = void 0;
        var bestMatchValue = 0.0;
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            if (match[0] > bestMatchValue) {
                bestMatch = match[1];
                bestMatchValue = match[0];
            }
        }
        if (bestMatchValue > .8) {
            return bestMatch;
        }
        return null;
    }
    return null;
}
exports.getBestmatch = getBestmatch;
function getAllArtistsFromFile() {
    var json_data = JSON.parse(fs.readFileSync('FamousArtists.json', 'utf8'));
    return json_data;
}
exports.getAllArtistsFromFile = getAllArtistsFromFile;
function getFamousPaintingsFromFile() {
    var json_data = JSON.parse(fs.readFileSync('FamousPaintings.json', 'utf8'));
    return json_data;
}
exports.getFamousPaintingsFromFile = getFamousPaintingsFromFile;
function getAllArtistsFromAPI() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, all_urls, all_artists, count, _i, all_urls_1, artist_url, url, response_1, artist_json, artist, _a, err_1, jsonData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Getting from API...");
                    return [4 /*yield*/, fetch("https://www.wikiart.org/en/App/Artist/AlphabetJson?v=new&inPublicDomain=true")];
                case 1:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _b.sent();
                    all_urls = [];
                    all_artists = [];
                    data.forEach(function (artist_json) {
                        var match = getBestmatch(artist_json.artistName);
                        if (match != null) {
                            all_urls.push(artist_json.url);
                        }
                    });
                    count = 0;
                    _i = 0, all_urls_1 = all_urls;
                    _b.label = 3;
                case 3:
                    if (!(_i < all_urls_1.length)) return [3 /*break*/, 10];
                    artist_url = all_urls_1[_i];
                    console.log("working on artist number: " + count);
                    count++;
                    url = "http://www.wikiart.org/en/" + artist_url + "?json=2";
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, fetch(url)];
                case 5:
                    response_1 = _b.sent();
                    return [4 /*yield*/, response_1.json()];
                case 6:
                    artist_json = _b.sent();
                    artist = {
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
                    };
                    _a = artist;
                    return [4 /*yield*/, paintings_by_artist_range(artist.url)];
                case 7:
                    _a.rangePaintings = _b.sent();
                    artist.popularPaintings = paintings_by_artist_famous(artist.contentId);
                    all_artists.push(artist);
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _b.sent();
                    console.log(err_1);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    jsonData = JSON.stringify(all_artists);
                    fs.writeFile("FamousArtists.json", jsonData, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    console.log("DONE");
                    return [2 /*return*/];
            }
        });
    });
}
exports.getAllArtistsFromAPI = getAllArtistsFromAPI;
function getAllPaintingsFromAPI() {
    return __awaiter(this, void 0, void 0, function () {
        var paintingIdsList, request_uri, response, data, err_2, paintingList, jsonData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Getting famous paintings...");
                    paintingIdsList = [];
                    request_uri = "https://www.wikiart.org/en/App/Painting/MostViewedPaintings?randomSeed=123&json=2&inPublicDomain=true";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(request_uri)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    data.forEach(function (painting_json) {
                        paintingIdsList.push(painting_json.contentId);
                    });
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, fillPaintingsFromIds(paintingIdsList)];
                case 6:
                    paintingList = _a.sent();
                    jsonData = JSON.stringify(paintingList);
                    fs.writeFile("FamousPaintings.json", jsonData, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    console.log("DONE");
                    return [2 /*return*/];
            }
        });
    });
}
exports.getAllPaintingsFromAPI = getAllPaintingsFromAPI;
function paintings_by_artist_famous(artist_id) {
    var paintingList = [];
    for (var _i = 0, ALL_PAINTINGS_1 = app_1.ALL_PAINTINGS; _i < ALL_PAINTINGS_1.length; _i++) {
        var painting = ALL_PAINTINGS_1[_i];
        if (painting.artistContentId == artist_id) {
            paintingList.push(painting);
        }
    }
    console.log("   getting " + paintingList.length + " famous paintings");
    return paintingList;
}
exports.paintings_by_artist_famous = paintings_by_artist_famous;
function paintings_by_artist_range(artist_url) {
    return __awaiter(this, void 0, void 0, function () {
        var request_uri, paintingIdsList, response, data, indexer, i, err_3, paintingList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request_uri = "https://www.wikiart.org/en/App/Painting/PaintingsByArtist?artistUrl=" + artist_url + "&json=2";
                    paintingIdsList = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(request_uri)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    indexer = Math.floor(data.length / 10);
                    i = 0;
                    while (i < data.length) {
                        if (data[i]) {
                            paintingIdsList.push(data[i].contentId);
                        }
                        i = i + indexer;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [3 /*break*/, 5];
                case 5:
                    console.log("   getting " + paintingIdsList.length + " range paintings");
                    return [4 /*yield*/, fillPaintingsFromIds(paintingIdsList)];
                case 6:
                    paintingList = _a.sent();
                    return [2 /*return*/, paintingList];
            }
        });
    });
}
exports.paintings_by_artist_range = paintings_by_artist_range;
function fillPaintingsFromIds(paintingIdsList) {
    return __awaiter(this, void 0, void 0, function () {
        var paintingList, count, length, mod, _i, paintingIdsList_1, id, request_uri, response, data, painting, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paintingList = [];
                    count = 0;
                    length = paintingIdsList.length;
                    mod = Math.floor(length / 10);
                    _i = 0, paintingIdsList_1 = paintingIdsList;
                    _a.label = 1;
                case 1:
                    if (!(_i < paintingIdsList_1.length)) return [3 /*break*/, 7];
                    id = paintingIdsList_1[_i];
                    request_uri = "http://www.wikiart.org/en/App/Painting/ImageJson/" + id;
                    if (count % mod == 0) {
                        console.log("     Processing artwork number " + count + " of " + length);
                    }
                    count++;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetch(request_uri)];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    painting = {
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
                    };
                    paintingList.push(painting);
                    return [3 /*break*/, 6];
                case 5:
                    err_4 = _a.sent();
                    console.log(err_4);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, paintingList];
            }
        });
    });
}
function getArtistInfo(artist_name) {
    for (var _i = 0, ALL_ARTISTS_1 = app_1.ALL_ARTISTS; _i < ALL_ARTISTS_1.length; _i++) {
        var artist = ALL_ARTISTS_1[_i];
        if (artist.artistName.search(new RegExp(artist_name, 'i')) != -1) {
            return artist.biography.replace(/ *\[[^)]*\] */g, "");
        }
    }
    return "No artist found with name: " + artist_name;
}
exports.getArtistInfo = getArtistInfo;
function explorePainting() {
    // TODO: get real ID 
    var paintingID = 0;
    for (var _i = 0, ALL_ARTISTS_2 = app_1.ALL_ARTISTS; _i < ALL_ARTISTS_2.length; _i++) {
        var artist = ALL_ARTISTS_2[_i];
        for (var _a = 0, _b = artist.rangePaintings; _a < _b.length; _a++) {
            var painting = _b[_a];
            if (painting.contentId == paintingID) {
                return painting.description.replace(/ *\[[^)]*\] */g, "");
            }
        }
    }
    return "No descrtiption for that painting found!";
}
exports.explorePainting = explorePainting;
function getPaintings(artist_name) {
    for (var _i = 0, ALL_ARTISTS_3 = app_1.ALL_ARTISTS; _i < ALL_ARTISTS_3.length; _i++) {
        var artist = ALL_ARTISTS_3[_i];
        if (artist.artistName.search(new RegExp(artist_name, 'i')) != -1) {
            return JSON.stringify(artist.rangePaintings);
        }
    }
    return "No paintings by " + artist_name + " found!";
}
exports.getPaintings = getPaintings;
