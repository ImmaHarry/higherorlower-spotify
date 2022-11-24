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

let spotify_token = "BQBklkJ2GrJ8Ecrfd3oHDTKZZ0X1UVsJ9yohnL-zSKcm-ea7fNdYvh3cM6OLtStIOOorhbBA2gvT7Rl2TWxx2VlinxC0JXmCjMfbPogkombYth8FmmqNVJK0m6ktdu5GZEwq8HudYf0mEHrY5fGnFZGYrfBXxCkCZzmsUFqro0UzEVdOwid4NbA4XATmnhSoaN4Ae_g"
//Headover to Spotify Console and get yourself an access token

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
let modal = document.querySelector("#modal")
let modal_title = document.querySelector("#modal-title")
let modal_body = document.querySelector("#modal-body")
let close_modal = document.querySelector("#close-modal")
let share_score = document.querySelector("#share-score")

function endGame(score, pop1, pop2) {
    modal.classList.remove("hidden")
    modal_title.innerHTML = "Game Over! Well tried..."
    modal_body.innerHTML = `You scored ${score} points! <br> The first album had a popularity of ${pop1} and the second album had a popularity of ${pop2}.`
    share_score.classList.remove('hidden')
    share_score.href = `https://twitter.com/intent/tweet?text=I%20scored%20${score}%20points%20on%20the%20Spotify%20Higher%20Or%20Lower!%20Can%20you%20beat%20me?%20Checkout%20https://harrydadev.me/spotify-higher-or-lower/%20to%20try%20for%20yourself!`
}

close_modal.addEventListener("click", () => {
    modal.classList.add("hidden")
    share_score.classList.add('hidden')
})

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

    lower_btn.addEventListener("click", async () => {
        if (random_album.popularity == random_album2.popularity) {
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
        }
    })

    higher_btn.addEventListener("click", async () => {
        if (random_album.popularity == random_album2.popularity) {
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
        }
    })
})

let how_to_play = document.getElementById("how-to-play")

how_to_play.addEventListener("click", () => {
    modal.classList.remove("hidden")
    modal_body.innerHTML = "Guess which album has more streams on Spotify by clicking the higher of lower button on the centre of the page. If you are correct, you get a point. If you are incorrect, the game ends. How high can you go? Good luck!"
})

close_modal.addEventListener("click", () => {
    if (modal_body.innerHTML == "Guess which album has more streams on Spotify by clicking the higher of lower button on the centre of the page. If you are correct, you get a point. If you are incorrect, the game ends. How high can you go? Good luck!") {
        modal.classList.add("hidden")
        modal_body.innerHTML = ""
    }
    else {
        modal.classList.add("hidden")
        modal_body.innerHTML = ""
        location.reload()
    }
})

