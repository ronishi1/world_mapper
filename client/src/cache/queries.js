import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
		}
	}
`;

export const GET_DB_MAPS = gql`
	query GetDBMaps {
		getAllMaps {
			_id
			name
			parent
			parentName
			capital
			leader
			landmarks
			regions
		}
	}
`;

export const GET_DB_REGION = gql`
	query GetDBRegion($_id:String!) {
		getRegion(_id:$_id) {
			_id
			name
			parent
			parentName
			capital
			leader
			landmarks
			regions
		}
	}
`;