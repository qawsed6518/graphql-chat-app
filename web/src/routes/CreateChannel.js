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

const CREATE_CHANNEL = gql`
    mutation CREATE_CHANNEL($name: String!) {
        createChannel(input: $name) {
            channel {
                name
            }
            errors {
                field
            }
        }
    }
`;

function CreateChannel({ history }) {
    const [err, setErr] = useState("");
    const { register, handleSubmit } = useForm();
    const [createChannel] = useMutation(CREATE_CHANNEL, {
        onCompleted({ createChannel: { channel, errors } }) {
            channel ? history.push("/") : setErr(errors[0].field);
        },
    });

    const onSubmit = async (data) => await createChannel({ variables: data });

    return (
        <Container text>
            <Header as="h2">Create Channel</Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Field error={!!err}>
                    <Input
                        name="name"
                        type="name"
                        placeholder="channel name"
                        fluid
                        {...register("name")}
                    />
                </Form.Field>

                {err ? (
                    <Message error header="Create Channel Error"></Message>
                ) : null}
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    );
}

export default CreateChannel;
