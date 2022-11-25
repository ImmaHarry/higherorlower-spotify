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
let song_1 = document.querySelector("#song-1")
let song_2 = document.querySelector("#song-2")

let spotify_token = "BQAJEhmWmsEFYeQZdpvqtkW0A6Rv6nojwjnix_WNJ2ghUpnMXH9sgsNfRDAOtQIwc8e_QK5xhLxlxIsVEGCE-WTlX4yiSHmqo-V-j0Ap_2zB-kSRSIkQJ_r5HqjlCc6YzoVfJSfDFXkIuKHemfY-zQukmTGvMhveY5Bffvt8ISwD7knQ2j_dIy0qN34Fj1jbS6QGsWs"
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
        "artist_name": data2.artists[0].name,
        "preview_url": data2.tracks.items[0].preview_url
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
let twitter_share = document.querySelector("#twitter-share")
let song_preview_btn_one = document.querySelector("#song-preview-1")
let song_preview_btn_two = document.querySelector("#song-preview-2")
let popularity_label = document.querySelector("#popularity-text")

function endGame(score, pop1, pop2) {
    modal.classList.remove("hidden")
    modal_title.innerHTML = "Game Over! Well tried..."
    modal_body.innerHTML = `You scored ${score} points! <br> The first album had a popularity of ${pop1} and the second album had a popularity of ${pop2}. You can try again by clicking the button below.`
    share_score.classList.remove('hidden')
    twitter_share.href = `https://twitter.com/intent/tweet?text=I%20just%20played%20the%20Higher%20or%20Lower%20Game%20(Spotify%20Edition)%20%26%20scored%20${score}%21%20Try%20it%20out%20yourself%20at%20https://spotify/harrydadev.me.`
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
    song_1.src = random_album.preview_url
    song_preview_btn_one.classList.remove("hidden")

    let random_album2 = await getRandomAlbum()
    album_name_two.innerHTML = random_album2.name
    album_release_two.innerHTML = random_album2.release_year
    album_thumbnail_two.src = random_album2.thumbnail
    artist_name_two.innerHTML = random_album2.artist_name
    song_2.src = random_album2.preview_url
    album_second_streams.innerHTML = "???"
    song_preview_btn_two.classList.remove("hidden")

    document.querySelector("#left-side-content").classList.remove("hidden")
    document.querySelector("#right-side-content").classList.remove("hidden")

    popularity_label.innerHTML = "Does the second album have a higher or lower popularity than the first album?"
    start_container.classList.add("hidden")
    guess_controls.classList.add("flex")
    guess_controls.classList.remove("hidden")

    higher_btn.addEventListener("click", async () => {
        if (random_album.popularity < random_album2.popularity) {
            higher_btn.disabled = true
            score++
            score_counter.innerHTML = score
            random_album = random_album2
            album_name_one.innerHTML = random_album.name
            album_release_one.innerHTML = random_album.release_year
            artist_name_one.innerHTML = random_album.artist_name
            album_first_streams.innerHTML = random_album.popularity
            song_1.src = random_album.preview_url
            album_thumbnail_one.src = "https://i.imgur.com/jsRzKRk.png"
            album_thumbnail_one.src = random_album.thumbnail
            random_album2 = await getRandomAlbum()
            album_thumbnail_two.src = "https://i.imgur.com/jsRzKRk.png"
            album_name_two.innerHTML = random_album2.name
            album_release_two.innerHTML = random_album2.release_year
            album_thumbnail_two.src = random_album2.thumbnail
            artist_name_two.innerHTML = random_album2.artist_name
            album_second_streams.innerHTML = "???"
            song_2.src = random_album2.preview_url
            higher_btn.disabled = false
        } else {
            endGame(score, random_album.popularity, random_album2.popularity)
        }
    })
    lower_btn.addEventListener("click", async () => {
        if (random_album.popularity > random_album2.popularity) {
            lower_btn.disabled = true
            score++
            score_counter.innerHTML = score
            random_album = random_album2
            album_thumbnail_one.src = "https://i.imgur.com/jsRzKRk.png"
            album_name_one.innerHTML = random_album.name
            album_release_one.innerHTML = random_album.release_year
            album_thumbnail_one.src = random_album.thumbnail
            artist_name_one.innerHTML = random_album.artist_name
            album_first_streams.innerHTML = random_album.popularity
            song_1.src = random_album.preview_url
            random_album2 = await getRandomAlbum()
            album_thumbnail_two.src = "https://i.imgur.com/jsRzKRk.png"
            album_name_two.innerHTML = random_album2.name
            album_release_two.innerHTML = random_album2.release_year
            album_thumbnail_two.src = random_album2.thumbnail
            artist_name_two.innerHTML = random_album2.artist_name
            album_second_streams.innerHTML = "???"
            song_2.src = random_album2.preview_url
            lower_btn.disabled = false
        } else {
            endGame(score, random_album.popularity, random_album2.popularity)
        }
    })

    lower_btn.addEventListener("click", async () => {
        if (random_album.popularity == random_album2.popularity) {
            lower_btn.disabled = true
            score++
            score_counter.innerHTML = score
            random_album = random_album2
            album_thumbnail_one.src = "https://i.imgur.com/jsRzKRk.png"
            album_name_one.innerHTML = random_album.name
            album_release_one.innerHTML = random_album.release_year
            album_thumbnail_one.src = random_album.thumbnail
            artist_name_one.innerHTML = random_album.artist_name
            album_first_streams.innerHTML = random_album.popularity
            song_1.src = random_album.preview_url
            random_album2 = await getRandomAlbum()
            album_thumbnail_two.src = "https://i.imgur.com/jsRzKRk.png"
            album_name_two.innerHTML = random_album2.name
            album_release_two.innerHTML = random_album2.release_year
            album_thumbnail_two.src = random_album2.thumbnail
            artist_name_two.innerHTML = random_album2.artist_name
            album_second_streams.innerHTML = "???"
            song_2.src = random_album2.preview_url
            lower_btn.disabled = false
        }
    })

    higher_btn.addEventListener("click", async () => {
        if (random_album.popularity == random_album2.popularity) {
            higher_btn.disabled = true
            score++
            score_counter.innerHTML = score
            random_album = random_album2
            album_thumbnail_one.src = "https://i.imgur.com/jsRzKRk.png"
            album_name_one.innerHTML = random_album.name
            album_release_one.innerHTML = random_album.release_year
            album_thumbnail_one.src = random_album.thumbnail
            artist_name_one.innerHTML = random_album.artist_name
            album_first_streams.innerHTML = random_album.popularity
            song_preview_btn_one.classList.remove("hidden")
            song_1.src = random_album.preview_url
            random_album2 = await getRandomAlbum()
            album_thumbnail_two.src = "https://i.imgur.com/jsRzKRk.png"
            album_name_two.innerHTML = random_album2.name
            album_release_two.innerHTML = random_album2.release_year
            album_thumbnail_two.src = random_album2.thumbnail
            artist_name_two.innerHTML = random_album2.artist_name
            song_2.src = random_album2.preview_url
            song_preview_btn_two.classList.remove("hidden")
            album_second_streams.innerHTML = "???"
            higher_btn.disabled = false
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

song_preview_btn_one.addEventListener("click", () => {
    if (document.querySelector(".play-btn-1").classList.contains("fa-play")) {
        document.querySelector(".play-btn-1").classList.remove("fa-play")
        document.querySelector(".play-btn-1").classList.add("fa-pause")
        song_1.play()
        song_1.volume = 0.6
    }
    else {
        document.querySelector(".play-btn-1").classList.remove("fa-pause")
        document.querySelector(".play-btn-1").classList.add("fa-play")
        song_1.pause()
        song_1.volume = 0.6
    }
})

song_preview_btn_two.addEventListener("click", () => {
    if (document.querySelector(".play-btn-2").classList.contains("fa-play")) {
        document.querySelector(".play-btn-2").classList.remove("fa-play")
        document.querySelector(".play-btn-2").classList.add("fa-pause")
        song_2.play()
        //Reducing the volume of the song
        song_2.volume = 0.6
    }
    else {
        document.querySelector(".play-btn-2").classList.remove("fa-pause")
        document.querySelector(".play-btn-2").classList.add("fa-play")
        song_2.pause()
        song_2.volume = 0.6
    }
})
