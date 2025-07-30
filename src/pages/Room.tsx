import {useParams} from "react-router-dom";
import {LiveKitRoom} from '@livekit/components-react';
import '@livekit/components-styles';
import {useEffect, useState} from "react";
import {getToken} from "../api/video/api.ts";
import RoomConference from "../components/live-kit-custom/RoomConference.tsx";
import {RoomProvider} from "../components/RoomContext.tsx";
import Cookies from 'universal-cookie';

const RoomPage = () => {

	const params = useParams();
	const roomId = params?.roomId || "";
	const cookies = new Cookies();

	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const fetchToken = async () => {
			try {
				let time_id = cookies.get("time_id");
				if (!time_id) {
					time_id = Date.now();
					cookies.set("time_id", time_id);
				}
				const response = await getToken({room: roomId, identity: 'user-' + time_id,});

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