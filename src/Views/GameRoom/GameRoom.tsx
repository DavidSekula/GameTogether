/*
GameTogether © Copyright, Nang Development Limited 2020. All Rights Reserved.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, {useEffect, useState} from 'react';
import useOpenTok from 'react-use-opentok';
import styled from 'styled-components';
import {
    Route,
    Switch,
    useParams,
} from "react-router-dom";
import axios from 'axios';

import Home from '../Home';
import GameView from './GameView';
import Controls from '../../Components/Controls/Controls';
import Me from './Me';
import OtherParticipants from "./OtherParticipants/OtherParticipants";
import FullScreenView from "./FullScreenView/FullScreenView";


const Container = styled.div`
    width: 100vw;
    height: calc(100% - 64px);
    display: flex;
    overflow: hidden;
`;

const MainArea = styled.div`
    flex: 1;
    position: relative;
`;

const SideBar = styled.div`
    width: 300px;
    position: relative;
`;

const Mouse = styled.img`
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
`;

const joinOpentokSession = async (roomid: string, initSessionAndConnect: any) => {
    try {
        const response = await axios.get('/opentok/roomcalldata?roomId=' + roomid);
        initSessionAndConnect(response.data);
    } catch (error) {
        console.error(error);
    }
};

const GameRoom = () => {
    const {roomid} = useParams();
    const [fullScreenStreamId, setFullScreenStreamId] = useState('');

    const [opentokProps, opentokMethods] = useOpenTok();
    const {
        // connection info
        isSessionInitialized,
        connectionId,
        isSessionConnected,

        // connected data
        session,
        connections,
        streams,
        subscribers,
        publisher,
    } = opentokProps;
    const {
        initSessionAndConnect,
        disconnectSession,
        publish,
        unpublish,
        subscribe,
        unsubscribe,
        sendSignal,
    } = opentokMethods;

    useEffect( () => {
        joinOpentokSession(roomid, initSessionAndConnect);
    }, [initSessionAndConnect]);

    return (
        <Container>
            <MainArea>
                <Switch>
                    <Route exact path="/:roomid">
                        <Home roomid={roomid}/>
                    </Route>
                    <Route exact path="/:roomid/:gamename/">
                        <GameView/>
                    </Route>
                </Switch>
                {fullScreenStreamId
                && <FullScreenView
                    streamId={fullScreenStreamId}
                    subscribe={subscribe}
                    streams={streams}
                    setFullScreenStreamId={setFullScreenStreamId}
                />
                }
                <Controls {...{ unpublish, publisher, publish }} />
            </MainArea>
            <SideBar>
                <Me {...{publish, publisher}} />
                <OtherParticipants {...{streams, publisher, subscribe, setFullScreenStreamId}} />
            </SideBar>
            <Mouse src="/mouse.png" id="remoteCursor"/>
        </Container>
    );
};

export default GameRoom;
