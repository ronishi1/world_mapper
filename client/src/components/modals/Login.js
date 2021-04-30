import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol} from 'wt-frontend';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);

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
			props.refetchTodos();
			toggleLoading(false)
			props.setShowLogin(false)
		};
	};


	return (
        // Replace div with WModal

		<div>
			<WModal visible={true}>
				<WMHeader>
				<div className="modal-header" onClose={() => props.setShowLogin(false)}>
					Login
					<div className="modal-close" onClick={()=>props.setShowLogin()}>x</div>
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
						<WButton className="modal-button" onClick={()=>props.setShowLogin()} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
							Cancel
						</WButton>
					</WCol>
				</WRow>
			</WMFooter>
			</WModal>
		</div>
	);
}

export default Login;