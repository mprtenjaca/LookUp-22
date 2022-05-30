import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export const SocketContext = React.createContext()
export const socket = io("http://localhost:3000/", { transports: ['websocket'] });

// export function useSocket(){
//     return useContext(SocketContext)
// }


// const SocketProvider = ({children}) => {
//     const [socket, setSocket] = useState()

//     useEffect(() => {
//         const newSocket = io("http://localhost:3000", {transports: ['websocket']})

//         setSocket(newSocket)
//         return () => newSocket.close()
//     }, [])
// }

