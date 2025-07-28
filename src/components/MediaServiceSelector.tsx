import {useEffect, useRef, useState} from 'react';
import styles from "../styles/components/MediaServiceSelector.module.css";

const MediaServiceSelector = () => {

	const videoRef = useRef<HTMLVideoElement | null>(null);

	const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
	const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

	const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
	const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);

	// Получение списка устройств
	useEffect(() => {
		const getDevices = async () => {
			try {
				await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

				const allDevices = await navigator.mediaDevices.enumerateDevices();
				const videoInputs = allDevices.filter(el => el.kind === 'videoinput');
				const audioInputs = allDevices.filter(el => el.kind === 'audioinput');

				setVideoDevices(videoInputs);
				setAudioDevices(allDevices);

				// Выбор по умолчанию
				if (videoInputs[0]) setSelectedVideoId(videoInputs[0].deviceId);
				if (audioInputs[0]) setSelectedAudioId(audioInputs[0].deviceId);
			} catch (e) {
				console.error(e);
				setSelectedAudioId('none');
				setSelectedVideoId('none');
				alert("Ошибка доступа к устройствам");
			}
		}

		getDevices();
	}, []);

	// Запуск потока с выбранным устройством
	useEffect(() => {
		const startStream = async () => {
			if (!selectedVideoId || selectedVideoId === 'none' || !videoRef.current) return;

			try {
				videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({
					video: {deviceId: {exact: selectedVideoId}},
				});
			} catch (e) {
				console.error(e);
				setSelectedVideoId('none')
				alert("Ошибка запуска потока");
			}
		}

		startStream();

		return () => {
			const tracks = videoRef.current?.srcObject instanceof MediaStream
				? videoRef.current.srcObject.getTracks()
				: [];
			tracks.forEach(track => track.stop());
		}
	}, [selectedVideoId]);

	return (
		<div>
			<label>
				Камера:
				<select
					value={selectedVideoId || ''}
					onChange={(e) => setSelectedVideoId(e.target.value)}
				>
					<option value="none">Без камеры</option>
					{videoDevices.map(device => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label || 'Без названия'}
						</option>
					))}
				</select>
			</label>

			<br/>

			<label>
				Микрофон:
				<select
					value={selectedAudioId || ''}
					onChange={(e) => setSelectedAudioId(e.target.value)}
				>
					<option value="none">Без микрофона</option>
					{audioDevices.map(device => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label || 'Без названия'}
						</option>
					))}
				</select>
			</label>

			<div style={{marginTop: '1rem'}}>
				<video
					className={styles.video}
					ref={videoRef}
					autoPlay
					playsInline
				/>
			</div>
		</div>
	);
};

export default MediaServiceSelector;