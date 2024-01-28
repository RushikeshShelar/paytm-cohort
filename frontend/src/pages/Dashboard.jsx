import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

const Dashboard = () => {
    return ( 
        <div className="flex flex-col gap-y-4 justify-center">
            <AppBar />
            <div className="flex flex-col gap-y-3 px-10">
            <Balance value={1000} />
            <Users />
            </div>
        </div>
     );
}
 
export default Dashboard;