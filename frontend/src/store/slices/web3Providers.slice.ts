import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DesignatedProvider } from '@/types'

interface Web3ProvidersState {
  providers: DesignatedProvider[]
}

const initialState: Web3ProvidersState = {
  providers: [],
}

export const web3ProvidersSlice = createSlice({
  name: 'web3-providers-slice',
  initialState,
  reducers: {
    updateProviders: (state, action: PayloadAction<DesignatedProvider[]>) => {
      state.providers = action.payload
    },
    addProvider: (state, action: PayloadAction<DesignatedProvider>) => {
      state.providers.push(action.payload)
    },
  },
})

export const { updateProviders, addProvider } = web3ProvidersSlice.actions

export default web3ProvidersSlice.reducer
