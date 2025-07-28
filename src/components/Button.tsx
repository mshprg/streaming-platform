import styles from '../styles/components/Button.module.css'
import classNames from "classnames";
import React, {forwardRef} from "react";
import {ButtonStylesEnum} from "../enums/button-styles.enum.ts";

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	children?: React.ReactNode;
	className?: string;
	loading?: boolean;
	loadingTSX?: React.ReactNode;
	clickable?: boolean;
	btnStyle?: ButtonStylesEnum,
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((
	{
		children,
		className,
		loading = false,
		clickable = true,
		loadingTSX,
		btnStyle = ButtonStylesEnum.DEFAULT,
		onClick,
		...rest
	}, ref
) => {

	let buttonStyleClassName;

	switch (btnStyle) {
		case ButtonStylesEnum.RED:
			buttonStyleClassName = styles.redStyle;
			break;
		default:
			buttonStyleClassName = ''
	}

	// Обработчик нажатия
	function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		if (clickable && !loading && onClick) {
			onClick(event);
		}
	}

	return (
		<button
			onClick={handleClick}
			ref={ref}
			className={
				classNames(styles.buttonComponent, className, buttonStyleClassName, !clickable || loading ? styles.disabled : "")
			}
			{...rest}
		>
			{loading ?
				<>
					{loadingTSX}
				</>
				:
				<>
					{children}
				</>
			}
		</button>
	)
})

export default Button;