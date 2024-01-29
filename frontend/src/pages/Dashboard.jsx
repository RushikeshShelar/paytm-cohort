import { useEffect, useState } from "react";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { API_PATH, BACKEND_URL } from "../../config";

const Dashboard = () => {

    const [balance, setBalance] = useState(0);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const getBalance = async () => {
            const response = await axios.get(`${BACKEND_URL}/${API_PATH}/account/balance`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const balance = response.data.balance;
            setBalance(balance.toFixed(2));
        }
        getBalance();
    }, [balance, setBalance, token]);

    return (
        <div className="flex flex-col gap-y-4 justify-center">
            <AppBar />
            <div className="flex flex-col gap-y-3 px-10">
                <Balance value={balance} />
                <Users />
            </div>
        </div>
    );
}

export default Dashboard;