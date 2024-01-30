import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

import { API_PATH, BACKEND_URL } from "../../config";
import { Button } from "./Button";


export const Users = () => {

    const [users, setUser] = useState([]);
    const [filter, setFilter] = useState("");
    const currentUser = localStorage.getItem("username").toLocaleLowerCase();
    
    const debouncedFetchUsers = _.debounce(async (filter) => {
        const response = await axios.get(`${BACKEND_URL}/${API_PATH}/user/bulk?filter=` + filter);
        const users = response.data.user;
        const newUsers = await users.filter((user) => {
            return user.username.toLowerCase() !== currentUser.toLowerCase();
          });
        newUsers.sort();
        setUser(newUsers);
    },400);

    useEffect(() => {
        debouncedFetchUsers(filter);
        return () => debouncedFetchUsers.cancel();
    }, [filter, setFilter])


    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input onChange={(e) => {
                    setFilter(e.target.value);
                }}
                    type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
            </div>
            <div>
                {users.map((user, index) => <User user={user} key={index} />)}
            </div>
        </>
    );
}

function User({ user }) {

    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={() => {
                navigate(`/send?id=${user._id}&firstName=${user.firstName}&lastName=${user.lastName}`)
            }}
            label={"Send Money"} />
        </div>
    </div>
}

