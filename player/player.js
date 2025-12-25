/* MP3 Player */
/* Made with tutorials and determination xd */

let currentlyPlayingAudio = null;

const playersData = {
    1: [
        {
            title: "Права",
            author: "Ooes",
            src: "audio/Ooes - Права.mp3",
            cover: "img/cover1.jpg"
        },
        {
            title: "Контракт",
            author: "Пошлая Молли",
            src: "audio/Пошлая Молли - Контракт.mp3",
            cover: "img/cover2.jpg"
        }
    ],
    2: [
        {
            title: "EZ4ENCE",
            author: "The Verkkars",
            src: "audio/The Verkkars - EZ4ENCE.mp3",
            cover: "img/cover3.jpg"
        }
    ]
};

document.querySelectorAll(".audio-player").forEach(player => {
    const playerId = player.dataset.player;
    const tracks = playersData[playerId];
    if (!tracks) return;

    /* template */
    const template = document.getElementById("player-template");
    player.append(template.content.cloneNode(true));

    /* elements */
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
    let isPlaying = false;

    tracks.forEach((track, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${track.title}<span>${track.author}</span>`;
        li.onclick = () => onTrackClick(index);
        playlistEl.appendChild(li);
    });

    /* time */
    function formatTime(sec) {
        if (isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function stopOtherPlayers() {
        if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
            currentlyPlayingAudio.pause();
            currentlyPlayingAudio.currentTime = 0;

            const other = currentlyPlayingAudio.closest(".audio-player");
            if (other) {
                const btn = other.querySelector(".play");
                if (btn) btn.textContent = "▶";
            }
        }
        currentlyPlayingAudio = audio;
    }

    function onTrackClick(index) {
        if (currentTrack === index) {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                playBtn.textContent = "▶";
            } else {
                stopOtherPlayers();
                audio.play();
                isPlaying = true;
                playBtn.textContent = "⏸";
            }
            return;
        }

        load(index, true);
    }

    /* loading */
    function load(index, autoplay = false) {
        currentTrack = index;
        const track = tracks[index];

        audio.src = track.src;
        audio.currentTime = 0;
        audio.load();

        titleEl.textContent = track.title;
        authorEl.textContent = track.author;
        coverImg.src = track.cover;

        [...playlistEl.children].forEach(li => li.classList.remove("active"));
        playlistEl.children[index].classList.add("active");

        progress.value = 0;
        currentTimeEl.textContent = "0:00";
        durationEl.textContent = "0:00";

        if (autoplay) {
            stopOtherPlayers();
            audio.play();
            isPlaying = true;
            playBtn.textContent = "⏸";
        }
    }

    /* play pause */
    playBtn.onclick = () => {
        if (currentTrack === null) {
            load(0, true);
            return;
        }

        if (isPlaying) {
            audio.pause();
            playBtn.textContent = "▶";
            isPlaying = false;
        } else {
            stopOtherPlayers();
            audio.play();
            playBtn.textContent = "⏸";
            isPlaying = true;
        }
    };

    /* prev next */
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
    /* Its 12 still i got it to work, goodnight xd */

    progress.oninput = () => {
        if (!audio.duration) return;
        audio.currentTime = (progress.value / 100) * audio.duration;
    };

    audio.onended = () => {
        load((currentTrack + 1) % tracks.length, true);
    };
});
