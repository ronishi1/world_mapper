import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const undoStyle = (props.disabled || props.disableUndo) ? ' table-header-button-disabled ' : 'table-header-button '
    const redoStyle = (props.disabled || props.disableRedo) ? ' table-header-button-disabled ' : 'table-header-button '
    const sectionStyle = (props.disabled || props.disableSections) ? ' table-header-section-disabled ' : ' table-header-section '
    const clickDisabled = () => { };

    const handleSort = (field) => {
        props.sortColumn(field);
    }

    return (
        <WRow className="table-header">
            <WCol size="4">
                <WButton className={`${sectionStyle}`} wType="texted" onClick={(props.disabled || props.disableSections) ? clickDisabled : () => handleSort("description")}>Task</WButton>
            </WCol>

            <WCol size="2">
                <WButton className={`${sectionStyle}`} wType="texted" onClick={(props.disabled || props.disableSections) ? clickDisabled : () => handleSort("due_date")}>Due Date</WButton>
            </WCol>

            <WCol size="2">
                <WButton className={`${sectionStyle}`} wType="texted" onClick={(props.disabled || props.disableSections) ? clickDisabled : () => handleSort("completed")}>Status</WButton>
            </WCol>

            <WCol size="2">
                <WButton className={`${sectionStyle}`} wType="texted" onClick={(props.disabled || props.disableSections) ? clickDisabled : () => handleSort("assigned_to")}>Assigned</WButton>
            </WCol>

            <WCol size="2">
                <div className="table-header-buttons">
                    <WButton onClick={props.disabled ? clickDisabled : props.undo} wType="texted" className={`${undoStyle}`}>
                        <i className="material-icons">undo</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.redo} wType="texted" className={`${redoStyle}`}>
                        <i className="material-icons">redo</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => props.setActiveList({})} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;