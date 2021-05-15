import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import { GET_DB_REGION } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery} 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { useHistory } from 'react-router-dom'
import { WLayout, WLHeader, WLMain, WLSide, WButton, WRow, WCol,WMHeader, WMMain, WMFooter } from 'wt-frontend';
import { EditRegion_Transaction } 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';
import WModal from 'wt-frontend/build/components/wmodal/WModal';

import { useParams } from 'react-router-dom';
import SpreadsheetEntry from './SpreadsheetEntry';
const Spreadsheet = (props) => {
    let region = {};
    let { id } = useParams();
    const [AddSubregion] = useMutation(mutations.ADD_SUBREGION)
    const [EditRegion] = useMutation(mutations.EDIT_REGION)

    const { loading, error, data, refetch } = useQuery(GET_DB_REGION, {
        variables: { _id: id },
      });
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { region = data.getRegion;console.log(region);}

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		await refetch()
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		await refetch()
		return retVal;
	}

    const addSubregion = async () => {
		let map = {
            parent: id,
            parentName: region.name
		}
        const { data } = await AddSubregion({ variables: { map:map }});
        console.log(data);
        refetch();
    }

    const editRegion = async (regionID, field, value, prev) => {
		let transaction = new EditRegion_Transaction(regionID, field, prev, value, EditRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};
	return (
		<div>
            <div style={{margin:"30px auto",textAlign:"center",width:"80%"}}>
                    <WRow id="spreadsheet-header" style={{height:"15px"}}>
                        <div style={{marginTop:"-15px"}}>
                        <WButton className="spreadsheet-header-button" onClick={() => {addSubregion()}}wType="texted">
                            <i style={{fontSize:"33px"}} className="material-icons">add</i>
                        </WButton> 
                        <WButton className="spreadsheet-header-button" wType="texted">
                            <i style={{fontSize:"33px"}} className="material-icons">undo</i>
                        </WButton>                  
                        <WButton className="spreadsheet-header-button" wType="texted">
                            <i style={{fontSize:"33px"}} className="material-icons">redo</i>
                        </WButton>                                                 
                        </div>
                        <div style={{marginTop:"-20px"}}>
                            <h3 id="spreadsheet-name">Region Name: {region.name}</h3>
                        </div>
                            <div></div>
                    </WRow>
                    <WRow id="spreadsheet-header-labels">
                        <WCol size="3" className="table-text">
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
                            <SpreadsheetEntry key={_id} _id={_id} navigateCallback={props.navigateCallback} editRegion={editRegion}/>
                        )) : <div></div>}
            </div>

		</div>
	);
};

export default Spreadsheet;