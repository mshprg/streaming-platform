import React from "react";
import Home from "../pages/Home.tsx";
import Room from "../pages/Room.tsx";

export interface RouteConfig {
	path: string;
	component: React.ReactNode;
}

export const PathEnum = {
	DEFAULT: "/",
	ROOM: "/room/:roomId",
} as const;

export type PathEnum = (typeof PathEnum)[keyof typeof PathEnum];

export const routes: RouteConfig[] = [
	{ path: PathEnum.DEFAULT, component: <Home /> },
	{ path: PathEnum.ROOM, component: <Room /> },
]