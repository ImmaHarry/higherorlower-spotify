let artist_name_one = document.querySelector("#artist-name-1")
let artist_name_two = document.querySelector("#artist-name-2")

let album_name_one = document.querySelector("#album-name-1")
let album_name_two = document.querySelector("#album-name-2")
let album_release_one = document.querySelector("#release-year-1")
let album_release_two = document.querySelector("#release-year-2")
let album_thumbnail_one = document.querySelector("#artist-thumbnail-1")
let album_thumbnail_two = document.querySelector("#artist-thumbnail-2")
let album_first_streams = document.querySelector("#artist-streams-start")
let album_second_streams = document.querySelector("#artist-streams-next")

//This is going to expire so I don't care.
let spotify_token = "BQD45q0U-UbNr1XslitFjrmce36Q5moNCiXHRD-WuSFv09-fNj76J_IEvdPXLi9Rlzod1CudbM0WYyfdN_gfK9FDjIn3a5vUrewDJORWq0xb36m9o1mZ3VI5tmy-M-aWFp_IzZuG4rk0fzzV_m1l6mP1pUS-9m4bx_-bqdougE184XYsvnavXVaK51PQNPXdCilHLNs"

playlists = ["https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF?si=faaa2d272ee3496e","https://open.spotify.com/playlist/37i9dQZF1DX7iB3RCnBnN4?si=a19e44f9f7c34acb"]
score = 0

async function getArtists() {
    let artists = []
    for (let i = 0; i < playlists.length; i++) {
        let playlist_id = playlists[i].split("playlist/")[1].split("?")[0]
        let response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${spotify_token}`
            }
        })
        let data = await response.json()
        for (let j = 0; j < data.items.length; j++) {
            artists.push(data.items[j].track.artists[0].name)
        }
    }
    return [...new Set(artists)]
}

async function getRandomAlbum() {
    random_artist = await getArtists()
    random_artist = random_artist[Math.floor(Math.random() * random_artist.length)]
    let response = await fetch(`https://api.spotify.com/v1/search?q=${random_artist}&type=album`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${spotify_token}`
        }
    })
    let data = await response.json()
    let random_album = data.albums.items[Math.floor(Math.random() * data.albums.items.length)]
    let response2 = await fetch(`https://api.spotify.com/v1/albums/${random_album.id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${spotify_token}`,
            "Content-Type": "application/json"
        }
    })
    let data2 = await response2.json()
    return {
        "name": data2.name,
        "release_year": data2.release_date.split("-")[0],
        "popularity": data2.popularity,
        "thumbnail": data2.images[0].url,
        "artist_name": data2.artists[0].name
    }
}

let start_container = document.querySelector("#start-container")
let start_game_btn = document.querySelector("#start-game-btn")
let guess_controls = document.querySelector("#guess-controls")
let higher_btn = document.querySelector("#higher-btn")
let lower_btn = document.querySelector("#lower-btn")
let score_counter = document.querySelector("#score-counter")

function endGame(score, pop1, pop2) {
    alert(`Game over! Your score is ${score}! The first album had a popularity of ${pop1} and the second album had a popularity of ${pop2}`)
    location.reload()
}

start_game_btn.addEventListener("click", async () => {

    start_game_btn.disabled = true

    let random_album = await getRandomAlbum()
    album_name_one.innerHTML = random_album.name
    album_release_one.innerHTML = random_album.release_year
    album_thumbnail_one.src = random_album.thumbnail
    artist_name_one.innerHTML = random_album.artist_name
    album_first_streams.innerHTML = random_album.popularity

    let random_album2 = await getRandomAlbum()
    album_name_two.innerHTML = random_album2.name
    album_release_two.innerHTML = random_album2.release_year
    album_thumbnail_two.src = random_album2.thumbnail
    artist_name_two.innerHTML = random_album2.artist_name
    album_second_streams.innerHTML = "???"

    start_container.classList.add("hidden")
    guess_controls.classList.add("flex")
    guess_controls.classList.remove("hidden")

    higher_btn.addEventListener("click", async () => {
        if (random_album.popularity < random_album2.popularity) {
            score++
            score_counter.innerHTML = score
            random_album = random_album2
            album_name_one.innerHTML = random_album.name
            album_release_one.innerHTML = random_album.release_year
            album_thumbnail_one.src = random_album.thumbnail
            artist_name_one.innerHTML = random_album.artist_name
            album_first_streams.innerHTML = random_album.popularity
            random_album2 = await getRandomAlbum()
            album_name_two.innerHTML = random_album2.name
            album_release_two.innerHTML = random_album2.release_year
            album_thumbnail_two.src = random_album2.thumbnail
            artist_name_two.innerHTML = random_album2.artist_name
            album_second_streams.innerHTML = "???"
        } else {
            endGame(score, random_album.popularity, random_album2.popularity)
        }
    })
    lower_btn.addEventListener("click", async () => {
        if (random_album.popularity > random_album2.popularity) {
            score++
            score_counter.innerHTML = score
            random_album = random_album2
            album_name_one.innerHTML = random_album.name
            album_release_one.innerHTML = random_album.release_year
            album_thumbnail_one.src = random_album.thumbnail
            artist_name_one.innerHTML = random_album.artist_name
            album_first_streams.innerHTML = random_album.popularity
            random_album2 = await getRandomAlbum()
            album_name_two.innerHTML = random_album2.name
            album_release_two.innerHTML = random_album2.release_year
            album_thumbnail_two.src = random_album2.thumbnail
            artist_name_two.innerHTML = random_album2.artist_name
            album_second_streams.innerHTML = "???"
        } else {
            endGame(score, random_album.popularity, random_album2.popularity)
        }
    })
})

