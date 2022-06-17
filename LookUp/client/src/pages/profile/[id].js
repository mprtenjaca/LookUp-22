import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import ProfileInfo from '../../components/profile/ProfileInfo'
import { getProfileUser } from "../../redux/actions/profileAction";

const Profile = () => {

    const { auth, profile, alert } = useSelector(state => state)
    const dispatch = useDispatch()
    const { id } = useParams()
    const [saveTab, setSaveTab] = useState(false)


    useEffect(() => {
        if(profile.ids.every(item => item !== id)){
            dispatch(getProfileUser({id, auth}))
        }
    },[id, auth, dispatch, profile.ids])

    return (
        <div>
            <ProfileInfo auth={auth} profile={profile} alert={alert} dispatch={dispatch} id={id} />
        </div>
    )
}

export default Profile
