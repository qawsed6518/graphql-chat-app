import React from "react";
import Dropzone from "react-dropzone";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { AddCircle } from "@styled-icons/fluentui-system-regular/AddCircle";

function Drop({ channelName }) {
    const [uploadFile] = useMutation(UPLOAD_FILE);

    return (
        <Dropzone
            accept="image/*"
            onDrop={([file]) =>
                uploadFile({
                    variables: { channelName: channelName, file: file },
                })
            }
        >
            {({ getRootProps, getInputProps }) => (
                <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <AddIcon size="48" />
                    </div>
                </section>
            )}
        </Dropzone>
    );
}

export default Drop;

const AddIcon = styled(AddCircle)``;

const UPLOAD_FILE = gql`
    mutation ($channelName: String!, $file: Upload!) {
        createFile(channelName: $channelName, file: $file)
    }
`;
