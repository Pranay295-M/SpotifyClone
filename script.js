console.log("lets start javascript");
let currentSong = new Audio();
let s;
let currFolder;

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60); // or Math.round(...) if needed

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  s = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      s.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }
  //show songs
  let songList = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songList.innerHTML = "";
  for (const song of s) {
    songList.innerHTML =
      songList.innerHTML +
      `
    <li>
                  <img class="invert" src="img/music.svg" alt="" />
                  
                  <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Pranay</div>
                  </div>
                  <div class="playnow">
                    <span>Play</span>
                    <img src="/img/play.svg" alt="" srcset="" style="margin-right:10px"/>
                  </div>

     </li>`;
  }
  //attach event listeners to each song item
  let one = document.querySelector(".songList").getElementsByTagName("li");
  Array.from(one).forEach((e) => {
    e.addEventListener("click", element => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);

      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return s
}

const playMusic = (track, pause = false) => {
  // let audio=new Audio("/songs/"+ track);
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();

    play.src = "/img/pause.svg";
  }
  document.querySelector(".songn").innerHTML = decodeURI(track);
  document.querySelector(".songt").innerHTML = "00:00 / 00:00";
};

async function getAlbum() {
  let a = await fetch(`/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-2)[0]
     

      //get the meta data of the folder
      const a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
                  <!-- Green circular background -->
                  <circle cx="60" cy="60" r="60" fill="#40eb29" />

                  <!-- Centered black play icon -->
                  <g transform="translate(34, 24) scale(0.6)">
                    <polygon
                      fill="#000000"
                      points="92.2,60.97 0,122.88 0,0 92.2,60.97"
                    />
                  </g>
                </svg>
              </div>
              <img
              src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>
             ${response.description}
              </p>
            </div>`;
    }
  }
  //load the folder whenever click on playlist

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      s = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(s[0])
    });
  });
  
  // console.log(anchors);
}

async function main() {
  await getSongs(`/songs/`);
  playMusic(s[0], true);

  //display all albums on the page

  getAlbum();

  //attach event listeners to play button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/img/play.svg";
    }
  });

  //time update function

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songt").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )}/${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
  });

  //add event listener to th seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = e.offsetX / e.target.getBoundingClientRect().width;
    document.querySelector(".circle").style.left = `${percent * 100}%`;
    currentSong.currentTime = currentSong.duration * percent;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".cancel").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  prev.addEventListener("click", () => {
    let index = s.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(s[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = s.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < s.length) {
      playMusic(s[index + 1]);
    }
  });

  //adding eventlistener to volume
  document
    .querySelector(".songv")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  
    // adding mute
    document.querySelector(".songv>img").addEventListener("click",e=>{
      console.log(e.target);
      if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume=0;
        document
    .querySelector(".songv")
    .getElementsByTagName("input")[0].value=0;

      }
      else{
          e.target.src=e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume=.20;
        document
    .querySelector(".songv")
    .getElementsByTagName("input")[0].value=20;
      }
      
    })

}

main();
