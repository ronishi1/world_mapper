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

    const [editingName, toggleName] = useState(false);
    const [editingLeader, toggleLeader] = useState(false);
    const [editingCapital, toggleCapital] = useState(false);

    const { loading, error, data, refetch } = useQuery(GET_DB_REGION, {
        variables: { _id: props._id },fetchPolicy:"network-only",
      },);
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

    const handleNavigate = (_id,name) => {
        props.navigateCallback(_id,name);
    }

    const handleNameEdit = async (e) => {
        toggleName(false);
        const newName = e.target.value ? e.target.value : 'Unnamed';
        const prevName = region.name;
        props.editRegion(region._id, 'name', newName, prevName);
        refetchMaps(refetch);
    }

    const handleLeaderEdit = async (e) => {
        toggleLeader(false);
        const newLeader = e.target.value ? e.target.value : 'Unnamed';
        const prevLeader = region.leader;
        props.editRegion(region._id, 'leader', newLeader, prevLeader);
        refetchMaps(refetch);
    }

    const handleCapitalEdit = async (e) => {
        toggleCapital(false);
        const newCapital = e.target.value ? e.target.value : 'Unnamed';
        const prevCapital = region.capital;
        props.editRegion(region._id, 'capital', newCapital, prevCapital);
        refetchMaps(refetch);
    }

    const handleClickDelete = () => {
        props.clickDelete(region);
    }

    return (
        <WRow className="spreadsheet-entry">
            <WCol size="3" className="table-text">
                {editingName ? 
                    <WInput className="table-input" onBlur={handleNameEdit} defaultValue={region.name}
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                            autoFocus={true} type='text'>
                    </WInput> 
                    : 
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div></div>
                        <div className="map-click-entry" onClick={() => {history.push("/regions/" + region._id);handleNavigate(region._id,region.name)}}>
                            {region.name}
                        </div>
                        <div>
                            <WButton onClick={() => {toggleName(!editingName)}} wType="texted" className="table-header-button">
                                <i className="material-icons">edit</i>
                            </WButton>
                            <WButton onClick={() => {handleClickDelete()}} wType="texted" className="table-header-button">
								<i className="material-icons">delete_outline</i>
							</WButton>
                        </div>
                    </div>
                }
            </WCol>
            <WCol size="3" className="table-text">
                {editingCapital ?
                    <WInput className="table-input" onBlur={handleCapitalEdit} defaultValue={region.capital}
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        autoFocus={true} type='text'>
                    </WInput> 
                    :
                    <div onClick={() => toggleCapital(!editingCapital)}
                            >{region.capital}
                    </div>
                }
            </WCol>
            <WCol size="2" className="table-text">
                {editingLeader ?
                    <WInput className="table-input" onBlur={handleLeaderEdit} defaultValue={region.leader}
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        autoFocus={true} type='text'>
                    </WInput> 
                    :
                    <div onClick={() => toggleLeader(!editingLeader)}
                            >{region.leader}
                    </div>
                }
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