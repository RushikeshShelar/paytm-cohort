import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { API_PATH, BACKEND_URL } from "../../config";
import { useState } from "react";

 const SendMoney = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const navigate = useNavigate();

    const [amount, setAmount] = useState(0);

    const id = query.get("id");
    const firstName = query.get("firstName");
    const lastName = query.get("lastName");

    const token = localStorage.getItem("token");

    const data = {
        to: id,
        amount: parseInt(amount)
    }

    const handleTransfer = async () => {
        try{
            const response = await axios.post(`${BACKEND_URL}/${API_PATH}/account/transfer`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            // Toast notification for success
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000)
        }catch(error){
            // Toast notification for error
            console.log("[TRANSFER_ERROR]", error);
        }
    }
  
    return <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
            <div
                className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
            >
                <div className="flex flex-col space-y-1.5 p-6">
                <h2 className="text-3xl font-bold text-center">Send Money</h2>
                </div>
                <div className="p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-2xl text-white">{firstName[0]}</span>
                    </div>
                    <h3 className="text-2xl font-semibold">{`${firstName} ${lastName}`}</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="amount"
                    >
                        Amount (in Rs)
                    </label>
                    <input
                        onChange={(e) => {
                            setAmount(e.target.value);
                        }}
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        id="amount"
                        placeholder="Enter amount"
                    />
                    </div>
                    <button onClick={handleTransfer} className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
                        Initiate Transfer
                    </button>
                </div>
                </div>
        </div>
      </div>
    </div>
}

export default SendMoney;