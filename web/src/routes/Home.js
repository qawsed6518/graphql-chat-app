import React from "react";
import styled from "styled-components";
import { useQuery, gql } from "@apollo/client";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Login from "../components/Login";

const ME = gql`
    query Me {
        me {
            loggedIn
            user {
                channels
            }
        }
    }
`;

function Home({
    match: {
        params: { name },
    },
}) {
    const { loading, error, data } = useQuery(ME);

    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    return (
        <Container>
            {data.me.loggedIn === true ? (
                <>
                    <Sidebar channels={data.me.user.channels} />
                    <Chat channelName={name} />
                </>
            ) : (
                <Login />
            )}
        </Container>
    );
}

export default Home;

const Container = styled.div`
    display: flex;
`;
