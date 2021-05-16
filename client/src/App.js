import Homescreen 		from './components/homescreen/Homescreen';
import { useMutation, useQuery } 		from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect, useHistory, Link} from 'react-router-dom';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide, WButton } from 'wt-frontend';
import React, { useState, useEffect } 	from 'react';
import Logo 							from './components/navbar/Logo';
import NavbarOptions 					from './components/navbar/NavbarOptions';
import MainContents 					from './components/main/MainContents';
import Spreadsheet						from './components/spreadsheet/Spreadsheet';
import RegionViewer						from './components/viewer/RegionViewer'
import SidebarContents 					from './components/sidebar/SidebarContents';
import Login 							from './components/modals/Login';
import Delete 							from './components/modals/Delete';
import UpdateAccount					from './components/modals/UpdateAccount';
import CreateAccount 					from './components/modals/CreateAccount';
import { GET_DB_TODOS } 				from './cache/queries';
import * as mutations 					from './cache/mutations';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction,
SortItemsByColumn_Transaction } 				from './utils/jsTPS';
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();

	const [loginBool, setLoginBool] = useState(false);
	const [mostRecent, setMostRecent] = useState("");
	const [ancestors, setAncestors] = useState([]);
	const [viewing, setViewing] = useState(false);
	const [curParent, setCurParent] = useState({})
	const [prev, setPrev] = useState("");
	const [next, setNext] = useState("");

    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }
	const auth = user === null ? false : true;

	const afterLogin = () => {
		setLoginBool(true);
	}

	const selectMapCallback = (_id) => {
		setMostRecent(_id);
	}

	const navigateCallback = (_id, name) => {
		setAncestors(ancestors.concat({_id:_id,name:name}));
	}

	const resetAncestors = () => {
		console.log("call");
		setAncestors([]);
	}

	const handleClickAncestor = (_id) => {
		let index = ancestors.findIndex(ancestor=> ancestor._id === _id);
		console.log(index);
		setAncestors(ancestors.slice(0,index+1))
		console.log(ancestors);
	}

	const navigateViewerCallback = (cur, parent) => {
		setCurParent(parent);
		setViewing(true);
		let curIndex = parent.regions.indexOf(cur);
		if(curIndex == 0){
			setPrev("");
		}
		else {
			setPrev(parent.regions[curIndex-1]);
		}
		if(curIndex == parent.regions.length-1){
			setNext("");
		}
		else {
			setNext(parent.regions[curIndex+1]);
		}
	}

	const prevSibling = () => {
		navigateViewerCallback(prev,curParent);
	}

	const nextSibling = () => {
		navigateViewerCallback(next,curParent);
	}
	const navigateOffViewerCallback = () => {
		setCurParent({});
		setViewing(false);
		setPrev("");
		setNext("");
	}

	return(
		<div>
			<WLayout wLayout="header">
					<BrowserRouter>
						<WLHeader>
							<WNavbar color="colored">
								<ul>
									<WNavItem>
										<Link to="/" onClick={() => {resetAncestors();navigateOffViewerCallback()}}>
										<Logo className='logo' />
										</Link>
									</WNavItem>
								</ul>
								<ul>
									{ancestors.map((ancestor,index) => {
										if(index == ancestors.length-1){
											return <Link  to={"/regions/"+ancestor._id}>
											<div onClick={()=>{handleClickAncestor(ancestor._id);navigateOffViewerCallback()}} className="map-click-entry">
												{ancestor.name}
											</div>
											</Link>
										}
										return <Link  to={"/regions/"+ancestor._id}>
											<div onClick={()=>{handleClickAncestor(ancestor._id)}} className="map-click-entry">
												{ancestor.name}
											</div>
											<div>
												<i className="material-icons">chevron_right</i>
											</div>
										</Link>
									})}
								</ul>
								<ul>
									{viewing ?
									<div style={{display:"flex",justifyContent:"space-between"}}>
										{prev != "" ? 
											<Link to={(prev!="")? "/view/" + prev : "#"} onClick={() => {prevSibling()}}>
												<WButton wType="texted" className="navigate-arrow" 
														style={{color:"white"}} >
													<i className="material-icons">arrow_back</i>
												</WButton>
											</Link>
											:
											<WButton wType="texted" className="navigate-arrow" 
											style={{color:"white"}} disabled={true}>
											<i className="material-icons">arrow_back</i>
											</WButton>}
										{next != "" ? 
											<Link to={"/view/" + next} onClick={() => {nextSibling()}}>
												<WButton wType="texted" className="navigate-arrow" 
												style={{color:"white"}} >
													<i className="material-icons">arrow_forward</i>
												</WButton> 
											</Link>
											:
											<WButton wType="texted" className="navigate-arrow" 
												style={{color:"white"}} disabled={true}>
												<i className="material-icons">arrow_forward</i>
											</WButton> 
										}
									</div>
									: <></>
									}
								</ul>
								<ul>
									<NavbarOptions
										fetchUser={refetch} auth={auth} user={user} logoutCallback={resetAncestors}
									/>
								</ul>
							</WNavbar>
						</WLHeader>
						<WLMain>
						<Switch>
							<Redirect exact from="/" to={ {pathname: "/home"} } />
							<Route 
								path="/home" 
								name="home" 
								render={() => 
									<Homescreen tps={transactionStack} 
											fetchUser={refetch} 
											user={user} 
											login={loginBool} 
											mostRecent={mostRecent}
											selectMapCallback={selectMapCallback}
											navigateCallback={navigateCallback}/>
								} 
							/>
							<Route 
								path="/login"
								name="login" 
								render={() => 
									<Login fetchUser={refetch} loginCallback={afterLogin}/>
									}
							/>
							<Route 
								path="/create"
								name="create" 
								render={() => 
									<CreateAccount fetchUser={refetch} />
									}
							/>
							<Route 
								path="/update"
								name="update" 
								render={() => 
									<UpdateAccount fetchUser={refetch} user={user} cancelCallback={resetAncestors}/>
									}
							/>
							<Route 
								path="/regions/:id"
								render={() => 
								<Spreadsheet user={user} navigateCallback={navigateCallback} 
								navigateViewerCallback={navigateViewerCallback}tps={transactionStack}/>
							}
							/>
							<Route
								path="/view/:id"
								render={()=> 
								<RegionViewer navigateOffViewerCallback={navigateOffViewerCallback}/>
							}
							/>
						</Switch>
						</WLMain>
					</BrowserRouter>
			</WLayout>
		</div>
	);
}

export default App;