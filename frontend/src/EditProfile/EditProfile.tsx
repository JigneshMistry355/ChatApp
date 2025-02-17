import axios from "axios";
import Header from "../Header/header";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Login from "../Login/Login";


const EditProfile = () => {

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const userData = useSelector((state: RootState) => state.auth.user);

    console.log("########## Data from store ####################");
    console.log(isAuthenticated);
    console.log((userData));


    useEffect(() => {
        const getUserData = async () => {
            const request = await axios.get('http://localhost:3001/getUserData', {
                params: {
                    request: userData?.username
                }
            })
            console.log(request.data);
             
        }

        getUserData()
        
    })
    

    return (
       
            <>
            { isAuthenticated ? (
                <div className="flex flex-col h-screen w-screen bg-[#310b9b]">
                    <div className="flex justify-end">
                        <Header />
                    </div>
                    <div className="flex flex-grow bg-white justify-center items-center">
                        <div className="flex flex-row w-3/4 h-5/6 bg-[#6649b6] rounded-xl shadow-xl shadow-black">
                            <div className="flex w-1/2 justify-center items-center">
                                <div className="flex ">
                                    <input type="text" />
                                </div>
                            </div>
                            <div className="flex w-1/2 justify-center items-center">
                                <div>
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Login />
            )}
        </>
    )
}

export default EditProfile;