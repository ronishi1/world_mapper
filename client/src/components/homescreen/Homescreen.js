import React, { useState, useEffect } 	from 'react';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { useHistory } from 'react-router-dom'
import { WLayout, WLHeader, WLMain, WLSide, WButton, WRow, WCol,WMHeader, WMMain, WMFooter } from 'wt-frontend';
import WInput from 'wt-frontend/build/components/winput/WInput';
import WModal from 'wt-frontend/build/components/wmodal/WModal';


const Homescreen = (props) => {

	let maps 							= [];
	const [createMap, setShowCreateMap] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [newMapName, setNewMapName] = useState("");
	const [toDelete, setToDelete] = useState("");
	const [toRename, setToRename] = useState("");
	const [rename, setRename] = useState("");
	const [init, setInit] = useState(true);
	
	let history = useHistory();

	const [AddMap] = useMutation(mutations.ADD_MAP)
	const [DeleteMap] = useMutation(mutations.DELETE_MAP)
	const [RenameMap] = useMutation(mutations.RENAME_MAP)

	const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps;}

	const auth = props.user === null ? false : true;
	
	const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
		 maps = data.getAllMaps;
		}
		console.log(maps);
	}

	if(props.login && init){
		refetch();
		setInit(false);
	}

	const showCreateMap = () => {
		setShowCreateMap(true);
		setShowDelete(false);
		setShowEdit(false);
	}

	const hideCreateMap = () => {
		setShowCreateMap(false);
	}

	const createNewMap = async () => {
		if(newMapName == ""){
			alert("Map names cannot be empty. Please enter again");
			return;
		}
		let map = {
			name: newMapName,
			parent: props.user._id,
		}
		const { data } = await AddMap({ variables: { map:map },refetchQueries: [{ query: GET_DB_MAPS }] });
		refetch()
		setNewMapName("");
		hideCreateMap();
		let id = data.addMap.slice(0,data.addMap.indexOf("|||"))
		let name = data.addMap.slice(data.addMap.indexOf("|||") + 3, data.addMap.length)
		history.push("/regions/" + id)
		handleNavigate(id,name)
	}

	const prepDelete = (_id) => {
		setToDelete(_id);
		setShowCreateMap(false);
		setShowDelete(true);
		setShowEdit(false);
	}

	const hideDelete = () => {
		setShowDelete(false);
	}
	const deleteMap = async () => {
		await DeleteMap({ variables: { _id: toDelete }, refetchQueries: [{ query: GET_DB_MAPS }] });
		setToDelete("")
		setShowDelete(false);
	}

	const prepRename = (_id) => {
		setToRename(_id);
		setShowEdit(true);
		setShowDelete(false);
		setShowCreateMap(false);
	}

	const hideEdit = () => {
		setShowEdit(false)
	}

	const renameMap = async () => {
		if(rename == ""){
			alert("Map names cannot be empty. Please enter again");
			return;
		}
		await RenameMap({variables: {_id: toRename, name:rename}, refetchQueries: [{query: GET_DB_MAPS}]});
		setToRename("");
		setRename("")
		setShowEdit("");
	}

	const updateName = (e) => {
		setNewMapName(e.target.value);
	}

	const updateRename = (e) => {
		setRename(e.target.value);
	}

	let first = maps.filter(map => (
        map._id == props.mostRecent
    ))
    let rest = maps.filter(map => (
        map._id != props.mostRecent
    ))
    let ordered = first.concat(rest);

	const handleSelectMap = (_id) => {
		props.selectMapCallback(_id);
	}

	const handleNavigate = (_id,name) => {
		props.navigateCallback(_id,name);
	}
	return (
		<div>
			{auth ? 
			<div style={{margin:"80px auto",textAlign:"center",width:"60%"}}>
				<WLayout wLayout="header">
					<WLHeader>
						<WSidebar style={{overflow:"hidden",borderBottom:"1px solid"}}>
							<h2>Your Maps</h2>
						</WSidebar>			
					</WLHeader>
					<WLMain>
						<WRow>
							<WCol style={{overflowY:"auto",height:"427.5px",borderRight:"1.5px solid white"}} size="6">
								<WSidebar>
									<div>
									{ordered.map((map) => (
									<div style={{borderBottom:"1px solid"}} className="map-entry" key={map._id}>
										<div className="map-click-entry" onClick={() => {history.push("/regions/" + map._id);handleSelectMap(map._id);handleNavigate(map._id,map.name)}}>{map.name}</div>
										<div>
											<WButton onClick={() => {prepRename(map._id)}} wType="texted" className="table-header-button">
												<i className="material-icons">edit</i>
											</WButton>
											<WButton onClick={() => {prepDelete(map._id)}} wType="texted" className="table-header-button">
												<i className="material-icons">delete_outline</i>
											</WButton>
										</div>
									</div>
										
                					))}
									</div>
								</WSidebar>
							</WCol>
							<WCol size="6">
								<WSidebar>
									<img style={{display:"block:",padding:"20px"}} src="/globe.png" alt="image" width="380" height="380"/>
									<WButton onClick={showCreateMap} clickAnimation="ripple-light" span hoverAnimation="darken" color="primary" size="large">Create a new map</WButton>
								</WSidebar>
							</WCol>
						</WRow>
					</WLMain>
				</WLayout>
			</div> : 
			<div style={{margin:"80px auto",textAlign:"center"}}>
				<img style={{display:"block:"}} src="/globe.png" alt="image" width="400" height="400"/>
				<h1 style={{color:"white"}}>Welcome to the World Data Mapper</h1>
			</div>}
			{createMap ? 
				<WModal visible={true} cover={true}>
					<WMHeader>
					<div className="modal-header">
						Create a new root map
					<div className="modal-close" onClick={hideCreateMap}>x</div>
				</div>
					</WMHeader>
					<WMMain>
						<WInput className="modal-input" onBlur={updateName} name='email' labelAnimation="up" barAnimation="solid" labelText="Map Name" wType="outlined" inputType='text' />
					</WMMain>
					<WMFooter>
						<WRow>
							<WCol size="5">
								<WButton span className="modal-button" onClick={createNewMap}clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
									Create Map
								</WButton>
							</WCol>
							<WCol size="2"></WCol>
							<WCol size="5">
							<WButton span onClick={hideCreateMap} className="modal-button cancel-button" wType="texted" hoverAnimation="darken" shape="rounded">
									Cancel
								</WButton>
							</WCol>
						</WRow>
            		</WMFooter>
				</WModal> : 
			<></>}
			{showDelete ? <WModal visible={true} cover={true}>
					<WMHeader>
					<div className="modal-header">
						Delete map?
					<div className="modal-close" onClick={hideDelete}>x</div>
				</div>
					</WMHeader>
					<WMFooter>
						<WRow>
							<WCol size="5">
								<WButton span className="modal-button" onClick={deleteMap}clickAnimation="ripple-light" hoverAnimation="lighten" shape="rounded" color="danger">
									Delete Map
								</WButton>
							</WCol>
							<WCol size="2"></WCol>
							<WCol size="5">
								<WButton span onClick={hideDelete} className="modal-button cancel-button" wType="texted" hoverAnimation="darken" shape="rounded">
									Cancel
								</WButton>
							</WCol>
						</WRow>
            		</WMFooter>
				</WModal> : 
			<></>}
			{showEdit ? 
				<WModal visible={true} cover={true}>
					<WMHeader>
					<div className="modal-header">
						Edit name of map
					<div className="modal-close" onClick={hideEdit}>x</div>
				</div>
					</WMHeader>
					<WMMain>
						<WInput className="modal-input" onBlur={updateRename} name='email' labelAnimation="up" barAnimation="solid" labelText="Map Name" wType="outlined" inputType='text' />
					</WMMain>
					<WMFooter>
						<WRow>
							<WCol size="5">
								<WButton span className="modal-button" onClick={renameMap}clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
									Rename Map
								</WButton>
							</WCol>
							<WCol size="2"></WCol>
							<WCol size="5">
							<WButton span onClick={hideEdit} className="modal-button cancel-button" wType="texted" hoverAnimation="darken" shape="rounded">
									Cancel
								</WButton>
							</WCol>
						</WRow>
            		</WMFooter>
				</WModal> : 
			<></>}

		</div>
	);
};

export default Homescreen;