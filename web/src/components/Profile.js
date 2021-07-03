import React from "react";
import styled from "styled-components";
import { useQuery, gql } from "@apollo/client";

function Profile() {
    return <Container></Container>;
}

export default Profile;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-item: center;
    color: gray;
    background-color: #2f3135;
    padding: 10px;
    border-top: 1px solid gray;
`;

const ProfileInfo = styled.div`
    flex: 1;
    padding: 10px;
    h3 {
        color: white;
    }
`;

const ProfileIcons = styled.div`
    padding: 10px;
`;

/*
<Profile>
    <ProfileIcons>
        <Avatar onClick={()=>auth.signOut()} src={user.photo}/>

    </ProfileIcons>
    <ProfileInfo>
        <h3>{user.displayName}</h3>
        <p>{user.uid.substring(0,5)}</p>
    </ProfileInfo>

    <ProfileIcons>
        <Mic  size="20" />
        <Headset size="20" />
        <Settings size="20" />
    </ProfileIcons>
</Profile>
*/
