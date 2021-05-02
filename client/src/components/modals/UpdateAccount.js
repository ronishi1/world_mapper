import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { useHistory } from 'react-router-dom'
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol} from 'wt-frontend';

const UpdateAccount = (props) => {
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

	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		// const { loading, error, data } = await Register({ variables: { ...input } });
		// if (loading) { toggleLoading(true) };
		// if (error) { return `Error: ${error.message}` };
		// if (data) {
		// 	console.log(data)
		// 	toggleLoading(false);
		// 	if(data.register.email === 'already exists') {
		// 		alert('User with that email already registered');
		// 	}
		// 	else {
		// 		props.fetchUser();
		// 	}
		// 	props.setShowCreate(false);

		// };
	};
    const navHome = () =>{
        history.push('/')
    }

	return (
        // Replace div with WModal

		<div>
				<WMHeader>
				<div className="modal-header">
					Update Account Information
					<div className="modal-close" onClick={navHome}>x</div>
				</div>
				</WMHeader>

			<WMMain>
                <div className="main-login-modal">
                    <WInput className="modal-input" onBlur={updateInput} name='name' labelAnimation="up" barAnimation="solid" labelText="Name" wType="outlined" inputType='name' />
                    <div className="modal-spacer">&nbsp;</div>
                    <WInput className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' />
                    <div className="modal-spacer">&nbsp;</div>
                    <WInput className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />

                    {/* {
                        showErr ? <div className='modal-error'>
                            {errorMsg}
                        </div>
                            : <div className='modal-error'>&nbsp;</div>
                    } */}

				</div>
			</WMMain>
			<WMFooter>
				<WRow>
					<WCol size="5">
						<WButton className="modal-button" onClick={handleUpdateAccount} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
							Update
						</WButton>
					</WCol>
					<WCol size="2"></WCol>
					<WCol size="5">
						<WButton className="modal-button" onClick={navHome} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
							Cancel
						</WButton>
					</WCol>
				</WRow>
			</WMFooter>
		</div>
	);
}

export default UpdateAccount;