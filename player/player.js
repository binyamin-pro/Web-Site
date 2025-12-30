/* MP3 Player */
/* Made with tutorials and determination XD */

let currentlyPlayingAudio = null;
let gVolume = 0.4;

const playersData = {
    1: {
        defaultCover: "audio/default.png",
        tracks: [
            {
                title: "Права",
                author: "Ooes",
                src: "audio/Ooes - Права.mp3",
                cover: "audio/ooes.jpg"
            },
            {
                title: "Контракт",
                author: "Пошлая Молли",
                src: "audio/Пошлая Молли - Контракт.mp3",
                cover: "audio/default.png"
            }
        ]
    },
    2: {
        defaultCover: "audio/default2.png",
        tracks: [
            {
                title: "EZ4ENCE",
                author: "The Verkkars",
                src: "audio/The Verkkars - EZ4ENCE.mp3",
                cover: "audio/ez4ence.jpg"
            }
        ]
    }
};

/* Global volume */
const volumeSlider = document.getElementById("global-volume");
if (volumeSlider) {
    volumeSlider.value = gVolume * 100;

    volumeSlider.oninput = () => {
        gVolume = volumeSlider.value / 100;
        document.querySelectorAll("audio").forEach(a => a.volume = gVolume);

        volumeSlider.style.background = `
            linear-gradient(
                to right,
                #fff ${volumeSlider.value}%,
                #222 ${volumeSlider.value}%
            )
        `;
    };
}

/* Players */
document.querySelectorAll(".audio-player").forEach(player => {
    const playerId = player.dataset.player;
    const playerData = playersData[playerId];
    if (!playerData) return;

    const tracks = playerData.tracks;
    const defaultCover = playerData.defaultCover;

    const template = document.getElementById("player-template");
    player.append(template.content.cloneNode(true));

    // Elements
    const audio = player.querySelector("audio");
    const playBtn = player.querySelector(".play");
    const prevBtn = player.querySelector(".prev");
    const nextBtn = player.querySelector(".next");
    const playlistEl = player.querySelector(".playlist");
    const titleEl = player.querySelector(".track-title");
    const authorEl = player.querySelector(".author-title");
    const coverImg = player.querySelector(".cover-img");

    const progress = player.querySelector(".progress");
    const currentTimeEl = player.querySelector(".current-time");
    const durationEl = player.querySelector(".duration");

    let currentTrack = null;
    audio._isPlaying = false;

    coverImg.src = defaultCover;

    tracks.forEach((track, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${track.title}<span>${track.author}</span>`;
        li.onclick = () => onTrackClick(index);
        playlistEl.appendChild(li);
    });

    function formatTime(sec) {
        if (isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function stopOtherPlayers() {
        if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
            currentlyPlayingAudio.pause();
            currentlyPlayingAudio._isPlaying = false;

            const otherPlayer = currentlyPlayingAudio.closest(".audio-player");
            if (otherPlayer) {
                const btn = otherPlayer.querySelector(".play");
                if (btn) btn.textContent = "▶";
                const mainCover = otherPlayer.querySelector(".cover-img");
                if (mainCover) mainCover.src = playersData[otherPlayer.dataset.player].defaultCover;
            }
        }
        currentlyPlayingAudio = audio;
    }

    function onTrackClick(index) {
        if (currentTrack === index) {
            if (audio._isPlaying) {
                audio.pause();
                audio._isPlaying = false;
                playBtn.textContent = "▶";
                coverImg.src = defaultCover;
            } else {
                stopOtherPlayers();
                audio.play();
                audio._isPlaying = true;
                playBtn.textContent = "⏸";
                coverImg.src = tracks[index].cover;
            }
            return;
        }
        load(index, true);
    }

    function load(index, autoplay = false) {
        currentTrack = index;
        const track = tracks[index];

        audio.src = track.src;
        audio.load();
        audio.currentTime = 0;
        audio.volume = gVolume;

        titleEl.textContent = track.title;
        authorEl.textContent = track.author;

        coverImg.src = track.cover;

        [...playlistEl.children].forEach((li, i) => {
            li.classList.remove("active");
            if (i === index) li.classList.add("active");
        });

        progress.value = 0;
        currentTimeEl.textContent = "0:00";
        durationEl.textContent = "0:00";

        if (autoplay) {
            stopOtherPlayers();
            audio.play();
            audio._isPlaying = true;
            playBtn.textContent = "⏸";
        }
    }

    /* play pause */
    playBtn.onclick = () => {
        if (currentTrack === null) {
            load(0, true);
            return;
        }

        if (audio._isPlaying) {
            audio.pause();
            audio._isPlaying = false;
            playBtn.textContent = "▶";
            coverImg.src = defaultCover;
        } else {
            stopOtherPlayers();
            audio.play();
            audio._isPlaying = true;
            playBtn.textContent = "⏸";
            coverImg.src = tracks[currentTrack].cover;
        }

        audio.volume = gVolume;
    };

    /* prev  next */
    prevBtn.onclick = () => {
        if (currentTrack === null) return;
        load((currentTrack - 1 + tracks.length) % tracks.length, true);
    };

    nextBtn.onclick = () => {
        if (currentTrack === null) return;
        load((currentTrack + 1) % tracks.length, true);
    };

    audio.onloadedmetadata = () => {
        durationEl.textContent = formatTime(audio.duration);
    };

    audio.ontimeupdate = () => {
        if (!audio.duration) return;

        const percent = (audio.currentTime / audio.duration) * 100;
        progress.value = percent;
        currentTimeEl.textContent = formatTime(audio.currentTime);

        progress.style.background = `
            linear-gradient(
                to right,
                #c4c4c4 0%,
                #c4c4c4 ${percent}%,
                #222 ${percent}%,
                #222 100%
            )
        `;
    };

    progress.oninput = () => {
        if (!audio.duration) return;
        audio.currentTime = (progress.value / 100) * audio.duration;
    };

    audio.onended = () => {
        load((currentTrack + 1) % tracks.length, true);
    };
});