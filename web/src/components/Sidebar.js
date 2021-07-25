import React from "react";
import styled from "styled-components";
import { ExpandMore } from "@styled-icons/material/ExpandMore";
import { Add } from "@styled-icons/fluentui-system-filled/Add";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { Settings } from "@styled-icons/feather/Settings";
import Dropzone from "react-dropzone";

function Sidebar({ channels, username, profilePicture }) {
    const [createChannel] = useMutation(CREATE_CHANNEL, {
        onCompleted({ createChannel: { channel, errors } }) {
            channel ? window.location.reload() : prompt(errors[0].field);
        },
    });

    const handleAddChannel = () => {
        const newChannelName = prompt("Enter a new channel name");
        if (newChannelName) {
            createChannel({ variables: { name: newChannelName } });
        }
    };

    const [uploadFile] = useMutation(PROFILE);

    return (
        <Container>
            <SidebarTop>
                <h3> sidebar top </h3>
                <ExpandMore size="28" />
            </SidebarTop>
            <Channels>
                <ChannelsHeader>
                    <SidebarHeader>
                        <ExpandMore />
                        <h4>SidebarHeader</h4>
                    </SidebarHeader>

                    <AddIcon onClick={handleAddChannel} size="28" />
                </ChannelsHeader>

                <ChannelsList>
                    {channels.map((name) => (
                        <Link
                            key={name}
                            to={`/home/${name}`}
                            style={{ textDecoration: "none" }}
                        >
                            <SidebarChannel>
                                <h4>
                                    <ChannelHash>#</ChannelHash> {name}
                                </h4>
                            </SidebarChannel>
                        </Link>
                    ))}
                </ChannelsList>
            </Channels>
            <Profile>
                <ProfileIcons>
                    <img
                        src={`http://localhost:4000/images/${profilePicture}`}
                        alt={profilePicture}
                    />
                </ProfileIcons>
                <ProfileInfo>
                    <h3>{username}</h3>
                    <p>hello, {username}!</p>
                </ProfileInfo>
                <ProfileIcons>
                    <Dropzone
                        accept="image/*"
                        onDrop={([file]) =>
                            uploadFile({
                                variables: {
                                    file: file,
                                },
                            })
                        }
                    >
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Settings size="40" />
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </ProfileIcons>
            </Profile>
        </Container>
    );
}

export default Sidebar;

const PROFILE = gql`
    mutation ($file: Upload!) {
        profilePicture(file: $file)
    }
`;

const CREATE_CHANNEL = gql`
    mutation CREATE_CHANNEL($name: String!) {
        createChannel(input: $name) {
            channel {
                name
            }
        }
    }
`;

const ProfileInfo = styled.div`
    flex: 1;
    padding: 10px;
    h3 {
        color: white;
    }
`;

const ProfileIcons = styled.div`
    padding: 10px 10px 0px 0px;

    img {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
    }
`;

const Profile = styled.div`
    display: flex;
    justify-content: space-between;
    align-item: center;
    color: gray;
    background-color: #2f3135;
    padding: 10px;
    border-top: 1px solid gray;
`;

const ChannelHash = styled.span`
    font-size: 30px;
    padding: 8px;
`;

const SidebarChannel = styled.div`
    &:hover > h4 {
        color: white;
        background-color: #40464b;
    }

    h4 {
        display: flex;
        padding-left: 15px;
        align-items: center;
        background-color: #2f3135;
        color: gray;
        cursor: pointer;
    }
`;

const AddIcon = styled(Add)`
    cursor: pointer;
    &: hover {
        color: white;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0.15;
    height: 100vh;
    background-color: #2f3135;
`;

const SidebarTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-item: center;
    padding: 20px;
    background-color: #2f3135;
    color: white;
    border-bottom: 3px solid #26282c;
`;

const Channels = styled.div`
    flex: 1;
    overflow: auto;
    ::-webkit-scrollbar {
        width: 5px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #2f3542;
    }
    ::-webkit-scrollbar-track {
        background-color: grey;
    }
`;

const ChannelsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #2f3135;
    color: gray;
`;

const SidebarHeader = styled.div`
    display: flex;
    align-item: center;
`;

const ChannelsList = styled.div``;
