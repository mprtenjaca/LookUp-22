import { MESS_TYPES } from "../actions/messageAction";
import { EditData, DeleteData, DeleteConversationUser, DeleteConversationData } from "../types/globalTypes";

const initialState = {
  users: [],
  resultUsers: 0,
  data: [],
  listing: {},
  firstLoad: false,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESS_TYPES.ADD_USER:
      if (state.users.every((item) => item.listing._id !== action.payload.listing._id)) {
        return {
          ...state,
          users: [action.payload, ...state.users],
          listing: action.payload.listing,
        };
      } else {
        return state;
      }
    case MESS_TYPES.ADD_MESSAGE:
      return {
        ...state,
        data: state.data.map((item) =>
          (item._id === action.payload.recipient || item._id === action.payload.sender) && item.listing._id === action.payload.listing._id
            ? {
                ...item,
                messages: [...item.messages, action.payload],
                result: item.result + 1,
                listing: action.payload.listing
              }
            : item
        ),
        listing: action.payload.listing,
        users: state.users.map((user) =>
          (user._id === action.payload.recipient || user._id === action.payload.sender) && (user.listing && user.listing._id === action.payload.listing._id)
            ? {
                ...user,
                text: action.payload.text,
              }
            : user
        ),
      };
    case MESS_TYPES.GET_CONVERSATIONS:
      return {
        ...state,
        users: action.payload.newArr,
        resultUsers: action.payload.result,
        firstLoad: true,
      };
    case MESS_TYPES.GET_MESSAGES:
      return {
        ...state,
        data: [...state.data, action.payload],
        listing: action.payload.listing,
      };
    case MESS_TYPES.UPDATE_MESSAGES:
      return {
        ...state,
        data: EditData(state.data, action.payload._id, action.payload),
        listing: action.payload.listing,
      };
    case MESS_TYPES.DELETE_MESSAGES:
      return {
        ...state,
        data: state.data.map((item) => (item._id === action.payload._id ? { ...item, messages: action.payload.newData } : item)),
      };
    case MESS_TYPES.DELETE_CONVERSATION:
      return {
        ...state,
        users: DeleteConversationUser(state.users, action.payload),
        data: DeleteConversationData(state.data, action.payload),
      };
    case MESS_TYPES.CHECK_ONLINE_OFFLINE:
      return {
        ...state,
        users: state.users.map((user) => (action.payload.includes(user._id) ? { ...user, online: true } : { ...user, online: false })),
      };
    default:
      return state;
  }
};

export default messageReducer;
