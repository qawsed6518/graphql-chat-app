import React from "react";
import styled from "styled-components";
import Message from "./Message";
import { gql, useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";

function Messages({ channelName }) {
    const { subscribeToMore, ...result } = useQuery(MESSAGES, {
        variables: { channelName },
    });

    subscribeToMore({
        document: NEW_MESSAGE,
        variables: { channelName },
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newMS = subscriptionData.data.newMessage;
            return Object.assign({}, prev, {
                messages: { newMS, ...prev.messages },
            });
        },
    });

    const MS = result.loading ? (
        <Container />
    ) : (
        <Container>
            {result.data.messages.map((message) => (
                <Message
                    key={uuidv4()}
                    user={message.user}
                    message={message.text}
                    timestamp={message.date}
                />
            ))}
        </Container>
    );

    return MS;
}
export default Messages;

const NEW_MESSAGE = gql`
    subscription new_Message($channelName: String!) {
        newMessage(channelName: $channelName) {
            user
            text
            date
        }
    }
`;

const MESSAGES = gql`
    query Messages($channelName: String!) {
        messages(channelName: $channelName) {
            user
            text
            date
        }
    }
`;

const Container = styled.div`
    flex: 1;
    overflow: auto;

    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #2f3542;
    }
    ::-webkit-scrollbar-track {
        background-color: grey;
    }
`;
