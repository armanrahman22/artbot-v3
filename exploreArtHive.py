import requests
from bs4 import BeautifulSoup
import urllib.parse
import json

ARTISTS = ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet', 'Salvador Dali', 'Henri Matisse', 'Rembrandt',
'Andy Warhol', "Georgia O'Keeffe", 'Michelangelo', 'Peter Paul Rubens', 'Edgar Degas', 'Caravaggio', 'Pierre-Auguste Renoir', 'Raphael', 'Paul Cezanne', 
'Marc Chagall', 'Titian', 'Joan Miro', 'Jackson Pollock', 'Gustav Klimt', 'Albrecht Durer', 'Edward Hopper', 'Wassily Kandinsky', 'Jan Vermeer', 'Paul Klee', 
'Edvard Munch', 'Goya', 'Janet Fish', 'Edouard Manet']

return_dictionary = {}
return_dictionary["artists"] = []

def get_artist_urls():
    for artist in ARTISTS:
        url_encoded = 'https://arthive.com/search/search:{0}'.format(urllib.parse.quote_plus(artist))
        page = requests.get(url_encoded)
        soup = BeautifulSoup(page.text, 'html.parser')
        if soup.find(class_='search-painter-list'):
            artist_url = soup.find(class_='search-painter-list').find('a').get('href')
            if artist_url == "/galleries/":
                artist_url = soup.find_all(class_='search-painter-list')[1].find('a').get('href')
            print(artist_url)
            artist_dict = {}
            artist_dict["artist_url"] = artist_url
            artist_dict["artist_name"] = artist
            return_dictionary["artists"].append(artist_dict)


def get_famous_paintings_urls():
    get_artist_urls()
    print("\n")
    print(json.dumps(return_dictionary, sort_keys=True, indent=4))
    print("\n")
    for artist in return_dictionary["artists"]:
        print(artist)
        url_encoded = 'https://arthive.com{0}/works/sort:popular'.format(artist["artist_url"])
        page = requests.get(url_encoded)
        soup = BeautifulSoup(page.text, 'html.parser')
        all_paintings = soup.find_all(class_='favorites-art-container picture-item c_span_link pointer')
        artist["paintings"] = []
        for index, painting in enumerate(all_paintings):
            famous_paintings_url = painting.get('href')
            url_encoded = 'https://arthive.com{0}'.format(famous_paintings_url)
            page = requests.get(url_encoded)
            soup = BeautifulSoup(page.text, 'html.parser')
            painting = {}
            painting['painting_title'] = soup.find(class_='picture-detail-title text-center').h1.string
            painting['painting_info'] = soup.find(class_='picture-detail-info s12').get_text()
            painting['painting_description'] = soup.find(class_='picture-detail-annotation-text').get_text()
            painting['painting_image_url'] = soup.find(class_='c_main_work_image').get('src')
            artist["paintings"].append(painting)

get_famous_paintings_urls()
with open("FamousPaintings.json", "w") as write_file:
    json.dump(return_dictionary, write_file)