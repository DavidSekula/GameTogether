import React, {useEffect} from 'react';
import styled from 'styled-components';
import FullScreenButton from "./FullScreenButton";

const getPublisherId = (publisher: any): string => {
    const thingBeingPublished = publisher.camera || publisher.screen;
    if (!thingBeingPublished) return '';
    return thingBeingPublished.stream.id;
};

const Stream = styled.div`
    width: 300px;
    height: 169px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    background-color: black;
    background-image: url(/blank-profile-picture.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto 100%;
    border: 1px solid white;
    box-sizing: border-box;
`;

const Container = styled.div`
    width: 300px;
    height: 169px;
    position: relative;
`;

const TopButtonsContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    text-align: right;
    z-index: 1;
`;

const fullScreenClickHandler = (setFullScreenStreamId: (streamId: string) => void, streamId: string) => () => {
    setFullScreenStreamId(streamId);
};

const OtherParticipant = (props: any) => {
    const {stream, subscribe, setFullScreenStreamId} = props;

    useEffect(() => {
        subscribe({
            stream,
            element: stream.id
        })
    }, []);

    return (
        <Container>
            <TopButtonsContainer>
                <FullScreenButton onClick={fullScreenClickHandler(setFullScreenStreamId, stream.id)} />
            </TopButtonsContainer>
            <Stream id={stream.id} key={stream.id}>
            </Stream>
        </Container>
    );
};

interface OtherParticipantsProps {
    streams: any;
    publisher: any;
    subscribe: any;
    setFullScreenStreamId: (streamId: string) => void;
}
const OtherParticipants = (props: OtherParticipantsProps) => {
    const { streams, publisher, subscribe, setFullScreenStreamId } = props;
    return (
        <div>
            {streams
                .filter((stream: any) => stream.id !== getPublisherId(publisher))
                .map((stream: any) => <OtherParticipant {...{stream, subscribe, setFullScreenStreamId}} />)}
        </div>
    );
};

export default OtherParticipants;
