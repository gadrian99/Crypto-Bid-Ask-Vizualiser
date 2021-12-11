import React from 'react'
import { useGetDetailedProductBookQuery } from '../services/coinbaseApi'
import { Table } from 'antd'

const AggregatedOrderBook = ({ pair, steps }) => {

    const {data: detailData, refetch } = useGetDetailedProductBookQuery({ product_id: pair })
    
    const data = { 
        asks: [],
        bids: []
    }

    //Create ask data
    for(let i = 0; i < detailData?.asks.length; i += 1) {
        data.asks.push({
            price_usd: detailData?.asks[i][0],
            market_size: detailData?.asks[i][1]
        })
    }

    //Create bid data
    for(let i = 0; i < detailData?.bids.length; i += 1) {
        data.bids.push({
            price_usd: detailData?.bids[i][0],
            market_size: detailData?.bids[i][1]
        })
    }

    const decimalToPrecision = (number, precision) => {
        if(precision == 0.01) return number.toFixed(2)
        if(precision == 0.1) return number.toFixed(1)
        if(precision == 0.5) {
          let x = number.toFixed(2).slice(-2)
          if(x<= 25) return Math.floor(number)
          if(x>25 && x<75) return Math.floor(number) + 0.5
          if(x>=75) return Math.ceil(number)
        }
        if(precision == 1) return Math.floor(number)
        if(precision == 2.5) {
          let x = number.toFixed().slice(-1)
          // 0 range
          if(x> 0 && x< 1.4) return Math.floor(number / 10) * 10
          // 2.5 range
          if(x>=1.5 && x<=3.4) return (Math.floor(number / 10) * 10) + 2.5
          // 5 range
          if(x>=3.5 && x<=6.4) return (Math.floor(number / 10) * 10) + 5
          // 7.5 range
          if(x>=6.5 && x<=8.4) return (Math.ceil(number / 10) * 10) - 2.5
          // 10 range
          if(x>8.4) return Math.ceil(number / 10) * 10
        }
        if(precision == 5.0) return Math.floor(number / 5) * 5
        if(precision == 10.0) return Math.floor(number / 10) * 10 
    }

    const aggregateOrderBookSide = (orderBookType, precision = undefined) => {
        const result = []
        const amounts = {}

        // orderbookType ? 'ask' : 'bid'
        // passing data.asks || data.bids = Array[Object]
        for (let i = 0; i < orderBookType.length; i++) {
            // pull singular order
            const order = orderBookType[i]
            // pull order price
            let price = parseFloat(order.price_usd)
            if (precision !== undefined) {
                let x = decimalToPrecision(price, precision)
                price = parseFloat(x)
            }
            amounts[price] = (amounts[price] || 0) + parseFloat(order.market_size)
        }

        
        Object.keys(amounts).forEach (price => {
            result.push (
                {
                    market_size: amounts[price].toFixed(6),
                    price_usd: parseFloat(price)
                }
            )
        })
        return result
    }

    const aggregateOrderBook = (precision = undefined) => {
        data.asks = aggregateOrderBookSide(data.asks, precision)
        data.bids = aggregateOrderBookSide(data.bids, precision)
    }

    ;(async () => {
        await aggregateOrderBook(steps)
    })()

    const columns = [
        { 
            title: 'Market Size',
            dataIndex: 'market_size'
        },
        { 
            title: 'Price (USD)',
            dataIndex: 'price_usd'
        }
    ]
    
    setInterval(() => {
        refetch()
    }, 1000)
    
    return (
        <>
            <div>
                <h2>Ask Orders</h2>
                <Table columns={columns} dataSource={data.asks} size="small" />
            </div>

            <div>
                <h2>Bid Orders</h2>
                <Table columns={columns} dataSource={data.bids.reverse()} size="small" />
            </div>
        </>
    )
}

export default AggregatedOrderBook
