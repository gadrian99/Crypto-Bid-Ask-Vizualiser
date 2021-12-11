import { configureStore } from '@reduxjs/toolkit'

import { coinbaseApi } from '../services/coinbaseApi'

export default configureStore({
    reducer: {
        [coinbaseApi.reducerPath]: coinbaseApi.reducer
    }
})