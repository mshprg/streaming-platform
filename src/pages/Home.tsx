import {useState} from 'react';
import ConnectStreamModal from "../components/ConnectStreamModal.tsx";
import Button from "../components/Button.tsx";

const Home = () => {

	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<main
			style={{minHeight: "100vh", minWidth: "100vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
			{isModalOpen && (
				<ConnectStreamModal closeModal={() => setIsModalOpen(false)}/>
			)}
			<Button onClick={() => setIsModalOpen(true)}>
				Начать
			</Button>
		</main>
	);
};

export default Home;