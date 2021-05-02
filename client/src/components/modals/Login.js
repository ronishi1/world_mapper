import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { useHistory } from 'react-router-dom'
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol} from 'wt-frontend';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);
	let history = useHistory();

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			navHome()
			props.loginCallback()
			// props.refetchMaps();
			toggleLoading(false)
			// props.setShowLogin(false)
		};
	};

	const navHome = () => {
		history.push('/')
	}
	return (
        // Replace div with WModal

		<div>
			<WMHeader>
				<div className="modal-header">
					Login
					<div className="modal-close" onClick={navHome}>x</div>
				</div>
				</WMHeader>

			<WMMain>
			{
				loading ? <div />
					: <div className="main-login-modal">

						<WInput className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' />
						<div className="modal-spacer">&nbsp;</div>
						<WInput className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />

						{
							showErr ? <div className='modal-error'>
								{errorMsg}
							</div>
								: <div className='modal-error'>&nbsp;</div>
						}

					</div>
			}
			</WMMain>
			<WMFooter>
				<WRow>
					<WCol size="5">
						<WButton className="modal-button" onClick={handleLogin} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
							Login
						</WButton>
					</WCol>
					<WCol size="2"></WCol>
					<WCol size="5">
					<WButton span onClick={navHome} className="modal-button cancel-button" wType="texted" hoverAnimation="darken" shape="rounded">
							Cancel
						</WButton>
					</WCol>
				</WRow>
			</WMFooter>
		</div>
	);
}

export default Login;