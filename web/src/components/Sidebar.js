import React from "react";
import styled from "styled-components";
import { ExpandMore } from "@styled-icons/material/ExpandMore";
import { Add } from "@styled-icons/fluentui-system-filled/Add";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

const CREATE_CHANNEL = gql`
    mutation CREATE_CHANNEL($name: String!) {
        createChannel(input: $name) {
            channel {
                name
            }
        }
    }
`;

function Sidebar({ channels }) {
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
        </Container>
    );
}

export default Sidebar;

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
    flex: 0.2;
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
