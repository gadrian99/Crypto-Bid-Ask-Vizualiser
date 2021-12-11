import React from 'react'
import { Row, Col, Statistic, Typography } from 'antd'

const { Title } = Typography

const BestContainer = ({ pair, title, name, price, quantity }) => {
    const symbols = (pair) => {
        if(pair === 'btc-usd') return '₿'
        if(pair === 'eth-usd') return 'Ξ'
        if(pair === 'ltc-usd') return 'Ł'
        if(pair === 'bch-usd') return '฿'
    }

    const styles = {
        container: {
            minWidth: '30rem',
            minHeight: '10rem',
            border: '1px solid #d4d4d4',
        }, 
        containerHeader: {
            minHeight: '4rem',
            width: '100%',
            alignItems: 'center',
            paddingLeft: '2rem',
            borderBottom: '1px solid #d4d4d4',
        },

        bidContainerHeader: {
            backgroundColor: '#61a0ff',
        },
        askContainerHeader: {
            backgroundColor: '#ffc861',
        },
        dataContainer: {
            height: '6rem',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '1rem'
        },
        border: {
            borderRight: '1px solid #d4d4d4',
        }
    }

    return (
        <div style={styles.container}>
            <Row style={Object.assign(styles.containerHeader, title === 'Bid' ? styles.bidContainerHeader : styles.askContainerHeader)} >
                <Col span={24}><Title level={4}>Best {title}: {name}</Title></Col>
            </Row>
            <Row>
                <Col span={12} style={Object.assign(styles.border, styles.dataContainer)}>
                    <Statistic title={`Best ${title}`} value={price} precision={2} prefix='$' />
                </Col>
                <Col span={12} style={styles.dataContainer}>
                    <Statistic title={`${title} Quantity`} value={quantity} precision={8} prefix={symbols(pair)}/>
                </Col>
            </Row>
        </div>
    )
}

export default BestContainer
