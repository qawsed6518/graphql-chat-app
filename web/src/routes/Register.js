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

const CREATE_USER = gql`
    mutation Register($username: String!, $password: String!) {
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
        <Container text>
            <Header as="h2">Register</Header>
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
                {err ? <Message error header="Register Error"></Message> : null}
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    );
}

export default Register;
