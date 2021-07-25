import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { Message } from "semantic-ui-react";

const CREATE_USER = gql`
    mutation Register($username: String!, $password: String) {
        register(options: { username: $username, password: $password }) {
            user {
                username
            }
            errors {
                field
            }
        }
    }
`;

function Register({ history }) {
    const [err, setErr] = useState("");
    const { register, handleSubmit } = useForm();
    const [createUser] = useMutation(CREATE_USER, {
        onCompleted({ register: { user, errors } }) {
            user ? history.push("/") : setErr(errors[0].field);
        },
    });

    const onSubmit = async (data) => await createUser({ variables: data });

    return (
        <Bd>
            <Container>
                <Reg>
                    <form
                        className="register-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <input
                            name="username"
                            type="username"
                            placeholder="Username"
                            {...register("username")}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                        />
                        {err ? (
                            <Message error header="LOGIN Error"></Message>
                        ) : null}
                        <button type="submit">Create an accounts</button>

                        <p className="message">
                            Already registered?{" "}
                            <a href="http://localhost:3000/home">Sign In</a>
                        </p>
                    </form>
                </Reg>
            </Container>
        </Bd>
    );
}

export default Register;

const Bd = styled.div`
    background: #2f3135;
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100vh;
`;

const Container = styled.div`
    width: 360px;
    padding: 1% 0 0;
    margin: auto;
`;

const Reg = styled.div`
    form {
        position: relative;
        z-index: 1;
        background: #ffffff;
        max-width: 360px;
        margin: 0 auto 100px;
        padding: 45px;
        text-align: center;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2),
            0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    input {
        font-family: "Roboto", sans-serif;
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 0 0 15px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 14px;
    }

    button {
        font-family: "Roboto", sans-serif;
        text-transform: uppercase;
        outline: 0;
        background: #2f3135;
        width: 100%;
        border: 0;
        padding: 15px;
        color: #ffffff;
        font-size: 14px;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
    }

    button:hover,
    button:active,
    button:focus {
        background: #43a047;
    }

    .message {
        margin: 15px 0 0;
        color: #b3b3b3;
        font-size: 12px;
    }

    .message a {
        color: #4caf50;
        text-decoration: none;
    }
`;

/* 
    .box {
        margin-top: 10px;
        margin-bottom: 20px;
        border-color: darkgray;
        border-style: dashed;
        border-width: 2px;
        border-radius: 10%;
        height: 270px;
        line-height: 270px;
        text-align: center;
        font-family: "Roboto", sans-serif;
        background: #f2f2f2;
    }

*/
