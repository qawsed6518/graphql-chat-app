import React from "react";
import styled from "styled-components";
// import { PersonFill } from "@styled-icons/bootstrap/PersonFill";

function Message({ timestamp, user, message }) {
    return (
        <Container>
            {/* <Person /> */}
            <MessageInfo>
                <h4>
                    {user}
                    <TimeStamp>{timestamp}</TimeStamp>
                </h4>
                <p> {message} </p>
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
`;

const TimeStamp = styled.span`
    color: gray;
    margin-left: 20px;
    font-size: x-small;
`;
