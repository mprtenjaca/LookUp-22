import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { io } from "socket.io-client";
import { addMessage, getMessages, MESS_TYPES } from "../../redux/actions/messageAction";
import { GLOBALTYPES } from "../../redux/types/globalTypes";
import SocketClient from "../../socket/SocketClient";
import ScreenSize from "../ScreenSize";
import UserCard from "../user/UserCard";
import MsgDisplay from "./MsgDisplay";

const MessagesSection = () => {
  const { auth, messageRed } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory()

  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [text, setText] = useState("");
  const [loadMedia, setLoadMedia] = useState(false);

  const socket = useRef(io());
  const refDisplay = useRef();
  const pageEnd = useRef();

  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  useEffect(() => {
    socket.current.emit("joinUser", auth.user._id);
    socket.current.close()
  }, [user]);

  useEffect(() => {
    const getMessagesData = async () => {
      if (messageRed.data.every((item) => item._id !== id)) {
        dispatch(getMessages({ auth, id }))
        setTimeout(() => {
          refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 50);
      }
    };
    getMessagesData();
  }, [messageRed.data, data, id]);

  useEffect(() => {

    const newData = messageRed.data.find((item) => item._id === id);
    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [messageRed.data, id, data]);

  useEffect(() => {
    if (id && messageRed.users.length > 0) {
      setTimeout(() => {
        refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 50);

      const newUser = messageRed.users.find((user) => user._id === id);
      if (newUser) {
        setUser(newUser);
      }
    }
  }, [messageRed.users, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      createdAt: new Date().toISOString(),
    };

    setData([...data, msg])

    dispatch(addMessage({ msg, auth }));
    socket.current.emit("addMessage", msg);
    setText("");
  };

  return (
    <>
    
      {auth.token && <SocketClient socket={socket.current}/>}
      <div className="message_header">
       <span className="material-icons-outlined back-action" onClick={() => history.goBack()}>keyboard_backspace</span><UserCard user={user} />
      </div>
      <div className="chat_container">
        <div className="chat_display" ref={refDisplay}>
          {data.map((msg, index) => (
            <div key={index}>
              {msg.sender !== auth.user._id && (
                <div className="chat_row other_message">
                  <MsgDisplay user={user} msg={msg} />
                </div>
              )}

              {msg.sender === auth.user._id && (
                <div className="chat_row my_message">
                  <MsgDisplay user={auth.user} msg={msg} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form className="chat_input" onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter your message..." value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" disabled={text ? false : true} className={`material-icons ${text ? "active-chat-btn" : ""}`}>
          near_me
        </button>
      </form>
    </>
  );
};

export default MessagesSection;
