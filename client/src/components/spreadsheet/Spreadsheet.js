import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
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

import { useParams } from 'react-router-dom';
const Spreadsheet = (props) => {
    let { id } = useParams();

	return (
		<div>
            testing routing location {id}
		</div>
	);
};

export default Spreadsheet;