import {useParams} from "react-router-dom";
import {LiveKitRoom} from '@livekit/components-react';
import '@livekit/components-styles';
import {useEffect, useState} from "react";
import {getToken} from "../api/video/api.ts";
import RoomConference from "../components/live-kit-custom/RoomConference.tsx";
import {RoomProvider} from "../components/RoomContext.tsx";

const RoomPage = () => {

	const params = useParams();
	const roomId = params?.roomId || "";

	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const fetchToken = async () => {
			try {
				console.log(roomId);
				const response = await getToken({room: roomId, identity: 'user-' + Date.now(),});

				setToken(response.token);
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		}

		fetchToken();
	}, []);

	if (loading) return  <div>Загрузка...</div>

	return (
		<LiveKitRoom
			token={token || ""}
			serverUrl={"wss://192-168-5-146.openvidu-local.dev:7443"}
			connect={true}
			data-lk-theme="default"
			style={{ height: '100vh' }}
		>
			<RoomProvider>
				<RoomConference />
			</RoomProvider>
		</LiveKitRoom>
	);
};

export default RoomPage;