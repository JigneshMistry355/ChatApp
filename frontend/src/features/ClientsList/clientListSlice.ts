import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ClientState {
    client_list: string[] | null
}

const initialClientState:ClientState = {
    client_list: null
}

const clientListSlice = createSlice({
    name: 'clients',
    initialState: initialClientState,
    reducers : {
        setClients: (state, action: PayloadAction<string[]>) => {
            state.client_list = action.payload;
        },
        clearClients: (state) => {
            state.client_list = null
        }
    }
})

export const {setClients, clearClients} = clientListSlice.actions;
export default clientListSlice.reducer;