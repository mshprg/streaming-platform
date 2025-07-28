import React, {useContext, useState} from "react"
import {createContext} from "react";

type RoomContextType = {
	rtspDevicesModal: {
		isOpen: boolean;
		setIsRtspDevicesModalOpen: (value: boolean) => void;
	}
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {

	const [isRtspDevicesModalOpen, setIsRtspDevicesModalOpen] = useState<boolean>(false);

	const contextValue = {
		rtspDevicesModal: {
			isOpen: isRtspDevicesModalOpen,
			setIsRtspDevicesModalOpen: setIsRtspDevicesModalOpen,
		}
	}

	return (
		<RoomContext.Provider value={contextValue}>
			{children}
		</RoomContext.Provider>
	);
}

export function useCustomRoomContext() {
	const context = useContext(RoomContext);
	if (!context) {
		throw new Error('useCounter must be used within a RoomProvider');
	}
	return context;
}