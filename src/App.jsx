import { useState, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// css
import './App.css';

function App() {
	const [password, setPassword] = useState('');
	const [depth, setDepth] = useState(7);
	const [strongPass, setStrongPass] = useState(null);
	const resultInput = useRef()

	const sha256 = input => {
		return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
			.then(hashBuffer => {
				const hashArray = Array.from(new Uint8Array(hashBuffer));
				const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
				return btoa(encodeURIComponent(hashHex));
			});
	};

	const generate = async () => {
		let pass = await sha256(password);
		setStrongPass(pass);

		for(let i = 1; i < depth; ++i) {
			pass = await sha256(pass);
			setStrongPass(pass);
		}

		navigator.clipboard.writeText(pass);
	};

	return (
		<div className="App">
			<h1>Strong password generator</h1>
			<div className='wrapper'>
				<input type="text" name="password" onChange={e => setPassword(e.target.value)} />
				<input type="number" name="depth" onChange={e => setDepth(e.target.value)} />
			</div>
			<button type="button" onClick={generate}>Generate</button>
			{
				strongPass &&
				<div>
					<h2>Result :</h2>
					<input type="text" ref={resultInput} value={strongPass} onChange={e => e.target.select()}/>
				</div>
			}
		</div>
	);

}

export default App