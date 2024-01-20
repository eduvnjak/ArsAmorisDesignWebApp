import { useState, useRef } from 'react';
import Button from './Button';

export default function StyledFileInput({ children, onChange, onCancel, ...rest }) {
	const inputRef = useRef(null);
	const [inputValue, setInputValue] = useState(null);

	return (
		<>
			<input
				ref={inputRef}
				type='file'
				className='hidden'
				onChange={e => {
					if (e.target.files.length > 0) {
						setInputValue(e.target.files[0].name);
						onChange(e);
					}
				}}
				{...rest}
			></input>
			{/*ovdje bi dobro dosao tw-merge */}
			<span className='mr-3'>
				<Button onClick={() => inputRef.current?.click()}>{children}</Button>
			</span>
			<Button
				onClick={() => {
					setInputValue(null);
					onCancel();
				}}
			>
				Poništi odabir
			</Button>
			<br />
			<span className='mx-1'>{inputValue === null ? 'Nije odabrana datoteka' : inputValue}</span>
		</>
	);
}
