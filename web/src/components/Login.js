import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Form,
    Button,
    Input,
    Container,
    Header,
    Message,
} from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

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
        <Container text>
            <Header as="h2">Login</Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Field error={!!err}>
                    <Input
                        name="username"
                        type="username"
                        placeholder="Username"
                        fluid
                        {...register("username")}
                    />
                </Form.Field>

                <Form.Field>
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        fluid
                    />
                </Form.Field>
                {err ? <Message error header="LOGIN Error"></Message> : null}
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    );
}

export default Login;
