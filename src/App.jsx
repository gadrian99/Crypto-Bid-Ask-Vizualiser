import React, { useState } from 'react'
import { useGetProductBookQuery, useGetProductStatsQuery } from './services/coinbaseApi'
import { Select, Typography, Button } from 'antd'
import { BlockPicker } from 'react-color'
import { GithubOutlined, BookOutlined, LineChartOutlined } from '@ant-design/icons'
import BestContainer from './components/BestContainer'
import BookOrderChart from './components/BookOrderChart'
import AggregatedOrderBook from './components/AggregatedOrderBook'
import './App.css'

const { Text, Title } = Typography
const { Option } = Select

const App = () => {
    const pairs = [
        'btc-usd',
        'eth-usd',
        'ltc-usd',
        'bch-usd'
    ]

    const availableSteps = [0.01, 0.1, 1, 5, 10]
    const [pair, setPair] = useState('btc-usd')
    const [bookView, setBookView] = useState(false)
    const [bidColor, setBidColor] = useState('#61a0ff')
    const [askColor, setAskColor] = useState('#ffc861')
    const [activeBidPick, setActiveBidPick] = useState(false)
    const [activeAskPick, setActiveAskPick] = useState(false)
    const {data: detailStats } = useGetProductStatsQuery({ product_id: pair })
    const {data: productBook, refetch } = useGetProductBookQuery({ product_id: pair })
    const [steps, setSteps] = useState(10) // 0.01, 0.1, 1.0, 5.0, 10.0
    
    const updateColor = (color, type) => {
        if (type === 'bid') setBidColor(color)
        if (type === 'ask') setAskColor(color)
    } 

    const styles = {
        navbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#61A0FF',
            padding: '0.5rem 1rem',
        },
        bestContainers: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            padding: '2rem'
        },
        chartContainer: {
            display: 'flex',
            padding: '2rem',
            width: '100%',
            justifyContent: 'space-evenly',
        },
        toolsContainer: {
            display: 'flex',
            padding: '0 5rem',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '0.5rem'
        },
        askButton: {
            backgroundColor: askColor,
            width: '1.5rem', 
            height: '1.5rem', 
            borderRadius: '1rem',
            border: 'none',
        },
        bidButton: {
            backgroundColor: bidColor,
            width: '1.5rem', 
            height: '1.5rem', 
            borderRadius: '1rem',
            border: 'none',
        },
        pickerContainer: {
            display: 'flex',
            flexDirection: 'column'
        }
    }

    setInterval(() => {
        refetch()
    }, 5000)

    return (
        <div style={styles.base}>
            <div style={styles.navbar}>
                <Title level={3}>CoinRoutes Code Challenge</Title>
                <div>
                    <a href="https://github.com/gadrian99"><GithubOutlined style={{ fontSize: '2rem', color: 'white' }} /></a>
                </div>
            </div>
            <div style={styles.bestContainers}>
                <BestContainer pair={pair} title='Bid' name='Coinbase' price={productBook?.bids[0][0]} quantity={productBook?.bids[0][1]} />
                <BestContainer pair={pair} title='Ask' name='Coinbase' price={productBook?.asks[0][0]} quantity={productBook?.asks[0][1]} />
            </div>
            <div style={styles.toolsContainer}>
                <Text>Current pair: <Select defaultValue={pair} onChange={(data) => setPair(data)}>
                    {pairs.map(pair => (
                        <Option value={pair}>{pair}</Option>
                    ))}
                </Select></Text>
                <Text>Current Steps: <Select defaultValue={steps} onChange={(step) => setSteps(step)}>
                    {availableSteps.map(step => (
                        <Option value={step}>{step}</Option>
                    ))}
                </Select></Text>
                <div style={styles.pickerContainer}>
                    <Text>Bid Color: <button onClick={() => setActiveBidPick(!activeBidPick)} style={styles.bidButton}/> {activeBidPick ? <BlockPicker style={{ position: 'relative' }} />: null} </Text> 
                </div>
                <div style={styles.pickerContainer}>
                    <Text>Ask Color: <button onClick={() => setActiveAskPick(!activeAskPick)} style={styles.askButton}/> {activeAskPick ? <BlockPicker />: null} </Text> 
                </div>
                <Button onClick={() => setBookView(!bookView)} icon={bookView ? <LineChartOutlined /> : <BookOutlined />}></Button>
            </div>
            <div style={styles.chartContainer}>
                {bookView ? <AggregatedOrderBook pair={pair} lastPrice={detailStats?.last} steps={steps} /> : <BookOrderChart updateColor={updateColor} bidColor={bidColor} askColor={askColor} pair={pair} />}
                {/* <AggregatedOrderBook pair={pair} steps={steps} /> */}
            </div>
        </div>
    )
}

export default App
