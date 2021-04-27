import React        from 'react';
import SidebarEntry from './SidebarEntry';

const SidebarList = (props) => {
    let firstList = props.todolists.filter(todo => (
        todo.id == props.activeid
    ))
    let restList = props.todolists.filter(todo => (
        todo.id != props.activeid
    ))
    let ordered = firstList.concat(restList);
    return (
        <>
            {
                props.todolists &&
                ordered.map(todo => (
                    <SidebarEntry
                        handleSetActive={props.handleSetActive} activeid={props.activeid}
                        id={todo.id} key={todo.id} name={todo.name} _id={todo._id}
                        updateListField={props.updateListField}
                    />
                ))
            }
        </>
    );
};

export default SidebarList;