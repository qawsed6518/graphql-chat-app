import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { Message } from "semantic-ui-react";

const LOGIN = gql`
    mutation LOGIN($username: String!, $password: String!) {
        login(options: { username: $username, password: $password }) {
            user {
                username
                password
                createdAt
            }
            errors {
                field
                message
            }
        }
    }
`;

function Login() {
    const [err, setErr] = useState("");
    const { register, handleSubmit } = useForm();
    const [loginMutation] = useMutation(LOGIN, {
        onCompleted({ login: { user, errors } }) {
            user ? window.location.reload() : setErr(errors[0].field);
        },
    });

    const onSubmit = async (data) => await loginMutation({ variables: data });

    return (
        <Bd>
            <Container>
                <Log>
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
                        <button type="submit">Sign In</button>
                        {err ? (
                            <Message error header="LOGIN Error"></Message>
                        ) : null}
                        <p className="message">
                            Not registered?{" "}
                            <a href="http://localhost:3000/register">
                                Create an account
                            </a>
                        </p>
                    </form>
                </Log>
            </Container>
        </Bd>
    );
}

export default Login;

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

const Log = styled.div`
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

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import {
//     Form,
//     Button,
//     Input,
//     Container,
//     Header,
//     Message,
// } from "semantic-ui-react";
// import { gql, useMutation } from "@apollo/client";

// const LOGIN = gql`
//     mutation LOGIN($username: String!, $password: String!) {
//         login(options: { username: $username, password: $password }) {
//             user {
//                 username
//                 password
//                 createdAt
//             }
//             errors {
//                 field
//                 message
//             }
//         }
//     }
// `;

// function Login() {
//     const [err, setErr] = useState("");
//     const { register, handleSubmit } = useForm();
//     const [loginMutation] = useMutation(LOGIN, {
//         onCompleted({ login: { user, errors } }) {
//             user ? window.location.reload() : setErr(errors[0].field);
//         },
//     });

//     const onSubmit = async (data) => await loginMutation({ variables: data });

//     return (
//         <Container text>
//             <Header as="h2">Login</Header>
//             <Form onSubmit={handleSubmit(onSubmit)}>
//                 <Form.Field error={!!err}>
//                     <Input
//                         name="username"
//                         type="username"
//                         placeholder="Username"
//                         fluid
//                         {...register("username")}
//                     />
//                 </Form.Field>

//                 <Form.Field>
//                     <Input
//                         name="password"
//                         type="password"
//                         placeholder="Password"
//                         {...register("password")}
//                         fluid
//                     />
//                 </Form.Field>
//                 {err ? <Message error header="LOGIN Error"></Message> : null}
//                 <Button type="submit">Submit</Button>
//             </Form>
//         </Container>
//     );
// }

// export default Login;
