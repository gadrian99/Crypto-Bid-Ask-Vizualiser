import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = 'https://api.exchange.coinbase.com'

const createRequest = url => ({ url })

export const coinbaseApi = createApi({
    reducerPath: 'coinbaseApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getProductBook: builder.query({
            query: ({ product_id }) => createRequest(`/products/${product_id}/book`)
        }),
        getDetailedProductBook: builder.query({
            query: ({ product_id }) => createRequest(`/products/${product_id}/book?level=2&limit=1000`)
        }),
        getProductTrades: builder.query({
            query: ({ product_id }) => createRequest(`/products/${product_id}/trades`)
        }),
        getProductStats: builder.query({
            query: ({ product_id }) => createRequest(`/products/${product_id}/stats`)
        })
    })
})

export const {
    useGetProductBookQuery,
    useGetDetailedProductBookQuery,
    useGetProductTradesQuery,
    useGetProductStatsQuery
} = coinbaseApi