import "./App.css";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

const GET_USERS = gql`
  query usersQuery {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query usersQueryById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      age
      isMarried
    }
  }
`;
const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});
  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);

  const {
    data: getUserByIdData,
    error: getUserByIdError,
    loading: getUserByIdLoading,
  } = useQuery(GET_USER_BY_ID, { variables: { id: "4" } });

  const [createUser] = useMutation(CREATE_USER);
  if (getUsersError) return <p>Error : {getUsersError.message}</p>;
  if (getUsersLoading) return <p>Loading</p>;

  const handleCreateUser = async () => {
    console.log(newUser);
    createUser({
      variables: {
        name: newUser.name,
        age: Number(newUser.age),
        isMarried: false,
      },
    });
  };
  return (
    <>
      <div>
        <input
          placeholder="Name..."
          type="text"
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          placeholder="Age..."
          type="number"
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <button onClick={handleCreateUser}> Create User </button>
      </div>
      <div>
        {getUserByIdLoading && <h1>loading</h1>}
        {getUserByIdError && <h1>error</h1>}

        {getUserByIdData && (
          <h1>chosen User: {getUserByIdData.getUserById.name}</h1>
        )}
      </div>

      <div>
        <h1>Users</h1>
        {getUsersData.getUsers.map((user) => (
          <div key={user.id}>
            <p>Name : {user.name}</p>
            <p>age : {user.age}</p>
            <p>is the user Married : {user.isMarried ? "yes" : "no"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
