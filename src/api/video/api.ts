import {$host} from "../index.ts";
import type {GetTokenResponse} from "./types.ts";

export const getToken = async (
	{room, identity}: {room: string, identity: string}
): Promise<GetTokenResponse> => {
	const {data} = await $host.post('/video/get-token', {room, identity});
	return data;
}

export const createIngress = async (
	{roomName, participantName, participantIdentity, inputUrl}:
	{roomName: string; participantIdentity: string, participantName: string, inputUrl: string},
): Promise<void> => {
	const {data} = await $host.post('/video/create-ingress', {roomName, participantName, participantIdentity, inputUrl});
	return data;
}