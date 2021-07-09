import React from "react";
import styled from "styled-components";
import Message from "./Message";
import { gql, useQuery } from "@apollo/client";

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
                    key={message._id}
                    user={message.user}
                    message={message.text}
                    timestamp={message.date}
                    image={message.image}
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
            _id
            user
            text
            date
            image
        }
    }
`;

const MESSAGES = gql`
    query Messages($channelName: String!) {
        messages(channelName: $channelName) {
            _id
            user
            text
            date
            image
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
