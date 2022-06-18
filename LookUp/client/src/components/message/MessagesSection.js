import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { addMessage, deleteConversation, getMessages, loadMoreMessages } from "../../redux/actions/messageAction";
import { createNotify, isReadNotify } from "../../redux/actions/notifyAction";
import { socket } from "../../redux/socket";
import { GLOBALTYPES } from "../../redux/types/globalTypes";
import SocketClient from "../../socket/SocketClient";
import ScreenSize from "../ScreenSize";
import ItemCard from "../user/ItemCard";
import UserCard from "../user/UserCard";
import MsgDisplay from "./MsgDisplay";

const MessagesSection = () => {
  const { auth, messageRed, notify, alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [text, setText] = useState("");
  const [itemID, setItemID] = useState("");
  const [itemDetail, setItemDetail] = useState({});

  const refDisplay = useRef();
  const pageEnd = useRef();

  const [data, setData] = useState([]);
  const [result, setResult] = useState(25);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Get latest messages
  useEffect(() => {
    const url = new URLSearchParams(history.location.search);
    setItemID(url.get("itemId"));
    const urlItemId = url.get("itemId");

    const getMessagesData = async () => {
      if (messageRed.data.every((item) => item.listing && item.listing._id !== urlItemId)) {
        dispatch(getMessages({ auth, id, itemID: urlItemId, listing: messageRed.listing ? messageRed.listing : null }));
        setTimeout(() => {
          refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 50);
      }
    };
    getMessagesData();
  }, [messageRed.listing, data, id, history.location.search]);

  // Get latest message after socket response
  useEffect(() => {
    const url = new URLSearchParams(history.location.search);
    setItemID(url.get("itemId"));
    const urlItemId = url.get("itemId");

    const newData = messageRed.data.find((item) => item.listing && item.listing._id === urlItemId);
    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
      setItemDetail(newData.listing);
    }

    notify.data.filter((item) => {
      if (item.type === "message" && item.recipients === auth.user._id && item.isRead === false) {
        dispatch(isReadNotify({ msg: item, auth }));
      }
    });
  }, [messageRed.data.listing, messageRed.data, messageRed.location, id, data, history.location.search]);

  // Get user
  useEffect(() => {
    if (id && messageRed.users.length > 0) {
      setTimeout(() => {
        refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 50);

      const url = new URLSearchParams(history.location.search);
      const urlItemId = url.get("itemId");
      const newUser = messageRed.users.find((user) => user._id === id && user.listing && user.listing._id === urlItemId);

      if (newUser) {
        setUser(newUser);
      }

      if (id && !newUser) {
        history.push("/message");
      }
    }
  }, [messageRed.users, history.location.search, id]);

  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadMore((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setIsLoadMore]);

  // Load more messages
  useEffect(() => {
    const url = new URLSearchParams(history.location.search);
    const urlItemId = url.get("itemId");

    if (isLoadMore > 1) {
      if (result >= page * 25) {
        dispatch(loadMoreMessages({ auth, id, itemID: urlItemId, listing: messageRed.listing ? messageRed.listing : null, page: page + 1 }));
        setIsLoadMore(1);
      }
    }
  }, [isLoadMore]);

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    const msg = {
      sender: auth.user._id,
      recipient: id,
      listing: user.listing,
      text,
      createdAt: new Date().toISOString(),
    };

    console.log(msg.listing)

    setData([...data, msg]);
    dispatch(addMessage({ msg, auth, socket }));
    setText("");
  };

  const handleDeleteConversation = (e) => {
    const url = new URLSearchParams(history.location.search);
    const itemID = url.get("itemId");

    dispatch(deleteConversation({ auth, id, itemID }));
    handleClose();
  };

  return (
    <>
      <ScreenSize />
      <div className="message_header">
        <span className="material-icons-outlined back-action" onClick={() => history.push("/message")}>
          keyboard_backspace
        </span>
        <div className="message_header_cards">
          {user.listing ? (
            <div className="show_hide_mobile_item_card">
              <ItemCard user={user} item={user.listing} />
            </div>
          ) : (
            <></>
          )}
          <UserCard user={user} />
        </div>
        <div className="edit-item-btn edit-message-section">
          <ul className="navbar-nav flex-row disable-select">
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span className="material-icons-outlined nav-item dropdown item-dropdown-options">more_vert</span>
              </span>

              <div className="dropdown-menu item-dropdown-menu" aria-labelledby="navbarDropdown">
                <div className="dropdown-menu-item" onClick={handleShow}>
                  <span className="material-icons-outlined nav-item dropdown">delete</span>Delete conversation
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="chat_container">
        <div className="chat_display" ref={refDisplay}>
          <button style={{ marginTop: "-25px", opacity: 0 }} ref={pageEnd}>
            Load more
          </button>
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
          <div className="sold-listing-message">{itemDetail.isSold ? <span>This item is sold.</span> : ""}</div>
        </div>
        
      </div>

      <form className="chat_input" onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter your message..." value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" disabled={text ? false : true} className={`material-icons ${text ? "active-chat-btn" : ""}`}>
          near_me
        </button>
      </form>

      <Modal show={show} onHide={handleClose} className="confirmation-delete-dialog">
        <Modal.Header closeButton>
          <Modal.Title>Delete Conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this conversation?</Modal.Body>
        <Modal.Footer>
          <button className="close-btn" onClick={handleClose}>
            Close
          </button>
          <button className="delete-btn" onClick={handleDeleteConversation}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MessagesSection;
