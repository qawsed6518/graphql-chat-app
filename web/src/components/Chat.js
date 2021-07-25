import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import Messages from "./Messages";
import ChatHeader from "./ChatHeader";
import Drop from "./Drop";

// import { CardGiftcard } from "@styled-icons/material/CardGiftcard";
// import { Gif } from "@styled-icons/fluentui-system-regular/Gif";
// import { EmojiSmile } from "@styled-icons/bootstrap/EmojiSmile";

function Chat({ channelName }) {
    const { register, handleSubmit } = useForm();
    const [messageMutation] = useMutation(CREATE_MESSAGE);

    const onSubmit = async (data, e) => {
        e.target.reset();
        await messageMutation({
            variables: {
                channelName: channelName,
                text: data.text,
            },
        });
    };

    return (
        <Container>
            <ChatHeader channelName={channelName} />
            {channelName ? <Messages channelName={channelName} /> : <Dummy />}
            <MessagesInput>
                <Drop disabled={!channelName} channelName={channelName} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        // value={input}
                        disabled={!channelName}
                        {...register("text")}
                        // onChange={(e) => setInput(e.target.value)}
                        // placeholder={`Message #${channelName}`}
                    />
                    <button
                        disabled={!channelName}
                        type="submit"
                        // onClick={sendMessage}
                    >
                        Send
                    </button>
                </form>

                {/* <ChatIcons>
                    <Card size="40" />
                    <GifIcon size="40" />
                    <Emoji size="40" />
                </ChatIcons> */}
            </MessagesInput>
        </Container>
    );
}

export default Chat;

const CREATE_MESSAGE = gql`
    mutation createMessage($channelName: String!, $text: String!) {
        createMessage(input: { channelName: $channelName, text: $text })
    }
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0.7;
    background-color: #363a3f;
    height: 100vh;
`;

const Dummy = styled.div`
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

// const ChatIcons = styled.div``;

const MessagesInput = styled.div`
    color: lightgray;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-radius: 5px;
    margin: 20px;
    border-top: 1px solid gray;
    background-color: #474b53;

    form {
        flex: 1;
    }

    form > input {
        padding: 15px;
        background: transparent;
        border: none;
        outline-width: 0;
        color: white;
        font-size: large;
        width: 100%;
    }

    form > button {
        display: none;
    }
`;

// const Card = styled(CardGiftcard)`
//     padding: 5px;
// `;
// const GifIcon = styled(Gif)`
//     padding: 5px;
// `;
// const Emoji = styled(EmojiSmile)`
//     padding: 5px;
// `;
