import Button from "./Button.tsx";
import {useCustomRoomContext} from "./RoomContext.tsx";

export default function AddRtspButton() {

	const { setIsRtspDevicesModalOpen } = useCustomRoomContext().rtspDevicesModal;

	return (
		<Button
			onClick={() => setIsRtspDevicesModalOpen(true)}
		>
			Внешние устройства
		</Button>
	)
}