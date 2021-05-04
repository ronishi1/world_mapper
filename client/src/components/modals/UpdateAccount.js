import React, { useState } 	from 'react';
import { UPDATE_ACCOUNT } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { useHistory } from 'react-router-dom'
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol} from 'wt-frontend';

const UpdateAccount = (props) => {

	const [input, setInput] = useState({ name: props.user.name, email: props.user.email, password: '' ,initEmail: props.user.email});

	const [loading, toggleLoading] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [UpdateAccount] = useMutation(UPDATE_ACCOUNT);
    let history = useHistory();

    
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
        console.log(input)
    }

    
	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to update account information');
				return;
			}
		}
		const { loading, error, data } = await UpdateAccount({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.updateAccount.email === 'already exists') {
				alert('User with that email already exists');
			}
			else {
				props.fetchUser();
			}
		};
		navHome()

	};
    const navHome = () =>{
        history.push('/')
    }

	return (
        // Replace div with WModal

		<WModal visible={true} cover={true}>
				<WMHeader>
				<div className="modal-header">
					Update Account Information
					<div className="modal-close" onClick={navHome}>x</div>
				</div>
				</WMHeader>

			<WMMain>
                <div className="main-login-modal">
                    <WInput className="modal-input" onChange={updateInput} onBlur={updateInput} name='name' labelAnimation="up" barAnimation="solid" labelText="Name" wType="outlined" inputType='name' value={input.name}/>
                    <div className="modal-spacer">&nbsp;</div>
                    <WInput className="modal-input" onChange={updateInput} onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' value={input.email}/>
                    <div className="modal-spacer">&nbsp;</div>
                    <WInput className="modal-input" onChange={updateInput} onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password'/>

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
					<WButton span onClick={navHome} className="modal-button cancel-button" wType="texted" hoverAnimation="darken" shape="rounded">
							Cancel
						</WButton>
					</WCol>
				</WRow>
			</WMFooter>
		</WModal>
	);
}

export default UpdateAccount;