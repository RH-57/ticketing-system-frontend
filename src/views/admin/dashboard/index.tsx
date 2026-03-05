import { FC, useEffect } from "react";
import { useAuthUser } from "../../../hooks/auth/useAuthUser";


const Dashboard: FC = () => {
    const user = useAuthUser()

    useEffect(() => {
            document.title = "Dashboards - Ticketing System"
        })
    return(
       <>
            <div>
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 mt-1 mb-2">
                    Welcome back {user?.name}!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-gray-900 p-6 rounded-lg shadow-sm">
                    <p className="text-md text-white">Total Ticket</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg shadow-sm">

                </div>
                <div className="bg-gray-900 p-6 rounded-lg shadow-sm">

                </div>
                <div className="bg-gray-900 p-6 rounded-lg shadow-sm">

                </div>
            </div>
       </>
        
    )
}

export default Dashboard