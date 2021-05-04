import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem }                from 'wt-frontend';
import { useHistory } from 'react-router-dom';

const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);
    let history = useHistory();

    console.log(props)
    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            history.push('/')
            // if (reset) props.setActiveList({});
        }
    };

    const navUpdate = () => {
        history.push('/update')
    }

    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={navUpdate} wType="texted" hoverAnimation="text-primary">
                    {props.user.name}
                </WButton>
            </WNavItem >
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary">
                    Logout
                </WButton>
            </WNavItem >
        </>
    );
};

const LoggedOut = (props) => {
    let history = useHistory();

    const navLogin = () => {
        history.push('/login')
    }

    const navCreateAccount = () => {
        history.push('/create')
    }
    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <WButton id="create-account" className="navbar-options" onClick={navCreateAccount} wType="texted" hoverAnimation="text-primary"> 
                    Create Account
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">

                <WButton className="navbar-options" onClick={navLogin} wType="texted" hoverAnimation="text-primary">
                    Login
                </WButton>
            </WNavItem>
        </>
    );
};


const NavbarOptions = (props) => {

    return (
        <>
            {
                props.auth === false ? <LoggedOut setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate}/>
                : <LoggedIn fetchUser={props.fetchUser} setShowUpdateAccount={props.setShowUpdateAccount} setActiveList={props.setActiveList} logout={props.logout} user={props.user}/>
            }
        </>

    );
};

export default NavbarOptions;