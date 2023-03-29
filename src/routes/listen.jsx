import React from "react";
import { Headphones } from "react-feather";

function Listen() {
    let baseUrl = "http://localhost:3000/audio";
    React.useEffect(()=>{
        let audioEl = document.getElementById("myplayer");
        audioEl.addEventListener("ended", ()=>{
            audioEl.src = baseUrl + "?a=" + new Date().getTime();
            audioEl.currentTime = 0;
            audioEl.load();
        });
    }, []);

    return (
        <div className="flex flex-col items-center h-full">
            <h1 className="text-5xl font-bold">Listening...</h1>
            <div className="rounded-full bg-gray-700 p-6 mt-5">
                <Headphones size={50} />
            </div>
            <audio id="myplayer" controls src={`http://localhost:3000/audio`} autoPlay/>
        </div>
    );
}

export default Listen;
