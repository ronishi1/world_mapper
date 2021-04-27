import React            from 'react';
import TableHeader      from './TableHeader';
import TableContents    from './TableContents';

const MainContents = (props) => {
    let temp = false;
    if(props.activeList._id){
        if(props.activeList.items.length == 0){
            temp = true;
        }
    }
    return (
        <div className='table ' >
            <TableHeader
                disableSections={temp}
                disabled={!props.activeList._id} addItem={props.addItem} 
                undo={props.undo} redo={props.redo} disableRedo={props.disableRedo} disableUndo={props.disableUndo}
                setShowDelete={props.setShowDelete} setActiveList={props.setActiveList} sortColumn={props.sortColumn}
            />
            <TableContents
                key={props.activeList.id} activeList={props.activeList}
                deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                editItem={props.editItem}
            />
        </div>
    );
};

export default MainContents;