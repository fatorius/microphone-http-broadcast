# microphone-http-broadcast

A fork from [WoolDoughnut310/radio-broadcast](https://github.com/WoolDoughnut310/radio-broadcast)

## What's different on this fork?

The original repo from [WoolDoughnut310](https://github.com/WoolDoughnut310) is based on its own library, [WoolDoughnut310/jnaudiostream](https://github.com/WoolDoughnut310/jnaudiostream) to record, stream and reproduce audio on the client side.

The downside of this approach is that the `MediaBuffer` class, used to convert and play the audio streamed from the server relies on `MediaSourceExtensions`, or `MSE`, using the `MediaSource()` class to convert the `AudioBuffer` and play it. Unfortunatelly, `MSE` **is not supported by iPhone on Safari or any other browser**, and is also not supported by older versions of iPad.

In this fork, I've taken a different approach to the stream, not using any libraries apart from `Socket.io` on the host route.

The raw microphone data is converted on the server-side using `ffmpeg` and it's statically-served as a 10-second-long mp3 file.

The listener route also doesn't use any libraries, but instead, it plays the static audio file from a `HTML <audio>` element repeatedly.

This approach makes the microphone broadcasting more stable and compatible to most devices on the web.

**This fork is mostly focused on microphone broadcasting**, so, all of the backend and frontend code related to stream already-generated music (previously on the `tracks` folder) were removed. 
