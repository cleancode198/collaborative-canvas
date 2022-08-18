import React, { useEffect, useState, useRef } from "react";
import { Message, MessageRoom, User } from "../../helpers/types";
import MessageComponent from "../Chat/Message";
import socket from "./../../socket";

interface ChatRoomsProps {
  user: User,
  roomId: string
}

const ChatRooms: React.FC<ChatRoomsProps> = ({ user, roomId }) => {

  const [messages, setMessages] = useState<MessageRoom[]>([]);
  const [toSend, setToSend] = useState<string>("");
  const [fetchAmount, setFetchAmount] = useState<number>(10);

  const bottomRef = useRef<any>(null);

  const sendMessage = () => {
    if(toSend.length!==0) {
      const d = new Date();
      const minutes = d.getMinutes()<10 ? `0${d.getMinutes()}`:d.getMinutes();
      const date = `${d.getHours()}:${minutes}`;
      const _message: MessageRoom = {
        roomId: roomId,
        message: {
          sender: user.username,
          message: toSend,
          date: date
        },
      };
      socket.emit("messages-room", _message);
      console.log("sent: ", _message);
    }
  };

  useEffect(() => {
    console.log("room id length: ", roomId.length);
    socket.on("messages-room", (data) => {
      console.log(data!=messages[messages.length-1]);
      console.log("data: ", data);
      console.log("messages ", messages);
      if(data!=messages[messages.length-1]) {
        setMessages(prev => [...prev, data]);
        console.log("added");
        setToSend("");
      }
    });
  }, []);

  return(
    <div className="chat-div" style={{ height: window.innerHeight*0.85 }}>
      <div style={{ paddingTop: "1rem", paddingBottom: "1rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
        <p>{roomId.length>14? "Private":"Public"} Chat:</p>
        {messages.map((message: MessageRoom, index: number) => {
          {/**fix later */}
          if(message!==messages[index-1]) {
            return(
              <MessageComponent
                key={index}
                message={message.message}
                nickname={user.username}
              />
            );
          }
        })}
        
        {/*        <div ref={bottomRef} />
*/}
        <div className="chat-input-box">
          <input className="input" placeholder="Type something . . ." value={toSend} onChange={e => setToSend(e.target.value)} />
          <button className="button-19" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRooms;