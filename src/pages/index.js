import MiniPlayer from "@/components/player";
import styles from "@/styles/Home.module.css";
import Alert from "react-bootstrap/Alert";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";
import { addSong, getAllSongs, updateActiveSong } from "./api/firebaseSdk";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import { Button } from "react-bootstrap";

export default function Home() {
  const [activeSongUrl, setActiveSongUrl] = useState(null);
  const [activeSong, SetActiveSong] = useState({});
  const [newSong, setNewSong] = useState({});
  const [songsList, setSongsLists] = useState([]);

  const handleEmbedUrl = (e) => {
    // console.log(e.target.value);
    let newSongs = {};
    const value = e.target.value;

    const startIndex = value.indexOf("/embed/") + 7; // add 7 to get to the end of "/embed/"
    const endIndex = value.indexOf('"', startIndex);
    const videoUrl = value.substring(startIndex, endIndex);
    const titleIndex = value.indexOf(`title="`) + 7; // add 7 to get to the end of "/embed/"
    const titleEndIndex = value.indexOf('"', titleIndex);
    const videoTitle = value.substring(titleIndex, titleEndIndex);
    console.log(videoTitle, videoUrl);

    songsList.forEach((song) => {
      if (song.url === videoUrl) {
        alert("Inside duplicate");
        <Alert key={videoUrl} variant={"danger"}>
          Duplicate Song!
        </Alert>;
        return;
      }
    });
    newSongs["title"] = videoTitle?.replace("&quot;", "");
    newSongs["title"] = videoTitle?.replace("&#39;", "");
    newSongs["title"] = videoTitle?.replace("&amp", "");
    newSongs["url"] = videoUrl;

    if (!newSongs.title || !newSongs.url) {
      alert("Invalid url");
      return;
    }

    // if (true) setSongsLists((list) => [...list, newSongs]);
    if (true) setNewSong(newSongs);
    else {
      alert("Not Vallid");
    }
  };

  const dbRef = ref(getDatabase());

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Inside Interval");
      get(child(dbRef, `active`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const song = snapshot.val();
            if (activeSongUrl !== song.url) setActiveSongUrl(song.url);
          } else {
            alert("No Data is Available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, 5000); // 20 seconds in milliseconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    console.log(activeSongUrl);
  }, [activeSongUrl]);

  useEffect(() => {
    const songs = getAllSongs();
    songs.then((result) => {
      setSongsLists(result);
    });
    // setSongsLists(songs);
  }, [newSong]);

  return (
    <>
      <Head>
        <title>Co Player</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <p className={styles.heading}>Co Player</p>
        <div className={styles.player_body}>
          <div className={styles.left_container}>
            {songsList.map((song, index) => {
              return (
                <p
                  className={styles.each_song}
                  key={song.url}
                  onClick={() => {
                    updateActiveSong(song);
                    SetActiveSong(song);
                    setActiveSongUrl(song.url);
                  }}
                >
                  {song.title}
                </p>
              );
            })}
          </div>
          <div className={styles.right_container}>
            <p className={styles.activeSong}>{activeSong.title || ""}</p>
            <MiniPlayer url={activeSongUrl} />

            <textarea
              style={{
                width: "100%",
                height: "140px",
                marginTop: "2em",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
              className={styles.textArea}
              placeholder="Enter Complete Embed Code from youtube"
              onChange={handleEmbedUrl}
            />
            <div>
              <Button
                variant="primary"
                onClick={() => {
                  addSong(newSong);
                  setNewSong({});
                }}
              >
                Add Song
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
