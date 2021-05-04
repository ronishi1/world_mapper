import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import { GET_DB_REGION } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery} 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { useHistory } from 'react-router-dom'
import { WLayout, WLHeader, WLMain, WLSide, WButton, WRow, WCol,WMHeader, WMMain, WMFooter } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction,
SortItemsByColumn_Transaction } 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';


const SpreadsheetEntry = (props) => {
    let history = useHistory();
    let region = {};
    const { loading, error, data, refetch } = useQuery(GET_DB_REGION, {
        variables: { _id: props._id },
      });
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { region = data.getRegion;}

    return (
        <WRow className="spreadsheet-entry">
            <WCol size="3" className="table-text">
                <div style={{display:"flex",justifyContent:"space-between"}}>
                    <i className="material-icons">close</i>
                    <div className="map-click-entry" onClick={() => {history.push("/regions/" + region._id)}}>
                        {region.name}
                    </div>
                    <div></div>
                </div>
            </WCol>
            <WCol size="3" className="table-text">
                {region.capital}
            </WCol>
            <WCol size="2" className="table-text">
                {region.leader}
            </WCol>
            <WCol size="1" className="table-text">
                Region Flag
            </WCol>
            <WCol size="3" className="table-text">
                <div className="map-click-entry" onClick={() => {history.push("/view/" + region._id)}}>
                    {(region.landmarks == null || region.landmarks.length == 0) ? "No landmarks" : region.landmarks[0] + ",..." }
                </div>
            </WCol>
        </WRow>
	);
};

export default SpreadsheetEntry;