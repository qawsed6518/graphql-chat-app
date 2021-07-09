import React from "react";
import styled from "styled-components";
// import { PersonFill } from "@styled-icons/bootstrap/PersonFill";

function Message({ timestamp, user, message, image }) {
    return (
        <Container>
            {/* <Person /> */}
            <MessageInfo>
                <h4>
                    {user}
                    <TimeStamp>{timestamp}</TimeStamp>
                </h4>
                {message ? <p> {message} </p> : null}
                {image ? (
                    <img
                        src={`http://localhost:4000/images/${image}`}
                        alt={image}
                    />
                ) : null}
            </MessageInfo>
        </Container>
    );
}

export default Message;

// const Person = styled(PersonFill)``;

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    color: white;
`;

const MessageInfo = styled.div`
    margin-left: 20px;
    p {
        margin-top: 10px;
    }

    img {
        margin-top: 10px;
        max-width: 600px;
    }
`;

const TimeStamp = styled.span`
    color: gray;
    margin-left: 20px;
    font-size: x-small;
`;
