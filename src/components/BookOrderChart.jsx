import React from 'react'
import moment from 'moment' 
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useGetProductTradesQuery } from '../services/coinbaseApi'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const BookOrderChart = ({ pair, updateColor, bidColor, askColor }) => {
    
    const buyPrice = [] // aka BID
    const sellPrice = [] // aka ASK
    const timeStamp = []
    const {data: productTrades, refetch} = useGetProductTradesQuery({ product_id: pair })

    setInterval(() => {
        refetch()
    }, 5000)
    
    for(let i = 0; i < productTrades?.length; i += 1) {
        if(productTrades[i]?.side === 'buy') buyPrice.push(productTrades[i]?.price)
        if(productTrades[i]?.side === 'sell') sellPrice.push(productTrades[i]?.price)
        timeStamp.push(moment(productTrades[i]?.time).format('h:mm:ss'))
    }

    const options = {
        elements: {
            point:{
                radius: 1,
                pointStyle: 'circle'
            }
        },
        animation: {
            duration: 0
        },
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: `Bid-Ask Price Chart`,
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    }

    const chartData = {
        labels: timeStamp.reverse(),
        datasets: [
            {
                label: 'Bid Price ($)',
                data: buyPrice,
                borderColor: bidColor,
                backgroundColor: bidColor,
                yAxisID: 'y',
                tension: 0.1,
            },
            {
              label: 'Ask Price ($)',
              data: sellPrice,
              borderColor: askColor,
              backgroundColor: askColor,
              yAxisID: 'y1',
              tension: 0.1,
            },
        ]
    }

    return (
        <div className="chart-container">
            <Line options={options} data={chartData} />
        </div>
    )
}

export default BookOrderChart
