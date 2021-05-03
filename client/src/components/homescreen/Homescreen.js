import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MainContents 					from '../main/MainContents';
import SidebarContents 					from '../sidebar/SidebarContents';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import UpdateAccount					from '../modals/UpdateAccount';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { useHistory } from 'react-router-dom'
import { WLayout, WLHeader, WLMain, WLSide, WButton, WRow, WCol,WMHeader, WMMain, WMFooter } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction,
SortItemsByColumn_Transaction } 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';
import WModal from 'wt-frontend/build/components/wmodal/WModal';


const Homescreen = (props) => {

	let maps 							= [];
	const [description, toggleDescription] = useState(false);
	const [date, toggleDate] = useState(false);	
	const [status, toggleStatus] = useState(false);	
	const [assigned, toggleAssigned] = useState(false);
	const [createMap, setShowCreateMap] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [newMapName, setNewMapName] = useState("");
	const [toDelete, setToDelete] = useState("");
	const [toRename, setToRename] = useState("");
	const [rename, setRename] = useState("");
	const [init, setInit] = useState(true);
	
	let history = useHistory();

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	const [ColumnSort] 				= useMutation(mutations.SORT_ITEM_COLUMN);

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
		history.push("/regions/" + data.addMap)
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

// 	const tpsUndo = async () => {
// 		const retVal = await props.tps.undoTransaction();
// 		refetchTodos(refetch);
// 		return retVal;
// 	}

// 	const tpsRedo = async () => {
// 		const retVal = await props.tps.doTransaction();
// 		refetchTodos(refetch);
// 		return retVal;
// 	}


// 	// Creates a default item and passes it to the backend resolver.
// 	// The return id is assigned to the item, and the item is appended
// 	//  to the local cache copy of the active todolist. 
// 	const addItem = async () => {
// 		let list = activeList;
// 		const items = list.items;
// 		const lastID = items.length >= 1 ? items[items.length - 1].id + 1 : 0;
// 		const newItem = {
// 			_id: '',
// 			id: lastID,
// 			description: 'No Description',
// 			due_date: 'No Date',
// 			assigned_to: "Not assigned",
// 			completed: false
// 		};
// 		let opcode = 1;
// 		let itemID = newItem._id;
// 		let listID = activeList._id;
// 		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
// 		props.tps.addTransaction(transaction);
// 		tpsRedo();
// 	};


// 	const deleteItem = async (item, index) => {
// 		let listID = activeList._id;
// 		let itemID = item._id;
// 		let opcode = 0;
// 		let itemToDelete = {
// 			_id: item._id,
// 			id: item.id,
// 			description: item.description,
// 			due_date: item.due_date,
// 			assigned_to: item.assigned_to,
// 			completed: item.completed
// 		}
// 		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
// 		props.tps.addTransaction(transaction);
// 		tpsRedo();
// 	};

// 	const editItem = async (itemID, field, value, prev) => {
// 		let flag = 0;
// 		if (field === 'completed') flag = 1;
// 		let listID = activeList._id;
// 		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
// 		props.tps.addTransaction(transaction);
// 		tpsRedo();

// 	};

// 	const reorderItem = async (itemID, dir) => {
// 		let listID = activeList._id;
// 		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
// 		props.tps.addTransaction(transaction);
// 		tpsRedo();

// 	};

// 	const createNewList = async () => {
// 		const length = todolists.length
// 		const id = length >= 1 ? todolists[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
// 		let list = {
// 			_id: '',
// 			id: id,
// 			name: 'Untitled',
// 			owner: props.user._id,
// 			items: [],
// 		}
// 		const { data } = await AddTodolist({ variables: { todolist: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
// 		resetAll()
// 		const refetched = await refetchTodos(refetch);
//   		if(refetched && data) {
//    		let _id = data.addTodolist;
//    		let newList = todolists.find(list => list._id === _id);
//    		setActiveList(newList)
//   }
// 	};


	// const deleteList = async (_id) => {
	// 	DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
	// 	refetch();
	// 	resetAll()
	// 	setActiveList({});
	// };

	// const updateListField = async (_id, field, value, prev) => {
	// 	let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
	// 	props.tps.addTransaction(transaction);
	// 	tpsRedo();

	// };

	// const sortItemsByColumn = async (field) => {
	// 	let listID = activeList._id;
	// 	let prev = []
	// 	activeList.items.forEach((item) => {
	// 		let {__typename,...temp} = item;
	// 		prev.push(temp)
	// 	})
	// 	if(field == "description"){
	// 		let transaction = new SortItemsByColumn_Transaction(listID,field,description ? 0 : 1,prev,ColumnSort)
	// 		toggleDescription(!description)
	// 		props.tps.addTransaction(transaction);
	// 		refetch();
	// 		tpsRedo();
	// 	}
	// 	else if (field == "due_date"){
	// 		let transaction = new SortItemsByColumn_Transaction(listID,field,date ? 0 : 1,prev,ColumnSort)
	// 		toggleDate(!date)
	// 		props.tps.addTransaction(transaction);
	// 		refetch();
	// 		tpsRedo();
	// 	}
	// 	else if (field=="completed"){
	// 		let transaction = new SortItemsByColumn_Transaction(listID,field,status ? 0 : 1,prev,ColumnSort)
	// 		toggleStatus(!status)
	// 		props.tps.addTransaction(transaction);
	// 		refetch();
	// 		tpsRedo();
	// 	}
	// 	else if (field=="assigned_to"){
	// 		let transaction = new SortItemsByColumn_Transaction(listID,field,assigned ? 0 : 1,prev,ColumnSort)
	// 		toggleAssigned(!assigned)
	// 		props.tps.addTransaction(transaction);
	// 		refetch();
	// 		tpsRedo();
	// 	}
	// }

	// const handleSetActive = (id) => {
	// 	const todo = todolists.find(todo => todo.id === id || todo._id === id);
	// 	resetAll()
	// 	console.log(todo)
	// 	setActiveList(todo);
	// };

	// const resetAll = () => {
	// 	props.tps.clearAllTransactions();
	// 	toggleDescription(false)
	// 	toggleDate(false)
	// 	toggleStatus(false)
	// 	toggleAssigned(false)
	// }	

	// let handleKeyDown = (e) => {
	// 	if(e.keyCode == 90 && e.ctrlKey){
	// 	  tpsUndo()
	// 	}
	// 	else if(e.keyCode == 89 && e.ctrlKey){
	// 	  tpsRedo()
	// 	}
	//   }
	  
	// useEffect(() => {
	// 	window.addEventListener('keydown', handleKeyDown)
  	// 	return () => {
    // 		window.removeEventListener('keydown', handleKeyDown)
  	// 	}
	// },[handleKeyDown,props.tps]);

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
									{maps.map((map) => (
									<div style={{borderBottom:"1px solid"}} className="map-entry" key={map._id}>
										<div className="map-click-entry" onClick={() => {history.push("/regions/" + map._id)}}>{map.name}</div>
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