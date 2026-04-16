import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

function VideoCall() {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [idToCall, setIdToCall] = useState("");
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const [showVideoPanel, setShowVideoPanel] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
    });

    socket.on("chat", (msg) => {
      setChat(prev => [...prev, msg]);
    });
  }, []);

  const callUser = () => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: idToCall,
        signalData: data,
        from: me
      });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
    setShowVideoPanel(true);
  };

  const answerCall = () => {
    setCallAccepted(true);
    setReceivingCall(false);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
    setShowVideoPanel(true);
  };

  const leaveCall = () => {
    if (connectionRef.current) connectionRef.current.destroy();
    window.location.reload();
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = muted;
      setMuted(!muted);
    }
  };

  const toggleCamera = async () => {
    if (!cameraOn) {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = videoStream.getVideoTracks()[0];
      stream.addTrack(videoTrack);
      setStream(stream);
      if (myVideo.current) myVideo.current.srcObject = stream;
      if (connectionRef.current) {
        connectionRef.current._pc.addTrack(videoTrack, stream);
      }
    } else {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
        stream.removeTrack(videoTrack);
        if (myVideo.current) myVideo.current.srcObject = stream;
        if (connectionRef.current) {
          const sender = connectionRef.current._pc.getSenders().find(s => s.track === videoTrack);
          if (sender) connectionRef.current._pc.removeTrack(sender);
        }
      }
    }
    setCameraOn(!cameraOn);
  };

  const shareScreen = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
    if (myVideo.current) myVideo.current.srcObject = screen;
  };

  const sendMessage = () => {
    socket.emit("chat", message);
    setChat(prev => [...prev, "Me: " + message]);
    setMessage("");
  };

  return (
    <>
      {/* Floating toolbar with responsive SVG icons */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999
      }}>
        {/* Camera toggle */}
        <div
          onClick={() => setShowVideoPanel(!showVideoPanel)}
          style={{
            background: "#111",
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "40px",
            height: "40px"
          }}
        >
          {showVideoPanel ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M23 7l-7 5v-3H8v6h8v-3l7 5V7zM0 4h16v16H0V4z" />
            </svg>
          )}
        </div>

        {/* Chat toggle */}
        <div
          onClick={() => setShowChatPanel(!showChatPanel)}
          style={{
            background: "#111",
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "40px",
            height: "40px"
          }}
        >
          {showChatPanel ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M4 4h16v12H5.17L4 17V4z" />
            </svg>
          )}
        </div>
      </div>

      {/* Video Panel */}
      {showVideoPanel && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          width: "300px",
          height: "200px",
          background: "#111",
          borderRadius: "10px",
          padding: "4px",
          zIndex: 9998,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 15px rgba(0,0,0,0.5)"
        }}>
          <video ref={myVideo} autoPlay muted style={{ width: "100%", height: "60%", borderRadius: "6px" }} />
          {callAccepted && <video ref={userVideo} autoPlay style={{ width: "100%", height: "40%", borderRadius: "6px", marginTop: "4px" }} />}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <input placeholder="ID to call" onChange={(e) => setIdToCall(e.target.value)} style={{ flex: 1, fontSize: "12px" }} />
            <button onClick={callUser} style={{ fontSize: "12px", marginLeft: "4px" }}>Call</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <button onClick={leaveCall} style={{ fontSize: "12px" }}>End</button>
            <button onClick={toggleMute} style={{ fontSize: "12px" }}>{muted ? "Unmute" : "Mute"}</button>
            <button onClick={toggleCamera} style={{ fontSize: "12px" }}>{cameraOn ? "Cam Off" : "Cam On"}</button>
            <button onClick={shareScreen} style={{ fontSize: "12px" }}>Share</button>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChatPanel && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          left: "20px",
          width: "250px",
          height: "300px",
          background: "#222",
          borderRadius: "10px",
          padding: "4px",
          overflowY: "auto",
          zIndex: 9998,
          boxShadow: "0 0 15px rgba(0,0,0,0.5)"
        }}>
          <div style={{ maxHeight: "220px", overflowY: "auto" }}>
            {chat.map((c, i) => <p key={i} style={{ margin: "2px 0", fontSize: "12px" }}>{c}</p>)}
          </div>
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" style={{ width: "100%", fontSize: "12px", marginTop: "4px" }} />
          <button onClick={sendMessage} style={{ width: "100%", fontSize: "12px", marginTop: "2px" }}>Send</button>
        </div>
      )}
    </>
  );
}

export default VideoCall;