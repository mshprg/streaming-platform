import styles from "../styles/components/ConnectRtspModal.module.css";
import stylesStreamModal from "../styles/components/ConnectStreamModal.module.css";
import {useCustomRoomContext} from "./RoomContext.tsx";
import Button from "./Button.tsx";
import {useCallback, useState} from "react";
import Input from "./Input.tsx";
import {createIngress} from "../api/video/api.ts";
import {useRoomContext} from "@livekit/components-react";
import {ButtonStylesEnum} from "../enums/button-styles.enum.ts";
import {AnimatePresence, motion} from "framer-motion";

export default function ConnectRtspModal() {

	const room = useRoomContext();

	const {isOpen, setIsRtspDevicesModalOpen} = useCustomRoomContext().rtspDevicesModal;

	const [deviceUrl, setDeviceUrl] = useState("");
	const [identity, setIdentity] = useState("");
	const [name, setName] = useState("");

	const [loadingButton, setLoadingButton] = useState(false);

	const closeModal = useCallback(() => {
		setIsRtspDevicesModalOpen(false);
	}, [setIsRtspDevicesModalOpen]);

	const connectCameraOnClick = async () => {
		try {
			setLoadingButton(true);

			await createIngress({
				roomName: room.name,
				participantName: name,
				participantIdentity: `${name}-${Date.now()}`,
				inputUrl: deviceUrl,
			});

			setLoadingButton(false);
		} catch (e) {
			console.error(e);
		}

		setLoadingButton(false);
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						className={stylesStreamModal.overlay}
						role="presentation"
						initial={{opacity: 0}}
						animate={{opacity: 1}}
						exit={{opacity: 0}}
					/>
					<motion.div
						className={`${stylesStreamModal.modal} ${styles.modal}`}
						role="dialog"
						aria-modal="true"
						aria-labelledby="connect-rtsp-modal-title"
						aria-description="Модальное окно для добавления камер по протоколу RTSP"
						initial={{opacity: 0}}
						animate={{opacity: 1}}
						exit={{opacity: 0}}
					>
						<h2 id="connect-rtsp-modal-title">
							Подключение по RTSP
						</h2>
						<div className={stylesStreamModal.content}>
							<Input
								inputAttributes={{
									value: deviceUrl,
									onChange: (e) => setDeviceUrl(e.target.value),
									placeholder: 'Device URL'
								}}
								inputWrapperClassName={stylesStreamModal.input}
							/>
							<Input
								inputAttributes={{
									value: identity,
									onChange: (e) => setIdentity(e.target.value),
									placeholder: 'Identity'
								}}
								inputWrapperClassName={stylesStreamModal.input}
							/>
							<Input
								inputAttributes={{
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: 'Name'
								}}
								inputWrapperClassName={stylesStreamModal.input}
							/>
						</div>
						<Button
							onClick={connectCameraOnClick}
							title="Подключить устройство"
							aria-label="Нажмите, чтобы подключиться к конференции"
							loading={loadingButton}
						>
							Подключить устройство
						</Button>
						<Button
							onClick={closeModal}
							title="Закрыть окно"
							aria-label="Закрыть модальное окно"
							btnStyle={ButtonStylesEnum.RED}
						>
							Закрыть
						</Button>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}