import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;

export const UPDATE_ACCOUNT = gql`
	mutation UpdateAccount($email: String!, $password: String!, $name: String!, $initEmail: String!) {
		updateAccount(email:$email, password:$password, name:$name, initEmail:$initEmail){
			email 
			_id
			name
			password
		}
	}
`;
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_ITEM = gql`
	mutation AddItem($item: ItemInput!, $_id: String!, $index: Int!) {
		addItem(item: $item, _id: $_id, index: $index)
   	}  
`;

export const DELETE_ITEM = gql`
	mutation DeleteItem($itemId: String!, $_id: String!) {
		deleteItem(itemId: $itemId, _id: $_id) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const UPDATE_ITEM_FIELD = gql`
	mutation UpdateItemField($_id: String!, $itemId: String!, $field: String!, $value: String!, $flag: Int!) {
		updateItemField(_id: $_id, itemId: $itemId, field: $field, value: $value, flag: $flag) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const REORDER_ITEMS = gql`
	mutation ReorderItems($_id: String!, $itemId: String!, $direction: Int!) {
		reorderItems(_id: $_id, itemId: $itemId, direction: $direction) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const ADD_TODOLIST = gql`
	mutation AddTodolist($todolist: TodoInput!) {
		addTodolist(todolist: $todolist) 
	}
`;

export const DELETE_TODOLIST = gql`
	mutation DeleteTodolist($_id: String!) {
		deleteTodolist(_id: $_id)
	}
`;

export const UPDATE_TODOLIST_FIELD = gql`
	mutation UpdateTodolistField($_id: String!, $field: String!, $value: String!) {
		updateTodolistField(_id: $_id, field: $field, value: $value)
	}
`;

export const SORT_ITEM_COLUMN = gql`
	mutation ColumnSort($_id:String!,$field: String!, $order:Int!,$prev:[ItemInput!]!) {
		sortItemsByColumn(_id: $_id, field: $field, order: $order,prev:$prev) { 
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;