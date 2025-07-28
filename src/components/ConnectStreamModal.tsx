import React, {useState} from 'react';
import styles from "../styles/components/ConnectStreamModal.module.css";
import Button from "./Button.tsx";
import Input from "./Input.tsx";
import {useNavigate} from 'react-router-dom'

interface IProps {
	closeModal: () => void;
}

const ConnectStreamModal: React.FC<IProps> = () => {

	const navigate = useNavigate();

	const [sessionName, setSessionName] = useState<string>("");

	const connectOnClick = () => {
		navigate(`/room/${sessionName.replaceAll(' ',  '')}`);
	}

	return (
		<>
			<div
				className={styles.overlay}
				role="presentation"
			/>
			<div
				className={styles.modal}
				role="dialog"
				aria-modal="true"
				aria-labelledby="connect-modal-title"
				aria-description="Модальное окно для подключения к конференции"
			>
				<h2 id="connect-modal-title">
					Подключение
				</h2>
				<div className={styles.content}>
					<Input
						inputNameText="Идентификатор сессии"
						inputAttributes={{
							value: sessionName,
							onChange: e => setSessionName(e.target.value),
							placeholder: "Введите идентификатор"
						}}
						componentWrapperClassName={styles.input}
					/>
				</div>
				<Button
					onClick={connectOnClick}
					title="Подключиться"
					aria-label="Нажмите, чтобы подключиться к конференции"
				>
					Подключиться
				</Button>
			</div>
		</>
	);
};

export default ConnectStreamModal;