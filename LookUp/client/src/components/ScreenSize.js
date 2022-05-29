import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'

export default function ScreenSize() {

    const history = useHistory()

    const [windowDimenion, detectHW] = useState({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    })
  
    const detectSize = () => {
      detectHW({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
      })
    }
  
    useEffect(() => {
      window.addEventListener('resize', detectSize)

      if(windowDimenion.winWidth <= 766 && new RegExp('/message/(.*)').test(history.location.pathname)){
        console.log("TEST")
        document.getElementsByClassName('header')[0].style.display = 'none'
      }else{
        document.getElementsByClassName('header')[0].style.display = 'block'
      }
  
      return () => {
        window.removeEventListener('resize', detectSize)
      }
    }, [windowDimenion])
  
    return (
      <></>
    )
  }