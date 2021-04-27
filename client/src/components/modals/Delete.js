import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const Delete = (props) => {

    const handleDelete = async () => {
        props.deleteList(props.activeid);
        props.setShowDelete(false);
    }

    return (
        <div>
            <WModal visible={true}>
                <WMHeader>
            <div className="modal-header" onClose={() => props.setShowDelete(false)}>
                Delete List?
			</div>
            </WMHeader>

            <WMMain>
            <div>
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDelete(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </div>
            </WMMain>
            </WModal>
        </div>
    );
}

export default Delete;