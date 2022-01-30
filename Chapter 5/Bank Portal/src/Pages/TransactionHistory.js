import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import BankUser from '../Components/BankUser';

export default function TransactionHistory(){
    const location = useLocation()
    const history = useHistory()
    const {account, name, receivedtx} = location.state;

    return (
        <div>
            <BankUser 
                account={account}
                name={name}
                history={history}
                receivedtx={receivedtx}/>
        </div>
    )
}