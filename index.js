console.log("Let's write JavaScript");

let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs")[1]);
        }
    }
    return songs;
}

const playMusic = (track) => {
    // let audio = new Audio("/songs/" + encodeURIComponent(track));
    currentSong.src = "/songs/" + track
    currentSong.play();
    play.src= "img/pause.svg";
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

async function main() {
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let decodedSongName = decodeURIComponent(song.replaceAll("%20", " ").replace(/\//g, ""));
        songUL.innerHTML = songUL.innerHTML + `<li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${decodedSongName}</div>
                <div>harry</div>
            </div>
            <div class="playnow">
                <span>play now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        // let playIcon = e.querySelector(".playnow img");
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);

            // if (currentSong.paused) {
            //     currentSong.play();
            //     playIcon.src = "img/pause(1).svg";
            // } else {
            //     currentSong.pause();
            //     playIcon.src = "img/play.svg";
            // }
        });
    });
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/play (1).svg"
        }
    })


    
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    

}

main();
