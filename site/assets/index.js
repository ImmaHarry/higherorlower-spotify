let artist_btn_1 = document.getElementById("submit-artist-1");
let artist_btn_2 = document.getElementById("submit-artist-2");
let artist_text_box_1 = document.getElementById("artist-textbox-1");
let artist_text_box_2 = document.getElementById("artist-textbox-2");
token = "";


function getArtistData(artist_name) {
    let artist_id;
    let url = "https://api.spotify.com/v1/search?q=" + artist_name + "&type=artist";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send();
    let response = JSON.parse(xhr.responseText);

    artist_name = response.artists.items[0].name;
    artist_id = response.artists.items[0].id;
    artist_img = response.artists.items[0].images[0].url;

    return {
        "artist_name": artist_name,
        "artist_id": artist_id,
        "artist_img": artist_img
    }
}

function getAlbums() {
    //artist_id = getArtistData("The Weeknd").artist_id;
    let url = "https://api.spotify.com/v1/artists/" + artist_id + "/albums?include_groups=album&market=US&limit=50";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send();
    let response = JSON.parse(xhr.responseText);
    let albums = response.items;
    let album_list = [];
    for (let i = 0; i < albums.length; i++) {
        let album = {
            "album_id": albums[i].id,
            "album_name": albums[i].name,
            "album_img": albums[i].images[0].url
        }
        album_list.push(album);
    }
    return album_list;
}

function getAlbumIDs() {
    let album_ids = [];
    let albums = getAlbums();
    for (let i = 0; i < albums.length; i++) {
        album_ids.push(albums[i].album_id);
    }
    return album_ids;
}

function getSongs() {
    let album_ids = getAlbumIDs();
    let song_list = [];
    for (let i = 0; i < album_ids.length; i++) {
        let url = "https://api.spotify.com/v1/albums/" + album_ids[i] + "/tracks";
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.send();
        let response = JSON.parse(xhr.responseText);
        let songs = response.items;
        for (let j = 0; j < songs.length; j++) {
            let song = {
                "song_id": songs[j].id,
            }
            song_list.push(song);
        }
    }
    return song_list;
}

function getStreams() {
    let songs = getSongs();
    let stream_list = [];
    for (let i = 0; i < songs.length; i++) {
        let url = "https://api.spotify.com/v1/audio-features/" + songs[i].song_id;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.setRequestHeader
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.send();
        let response = JSON.parse(xhr.responseText);
        let stream = {
            "song_name": response.name,
            "streams": response.popularity
        }
        stream_list.push(stream);
    }
    return stream_list;
}

function getRandomSong() {
    let album_ids = getAlbumIDs();
    let random_album_id = album_ids[Math.floor(Math.random() * album_ids.length)];
    let url = "https://api.spotify.com/v1/albums/" + random_album_id + "/tracks";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send();
    let response = JSON.parse(xhr.responseText);
    let songs = response.items;
    let random_song = songs[Math.floor(Math.random() * songs.length)];
    return random_song;
}

console.log(getRandomSong());
