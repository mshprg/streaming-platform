import {
	DisconnectButton,
	useLocalParticipantPermissions,
	LeaveIcon,
	type ControlBarProps,
	ChatToggle,
	ChatIcon,
	TrackToggle, MediaDeviceMenu, usePersistentUserChoices, StartMediaButton, useMaybeLayoutContext
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import React from 'react';
import { supportsScreenSharing } from '@livekit/components-core';
import AddRtspButton from "../AddRtspButton.tsx";

interface CustomControlBarProps extends ControlBarProps {}

const trackSourceToProtocol = (source: Track.Source) => {
	// NOTE: this mapping avoids importing the protocol package as that leads to a significant bundle size increase
	switch (source) {
		case Track.Source.Camera:
			return 1;
		case Track.Source.Microphone:
			return 2;
		case Track.Source.ScreenShare:
			return 3;
		default:
			return 0;
	}
};

export const CustomControlBar: React.FC<CustomControlBarProps> = (
	{
		variation,
		controls,
		saveUserChoices = true,
		onDeviceError,
		...props
	}) => {
	const [_, setIsChatOpen] = React.useState(false);
	const layoutContext = useMaybeLayoutContext();
	React.useEffect(() => {
		if (layoutContext?.widget.state?.showChat !== undefined) {
			setIsChatOpen(layoutContext?.widget.state?.showChat);
		}
	}, [layoutContext?.widget.state?.showChat]);

	const defaultVariation = 'verbose';
	variation ??= defaultVariation;

	const visibleControls = { leave: true, ...controls };

	const localPermissions = useLocalParticipantPermissions();

	if (!localPermissions) {
		visibleControls.camera = false;
		visibleControls.chat = false;
		visibleControls.microphone = false;
		visibleControls.screenShare = false;
	} else {
		const canPublishSource = (source: Track.Source) => {
			return (
				localPermissions.canPublish &&
				(localPermissions.canPublishSources.length === 0 ||
					localPermissions.canPublishSources.includes(trackSourceToProtocol(source)))
			);
		};
		visibleControls.camera ??= canPublishSource(Track.Source.Camera);
		visibleControls.microphone ??= canPublishSource(Track.Source.Microphone);
		visibleControls.screenShare ??= canPublishSource(Track.Source.ScreenShare);
		visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
	}

	const showIcon = React.useMemo(
		() => variation === 'minimal' || variation === 'verbose',
		[variation],
	);
	const showText = React.useMemo(
		() => variation === 'textOnly' || variation === 'verbose',
		[variation],
	);

	const browserSupportsScreenSharing = supportsScreenSharing();

	const [isScreenShareEnabled, setIsScreenShareEnabled] = React.useState(false);

	const onScreenShareChange = React.useCallback(
		(enabled: boolean) => {
			setIsScreenShareEnabled(enabled);
		},
		[setIsScreenShareEnabled],
	);

	const {
		saveAudioInputEnabled,
		saveVideoInputEnabled,
		saveAudioInputDeviceId,
		saveVideoInputDeviceId,
	} = usePersistentUserChoices({ preventSave: !saveUserChoices });

	const microphoneOnChange = React.useCallback(
		(enabled: boolean, isUserInitiated: boolean) =>
			isUserInitiated ? saveAudioInputEnabled(enabled) : null,
		[saveAudioInputEnabled],
	);

	const cameraOnChange = React.useCallback(
		(enabled: boolean, isUserInitiated: boolean) =>
			isUserInitiated ? saveVideoInputEnabled(enabled) : null,
		[saveVideoInputEnabled],
	);

	return (
		<div className='lk-control-bar' {...props}>
			<AddRtspButton />
			{visibleControls.microphone && (
				<div className="lk-button-group">
					<TrackToggle
						source={Track.Source.Microphone}
						onChange={microphoneOnChange}
						onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
					>
						{showText && "Микрофон"}
					</TrackToggle>
					<div className="lk-button-group-menu">
						<MediaDeviceMenu
							kind="audioinput"
							onActiveDeviceChange={(_kind, deviceId) =>
								saveAudioInputDeviceId(deviceId ?? 'default')
							}
						/>
					</div>
				</div>
			)}
			{visibleControls.camera && (
				<div className="lk-button-group">
					<TrackToggle
						source={Track.Source.Camera}
						onChange={cameraOnChange}
						onDeviceError={(error) => onDeviceError?.({source: Track.Source.Camera, error})}
					>
						{showText && "Камера"}
					</TrackToggle>
					<div className="lk-button-group-menu">
						<MediaDeviceMenu
							kind="videoinput"
							onActiveDeviceChange={(_kind, deviceId) =>
								saveVideoInputDeviceId(deviceId ?? 'default')
							}
						/>
					</div>
				</div>
			)}
			{visibleControls.screenShare && browserSupportsScreenSharing && (
				<TrackToggle
					source={Track.Source.ScreenShare}
					captureOptions={{audio: true, selfBrowserSurface: 'include'}}
					onChange={onScreenShareChange}
					onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
				>
					{isScreenShareEnabled ? 'Остановить показ' : 'Показать экран'}
				</TrackToggle>
			)}
			{visibleControls.chat && (
				<ChatToggle>
					{showIcon && <ChatIcon />}
					{showText && "Чат"}
				</ChatToggle>
			)}
			{visibleControls.leave && (
				<DisconnectButton>
					{showIcon && <LeaveIcon />}
					{showText && "Выйти"}
				</DisconnectButton>
			)}
			<StartMediaButton />
		</div>
	);
};