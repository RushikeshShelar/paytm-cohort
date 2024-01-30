import { useState } from "react"

import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { API_PATH, BACKEND_URL } from "../../config"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"



const Update = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");

    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const handleUpdate = async () => {
        try {
            const res = await axios.put(`${BACKEND_URL}/${API_PATH}/user`, {
                username: userName,
                firstName: firstName,
                lastName: lastName
            } , {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            localStorage.setItem("username", res.data.user.username);
            navigate("/dashboard");
            toast.success("Account updated successfully", {
                position: "bottom-right"
            });
        } catch (error) {
            console.log("[UPDATE_ERROR]",error);
        }
    }


    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Update"} />
                <SubHeading label={"Enter your infromation to update your account"} />
                <InputBox onChange={(e) => {
                    setUserName(e.target.value)
                }}
                    placeholder="rushikeshShelar"
                    label={"Username"} />
                <InputBox onChange={(e) => {
                    setFirstName(e.target.value)
                }}
                    placeholder="Rushikesh"
                    label={"First Name"} />
                <InputBox onChange={(e) => {
                    setLastName(e.target.value)
                }}
                    placeholder="Shelar"
                    label={"Last Name"} />
                <div className="pt-4">
                    <Button onClick={handleUpdate}
                        label={"Update"} />
                </div>
                <BottomWarning label={"Don't want to update"} buttonText={"Cancel"} to={"/dashboard"} />
            </div>
        </div>
    </div>
};

export default Update;