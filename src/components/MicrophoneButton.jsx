
import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "react-feather";

export default function MicrophoneButton({ socket }) {
    const [recording, setRecording] = useState(false);

    let stream;
    let i;

    useEffect(()=>{
        let getMic = async () => {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        getMic();
    }, [])

    function recordAndSend(){
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = (e) => {chunks.push(e.data);console.log(e.data)}
        recorder.onstop = (e) => {
            let b = new Blob(chunks);
            console.log(b)
            socket.emit("stream", b);
        }
        setTimeout(()=> recorder.stop(), 10000);
        recorder.start();
    }

    const onClickMic = () => {
        if (!recording){
            i = setInterval(recordAndSend, 10000);
        }
        else{
            clearInterval(i);
        }
        setRecording(!recording);
    };

    const Icon = recording ? MicOff : Mic;

    const title = `${recording ? "Stop" : "Start"} recording`;

    return (
        <div className="flex flex-col items-center w-full">
            <button
                type="button"
                title={title}
                onClick={onClickMic}
                className="rounded-full p-5 bg-transparent border-2 border-blue-300 focus:border-red-600 hover:bg-gray-700"
            >
                <Icon size={64} className="color-white" />
            </button>
        </div>
    );
}
