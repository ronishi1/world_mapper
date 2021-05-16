import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import { GET_DB_REGION } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery} 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { useHistory } from 'react-router-dom'
import { WLayout, WLHeader, WLMain, WLSide, WButton, WRow, WCol,WMHeader, WMMain, WMFooter } from 'wt-frontend';
import { EditRegion_Transaction, DeleteRegion_Transaction, SortRegions_Transaction, AddRegion_Transaction} from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';
import WModal from 'wt-frontend/build/components/wmodal/WModal';

import { useParams } from 'react-router-dom';
import SpreadsheetEntry from './SpreadsheetEntry';
const Spreadsheet = (props) => {
    const ObjectId = require('mongoose').Types.ObjectId;
    let region = {};
    let { id } = useParams();
    const [AddSubregion] = useMutation(mutations.ADD_SUBREGION)
    const [EditRegion] = useMutation(mutations.EDIT_REGION)
    const [DeleteRegion] = useMutation(mutations.DELETE_REGION);
    const [UnDeleteRegion] = useMutation(mutations.UNDELETE_REGION);
    const [SortRegions] = useMutation(mutations.SORT_REGIONS);


    const [showDelete, toggleShowDelete] = useState(false);
    const [toDelete, setToDelete] = useState({});

    const { loading, error, data, refetch } = useQuery(GET_DB_REGION, {
        variables: { _id: id },fetchPolicy:"network-only",
      });
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { region = data.getRegion;}


    const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
		 region = data.getRegion;
		 return true
		}
		else return false;
	}

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchMaps(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchMaps(refetch);
		return retVal;
	}

    const addSubregion = async () => {
		let map = {
            parent: id,
            parentName: region.name
		}
        let parent = {...region}
        delete parent.__typename;
        const objectId = new ObjectId();
        let transaction = new AddRegion_Transaction(objectId, map, parent, AddSubregion, DeleteRegion);
        props.tps.addTransaction(transaction)
        tpsRedo();
        refetch();
    }

    const editRegion = async (regionID, field, value, prev) => {
		let transaction = new EditRegion_Transaction(regionID, field, prev, value, EditRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
        refetch();
	};

    const clickDelete = (region) => {
        toggleShowDelete(true);
        setToDelete(region)
    }

    const deleteRegion = async () => {
        let current = {...toDelete}
        delete current.__typename;
        let parent = {...region}
        delete parent.__typename;
        let transaction = new DeleteRegion_Transaction(current,parent, DeleteRegion, UnDeleteRegion);
        props.tps.addTransaction(transaction);
        toggleShowDelete(false);
		tpsRedo();
        refetch();
    }

    const sortRegionsByColumn = async (field) => {
        let prev = [...region.regions];
		if(field == "name"){
			let transaction = new SortRegions_Transaction(id,field,0,prev,SortRegions)
			props.tps.addTransaction(transaction);
			refetch();
			tpsRedo();
		}
		else if (field == "leader"){
			let transaction = new SortRegions_Transaction(id,field,0,prev,SortRegions)
			props.tps.addTransaction(transaction);
			refetch();
			tpsRedo();
		}
		else if (field=="capital"){
			let transaction = new SortRegions_Transaction(id,field,0,prev,SortRegions)
			props.tps.addTransaction(transaction);
			refetch();
			tpsRedo();
		}
	}

    const handleNavigateViewer = (cur) => {
        props.navigateViewerCallback(cur,region);
    }
	return (
		<div>
            <div style={{margin:"30px auto",textAlign:"center",width:"80%"}}>
                    <WRow id="spreadsheet-header" style={{height:"15px"}}>
                        <div style={{marginTop:"-15px"}}>
                        <WButton className="spreadsheet-header-button" onClick={() => {addSubregion()}}wType="texted">
                            <i style={{fontSize:"33px"}} className="material-icons">add</i>
                        </WButton> 
                        <WButton onClick={() => {tpsUndo()}}className="spreadsheet-header-button" wType="texted">
                            <i style={{fontSize:"33px"}} className="material-icons">undo</i>
                        </WButton>                  
                        <WButton onClick={() => {tpsRedo()}} className="spreadsheet-header-button" wType="texted">
                            <i style={{fontSize:"33px"}} className="material-icons">redo</i>
                        </WButton>                                                 
                        </div>
                        <div style={{marginTop:"-20px"}}>
                            <h3 id="spreadsheet-name">Region Name: {region.name}</h3>
                        </div>
                            <div></div>
                    </WRow>
                    <WRow id="spreadsheet-header-labels">
                        <WCol size="3" className="table-text" onClick={() => {sortRegionsByColumn("name")}}>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                                <div></div>
                                <div>Name</div>
                                <div>
                                    <i style={{visibility:"hidden"}} className="material-icons">delete_outline</i>
                                    <i style={{visibility:"hidden"}} className="material-icons">delete_outline</i>
                                    <i style={{visibility:"hidden"}} className="material-icons">delete_outline</i>
                                </div>
                            </div>
                        </WCol>
                        <WCol size="3" className="table-text">
                            Capital
                        </WCol>
                        <WCol size="2" className="table-text">
                            Leader
                        </WCol>
                        <WCol size="1" className="table-text">
                            Flag
                        </WCol>
                        <WCol size="3" className="table-text">
                            Landmarks
                        </WCol>
                    </WRow>
                        {(region.regions) ? region.regions.map((_id) => (
                            <SpreadsheetEntry key={_id} _id={_id} navigateCallback={props.navigateCallback} 
                            clickDelete={clickDelete} editRegion={editRegion}
                            navigateViewerCallback={handleNavigateViewer}/>
                        )) : <div></div>}
            </div>
			{showDelete ? <WModal visible={true} cover={true}>
					<WMHeader>
					<div className="modal-header">
						Delete map?
					<div className="modal-close" onClick={() => {toggleShowDelete(false)}}>x</div>
				</div>
					</WMHeader>
					<WMFooter>
						<WRow>
							<WCol size="5">
								<WButton span className="modal-button" onClick={() => {deleteRegion()}}clickAnimation="ripple-light" hoverAnimation="lighten" shape="rounded" color="danger">
									Delete Map
								</WButton>
							</WCol>
							<WCol size="2"></WCol>
							<WCol size="5">
								<WButton span onClick={() => {toggleShowDelete(false);}} className="modal-button cancel-button" wType="texted" hoverAnimation="darken" shape="rounded">
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

export default Spreadsheet;