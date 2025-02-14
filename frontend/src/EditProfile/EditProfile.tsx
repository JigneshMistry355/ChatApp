import Header from "../Header/header";

const EditProfile = () => {

    return (
        <>
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
        </>
    )
}

export default EditProfile;