import styles from '../styles/components/Input.module.css'
import React from "react";
import classNames from "classnames";

interface InputProps {
	componentWrapperClassName?: string,
	inputNameClassName?: string,
	inputWrapperClassName?: string,
	inputAttributes?: React.InputHTMLAttributes<HTMLInputElement>,
	inputNameText?: string,
}

const Input: React.FC<InputProps> = (
	{
		componentWrapperClassName,
		inputWrapperClassName,
		inputNameClassName,
		inputAttributes,
		inputNameText = ''
	}) => {

	return (
		<div className={classNames(styles.componentWrapper, componentWrapperClassName)}>
			{inputNameText.length > 0 && (
				<span className={classNames(styles.inputName, inputNameClassName)}>
					{inputNameText}
				</span>
			)}
			<div className={classNames(styles.inputWrapper, inputWrapperClassName)}>
				<input
					className={styles.input}
					{...inputAttributes}
				/>
			</div>
		</div>
	);
};

export default Input;