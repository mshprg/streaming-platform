
export const ButtonStylesEnum = {
	DEFAULT: 'default',
	RED: 'red',
} as const;

export type ButtonStylesEnum = (typeof ButtonStylesEnum)[keyof typeof ButtonStylesEnum];