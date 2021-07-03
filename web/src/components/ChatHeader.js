import React from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { Search as searchIcon } from "@styled-icons/boxicons-regular/Search";
import { LogOut } from "@styled-icons/boxicons-regular/LogOut";

const FIND_CHANNEL = gql`
    mutation Find_Channel($channelNameInput: String!) {
        findChannel(channelNameInput: $channelNameInput)
    }
`;

const LOGOUT = gql`
    mutation Log_Out {
        logout
    }
`;

function ChatHeader({ channelName }) {
    const [logoutMutation] = useMutation(LOGOUT, {
        onCompleted({ logout }) {
            if (logout === true) window.location.reload();
        },
    });
    const [findChannelMutation] = useMutation(FIND_CHANNEL, {
        onCompleted({ findChannel }) {
            findChannel === true
                ? window.location.reload()
                : window.alert("찾는 채널이 없습니다");
        },
    });
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) =>
        await findChannelMutation({ variables: data });

    return (
        <Container>
            <HeaderLeft>
                <ChatHeaderHash>
                    <h3>
                        <ChatHeaderHash>#</ChatHeaderHash>
                        {channelName}
                    </h3>
                </ChatHeaderHash>
            </HeaderLeft>
            <HeaderRight>
                <Search onSubmit={handleSubmit(onSubmit)}>
                    <input
                        placeholder="Search Channels"
                        name="channelNameInput"
                        type="channelNameInput"
                        {...register("channelNameInput")}
                    />
                    <SearchIcon size="20" />
                </Search>
                <LogOutIcon size="35" onClick={logoutMutation} />
            </HeaderRight>
        </Container>
    );
}

export default ChatHeader;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: gray;
    padding: 10px;
`;

const HeaderLeft = styled.div``;

const ChatHeaderHash = styled.div`
    color: gray;
    font-size: 30px;
    padding: 10px;

    h3 {
        display: flex;
        align-items: center;
        color: white;
    }
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    flex: 0.5;
    justify-content: space-between;
`;

const Search = styled.form`
    display: flex;
    align-items: center;
    color: gray;
    background-color: #2f3135;
    border-radius: 3px;
    padding: 3px;

    input {
        background: transparent;
        outline-width: 0;
        color: white;
        border: none;
    }
`;

const SearchIcon = styled(searchIcon)`
    padding: 5px;
    cursor: pointer;
    &:hover {
        color: red;
    }
`;

const LogOutIcon = styled(LogOut)`
    padding: 5px;
    padding-right: 30px;
    padding-bottom: 15px;
    cursor: pointer;
    &:hover {
        color: red;
    }
`;
