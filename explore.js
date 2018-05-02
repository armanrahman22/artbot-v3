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
var JSSoup = require('jssoup')["default"];
var uuidv1 = require('uuid/v1');
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
                    if (!(_i < all_urls_1.length)) return [3 /*break*/, 11];
                    artist_url = all_urls_1[_i];
                    console.log("working on artist " + artist_url + " number: " + count);
                    count++;
                    url = "http://www.wikiart.org/en/" + artist_url + "?json=2";
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 9, , 10]);
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
                    // artist.rangePaintings = await paintings_by_artist_range(artist.url);
                    artist.popularPaintings = paintings_by_artist_famous(artist.contentId, artist.artistName);
                    if (!(artist.popularPaintings.length == 0)) return [3 /*break*/, 8];
                    _a = artist;
                    return [4 /*yield*/, paintings_by_artist_range(artist.url)];
                case 7:
                    _a.popularPaintings = _b.sent();
                    _b.label = 8;
                case 8:
                    all_artists.push(artist);
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _b.sent();
                    console.log(err_1);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 3];
                case 11:
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
function paintings_by_artist_famous(artist_id, artist_name) {
    var json_data = getFamousPaintingsFromFile();
    var paintingList = [];
    for (var _i = 0, _a = json_data.artists; _i < _a.length; _i++) {
        var artist = _a[_i];
        if (artist.artist_name == artist_name) {
            console.log(artist_name);
            for (var _b = 0, _c = artist.paintings; _b < _c.length; _b++) {
                var jsonPainting = _c[_b];
                var painting = {
                    paintingTitle: jsonPainting.painting_title,
                    artistName: artist_name,
                    artistContentId: artist_id,
                    paintingContentId: uuidv1(),
                    paintingInfo: jsonPainting.painting_info,
                    paintingImageUrl: jsonPainting.painting_image_url,
                    paintingDescription: jsonPainting.painting_description
                };
                paintingList.push(painting);
            }
        }
    }
    console.log("   getting " + paintingList.length + " famous paintings");
    return paintingList;
}
exports.paintings_by_artist_famous = paintings_by_artist_famous;
function paintings_by_artist_range(artist_url) {
    return __awaiter(this, void 0, void 0, function () {
        var request_uri, paintingIdsList, response, data, _i, data_1, artwork, err_2, paintingList;
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
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        artwork = data_1[_i];
                        paintingIdsList.push(artwork.contentId);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    console.log(err_2);
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
        var paintingList, unwantedPaintingList, count, descriptionCount, length, mod, _i, paintingIdsList_1, id, request_uri, response, data, description, painting, painting, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paintingList = [];
                    unwantedPaintingList = [];
                    count = 0;
                    descriptionCount = 0;
                    length = paintingIdsList.length;
                    mod = Math.floor(length / 10);
                    _i = 0, paintingIdsList_1 = paintingIdsList;
                    _a.label = 1;
                case 1:
                    if (!(_i < paintingIdsList_1.length)) return [3 /*break*/, 9];
                    id = paintingIdsList_1[_i];
                    if (!(descriptionCount < 10)) return [3 /*break*/, 8];
                    request_uri = "http://www.wikiart.org/en/App/Painting/ImageJson/" + id;
                    if (count % mod == 0) {
                        console.log("     Processing artwork number " + count + " of " + length + ". " + (10 - descriptionCount) + " descriptions left.");
                    }
                    count++;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, fetch(request_uri)];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    description = data.description;
                    if (!!description) return [3 /*break*/, 6];
                    return [4 /*yield*/, getWikiInfo(data.artistName, data.title)];
                case 5:
                    description = _a.sent();
                    _a.label = 6;
                case 6:
                    if (description) {
                        painting = {
                            paintingTitle: data.title,
                            artistName: data.artistName,
                            artistContentId: data.artistContentId,
                            paintingContentId: data.contentId,
                            paintingInfo: data.yearAsString,
                            paintingImageUrl: data.url,
                            paintingDescription: description
                        };
                        paintingList.push(painting);
                        descriptionCount++;
                    }
                    else if (count % mod == 0) {
                        painting = {
                            paintingTitle: data.title,
                            artistName: data.artistName,
                            artistContentId: data.artistContentId,
                            paintingContentId: data.contentId,
                            paintingInfo: data.yearAsString,
                            paintingImageUrl: data.url,
                            paintingDescription: description
                        };
                        unwantedPaintingList.push(painting);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [3 /*break*/, 8];
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9:
                    if (descriptionCount < 11) {
                        console.log("      " + (10 - descriptionCount) + " undescribed paintings found.");
                    }
                    while (descriptionCount < 10) {
                        paintingList.push(unwantedPaintingList.pop());
                        descriptionCount++;
                    }
                    return [2 /*return*/, paintingList];
            }
        });
    });
}
function getWikiInfo(artist_name, painting_name) {
    return __awaiter(this, void 0, void 0, function () {
        var url_artist_name, url_painting_name, request_uri, response, data, wiki_name, pageid, extract, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url_artist_name = artist_name.split(" ")[0];
                    url_painting_name = painting_name.replace(/ /g, "_");
                    request_uri = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + url_painting_name + "+" + url_artist_name;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, fetch(request_uri)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!(data.length && data[3][0])) return [3 /*break*/, 8];
                    wiki_name = data[3][0].split("/").slice(-1)[0];
                    console.log("           got description: " + wiki_name);
                    request_uri = "https://en.wikipedia.org/w/api.php?action=query&titles=" + wiki_name + "&format=json";
                    return [4 /*yield*/, fetch(request_uri)];
                case 4:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 5:
                    data = _a.sent();
                    pageid = data.query.pages[Object.keys(data.query.pages)[0]].pageid;
                    if (!pageid) return [3 /*break*/, 8];
                    request_uri = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=" + pageid + "&exintro=1&explaintext=1";
                    return [4 /*yield*/, fetch(request_uri)];
                case 6:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 7:
                    data = _a.sent();
                    extract = data.query.pages[Object.keys(data.query.pages)[0]].extract;
                    return [2 /*return*/, extract];
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_4 = _a.sent();
                    console.log(err_4);
                    return [3 /*break*/, 10];
                case 10:
                    console.log("           No wiki description found: " + request_uri);
                    return [2 /*return*/, null];
            }
        });
    });
}
exports.getWikiInfo = getWikiInfo;
function getArtistInfo(artist_name) {
    for (var _i = 0, ALL_ARTISTS_1 = app_1.ALL_ARTISTS; _i < ALL_ARTISTS_1.length; _i++) {
        var artist = ALL_ARTISTS_1[_i];
        if (artist.artistName.search(new RegExp(artist_name, 'i')) != -1) {
            var json = {
                intent: "Explore_artist",
                textResponse: artist.biography.replace(/ *\[[^)]*\] */g, ""),
                jsonResponse: null
            };
            return JSON.stringify(json);
        }
    }
    return "No artist found with name: " + artist_name;
}
exports.getArtistInfo = getArtistInfo;
function explorePainting(paintingID) {
    for (var _i = 0, ALL_ARTISTS_2 = app_1.ALL_ARTISTS; _i < ALL_ARTISTS_2.length; _i++) {
        var artist = ALL_ARTISTS_2[_i];
        for (var _a = 0, _b = artist.rangePaintings; _a < _b.length; _a++) {
            var painting = _b[_a];
            if (painting.paintingContentId == paintingID) {
                var json = {
                    intent: "Explore_painting",
                    textResponse: painting.paintingDescription.replace(/ *\[[^)]*\] */g, ""),
                    jsonResponse: null
                };
                return JSON.stringify(json);
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
            var json = {
                intent: "Show",
                textResponse: null,
                jsonResponse: JSON.stringify(artist.popularPaintings)
            };
            return JSON.stringify(json);
        }
    }
    return "No paintings by " + artist_name + " found!";
}
exports.getPaintings = getPaintings;
