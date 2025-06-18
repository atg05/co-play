import MiniPlayer from "@/components/player";
import Head from "next/head";
import { useEffect, useState } from "react";
import { addSong, getAllSongs, updateActiveSong } from "./api/firebaseSdk";
import { getDatabase, ref, get, child } from "firebase/database";
import { Button } from "react-bootstrap";

export default function Home() {
  const [activeSongUrl, setActiveSongUrl] = useState(null);
  const [activeSong, SetActiveSong] = useState({});
  const [newSong, setNewSong] = useState({});
  const [songsList, setSongsLists] = useState([]);

  const handleEmbedUrl = (e) => {
    let newSongs = {};
    const value = e.target.value;

    const startIndex = value.indexOf("/embed/") + 7;
    const endIndex = value.indexOf('"', startIndex);
    const videoUrl = value.substring(startIndex, endIndex);
    const titleIndex = value.indexOf(`title="`) + 7;
    const titleEndIndex = value.indexOf('"', titleIndex);
    const videoTitle = value.substring(titleIndex, titleEndIndex);

    const isDuplicate = songsList.some((song) => song.url === videoUrl);
    if (isDuplicate) {
      alert("This song is already in the playlist 💕");
      return;
    }

    newSongs["title"] = videoTitle
      ?.replace("&quot;", "")
      .replace("&#39;", "")
      .replace("&amp", "");
    newSongs["url"] = videoUrl;

    if (!newSongs.title || !newSongs.url) {
      alert("Oops! This embed code doesn't look right 💔");
      return;
    }

    setNewSong(newSongs);
  };

  const dbRef = ref(getDatabase());

  useEffect(() => {
    const intervalId = setInterval(() => {
      get(child(dbRef, `active`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const song = snapshot.val();
            if (activeSongUrl !== song.url) setActiveSongUrl(song.url);
          } else {
            alert("No Data is Available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getAllSongs().then((result) => {
      setSongsLists(result);
    });
  }, [newSong]);

  return (
    <>
      <Head>
        <title>Avinash ❤️ Yashi Co Player</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(to right, #ffe4e1, #fff0f5)",
          minHeight: "100vh",
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
        }}
      >
        <p
          style={{
            fontSize: "2.2rem",
            color: "#d63384",
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          💖 Avinash & Yashi’s Co-Player 💖
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
            width: "100%",
            maxWidth: "1000px",
            flexWrap: "wrap",
          }}
        >
          {/* Left Song List */}
          <div
            style={{
              flex: 1,
              minWidth: "280px",
              maxHeight: "60vh",
              overflowY: "auto",
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(255, 192, 203, 0.3)",
            }}
          >
            {songsList.map((song) => (
              <p
                key={song.url}
                onClick={() => {
                  updateActiveSong(song);
                  SetActiveSong(song);
                  setActiveSongUrl(song.url);
                }}
                style={{
                  cursor: "pointer",
                  padding: "0.75rem",
                  margin: "0.25rem 0",
                  borderRadius: "8px",
                  backgroundColor: "#ffe6eb",
                  transition: "all 0.3s ease",
                  fontSize: "1rem",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#ffd6de")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#ffe6eb")}
              >
                🎵 {song.title}
              </p>
            ))}
          </div>

          {/* Right: Player & Input */}
          <div
            style={{
              flex: 1,
              minWidth: "280px",
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(255, 182, 193, 0.3)",
            }}
          >
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "1rem",
                color: "#e75480",
              }}
            >
              💞 Now Playing: {activeSong.title || "No song yet!"}
            </p>

            <MiniPlayer url={activeSongUrl} />

            <textarea
              style={{
                width: "100%",
                height: "120px",
                marginTop: "2em",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                padding: "1rem",
                fontSize: "1rem",
                border: "1px solid #ffb6c1",
                borderRadius: "8px",
                resize: "none",
                background: "#fff0f5",
              }}
              placeholder="Paste YouTube embed code here 💌"
              onChange={handleEmbedUrl}
            />

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <Button
                variant="danger"
                style={{
                  backgroundColor: "#ff69b4",
                  border: "none",
                  padding: "0.6rem 1.2rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
                onClick={() => {
                  addSong(newSong);
                  setNewSong({});
                }}
              >
                💝 Add Song
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
