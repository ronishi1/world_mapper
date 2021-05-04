import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import { GET_DB_REGION } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery} 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide, WButton, WRow, WCol,WMHeader, WMMain, WMFooter } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction,
SortItemsByColumn_Transaction } 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';
import WModal from 'wt-frontend/build/components/wmodal/WModal';
import { useParams, useHistory } from 'react-router-dom'

const RegionViewer = (props) => {
    let { id } = useParams();
    let history = useHistory();
    let region = {}
    const { loading, error, data, refetch } = useQuery(GET_DB_REGION, {
        variables: { _id: id },
      });
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { region = data.getRegion;}

    return (
        <div style={{margin:"30px auto",width:"90%"}}>
            <WRow>
                <WCol size="6">
                        <WButton className="spreadsheet-header-button" wType="texted">
                            <i style={{fontSize:"33px"}} className="material-icons">undo</i>
                        </WButton>                  
                        <WButton className="spreadsheet-header-button" wType="texted">
                            <i style={{fontSize:"33px"}} className="material-icons">redo</i>
                        </WButton>     
                    <h3 className="region-viewer-text">FLAG IMAGE GOES HERE</h3>
                    <h3 className="region-viewer-text">Region Name: {region.name}</h3>
                    <h3 className="region-viewer-text">
                        Parent Region: <div style={{display:"inline-block"}} onClick={() => {history.push("/regions/" + region.parent)}}className="map-click-entry">
                            {region.parentName}
                            </div>
                        <WButton wType="texted" id="edit-parent-button">
                            <i className="material-icons">edit</i>
                        </WButton>
                    </h3>
                    <h3 className="region-viewer-text">Region Capital: {region.capital}</h3>
                    <h3 className="region-viewer-text">Region Leader: {region.leader}</h3>
                    <h3 className="region-viewer-text"># of Subregions: {(region.regions == null) ? 0 : region.regions.length}</h3>
                </WCol>
                <WCol size="6">
                    <h3 style={{color:"white"}}>Region Landmarks:</h3>
                    <WSidebar>
                        {region.landmarks  ? region.landmarks.map((landmark) => (
                            <div className="table-text landmark-entry">{landmark}</div>
                        )) : <div></div>}
                    </WSidebar>
                    <div className="add-landmark">
                        <WButton wType="texted" id="edit-parent-button">
                            <i className="material-icons">add</i>
                        </WButton>
                        <WInput></WInput>
                    </div>
                </WCol>
            </WRow>
        </div>
    )
}

export default RegionViewer