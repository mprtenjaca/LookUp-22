import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getConversations } from "../../redux/actions/messageAction";
import ItemCard from "../user/ItemCard";

const Conversations = () => {
  const dispatch = useDispatch();
  const { auth, alert, messageRed, notify } = useSelector((state) => state);

  const { id } = useParams();
  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (messageRed.firstLoad) {
      return;
    }
    
    dispatch(getConversations({ auth }));
  }, [dispatch, auth, messageRed.firstLoad]);

  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      });

    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if(messageRed.resultUsers >= (page - 1) * 9 && page > 1){
        dispatch(getConversations({auth, page}))
    }
  },[messageRed.resultUsers, page, auth, dispatch])

  return (
    <div className="conversations-list disable-select">
      <h3>Inbox</h3>
      {messageRed.users.map((user) => (
        <div key={user.listing._id} className="conversation-user-card">
          <ItemCard user={user} item={user.listing} showMsg={true} />
        </div>
      ))}
    
      <button ref={pageEnd} style={{opacity: 0}} >Load More</button>
    </div>
  );
};

export default Conversations;
