import React from 'react'

const Loading = () => {
    return (
        <div className="position-fixed w-100 h-100 text-center loading"
        style={{background: "rgb(255 255 255 / 60%)", color: "white", top: 0, left: 0, zIndex: 50, display: 'flex'}}>
            <div className='spinner'></div>
        </div>
    )
}

export default Loading