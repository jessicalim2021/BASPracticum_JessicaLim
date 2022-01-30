import React, {useEffect, useState} from 'react';
import Transfer from '../Components/Transfer';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { determineBank } from '../Utils/utils';
import AddressBar from '../Components/AddressBar'
import BankUser from '../Components/BankUser'

export default function TransferPage(){

    const location = useLocation()
    const history = useHistory();
    const {account, name} = location.state
    const [state, setState] = useState({
        account,
        name,
    })
    const [txid, setTxid] = useState()
    const [txstatus, setTxstatus] = useState()
    const [fields, setFields] = useState({})

    useEffect(() => {

        setBalance();
    }, [])

    const onInputChangeUpdateField = (name, value) => {
        console.log("name: ", name, " value:", value);
        fields[name] = value;
        setFields({
            ...fields
        });
    };

    const payment = () => {
        console.log(fields.receiver);
        console.log(fields.amount)
        console.log(state.account)
        // Get ACCOUNT variable
        var url = determineBank(fields.receiver) + "/payment"
        console.log("Sending to ", url)
        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiver: fields.receiver,
            amount: fields.amount,
            account: state.account,
          }),
        })
        
        .then(function (response) {
            return response.json()
        })
          .then(function (data) {
              if(data.err_msg){
                  return console.error(data.error_msg)
              }
            console.log(data);
            if (data.msg == "SUCCESS!") {
              console.log("Tx hash", data.result);
              var disObj = JSON.parse(data.result);
              console.log(disObj)
              setTxstatus("Transaction Successful")
              setTxid(disObj.hash)
              setBalance();
            } else {
              console.log("Error", data);
              setTxstatus("Transaction Failed")
            }
          }).catch((err) => {})
      };

      
  const setBalance = () => {
      
	var url = determineBank(state.account) + "/userbal"
    console.log("Reached here", url);
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        friendlyid: state.account,
      }),
    })
      .then(function (response) {
          return response.json()
      })
      .then(function (data) {
        setState({
            ...state,
            balance: data.balance,
        });
      }).catch((err) => {
          // to catch errors from the above .then function since the 1st .then function doesn't stop execution
      })
  };

  
  const setBank = () => {
	var url = determineBank(account) + "/bankuser"
    fetch(url)
    
    .then(function (response) {
        return response.json()
    })
      .then(function (data) {
        history.push({
            pathname: "/transaction-history",
            state: {
                receivedtx: data.tx,
                account: account,
                name
            }
        })
      }).catch((err) => {})
  };

  const logout = () => {
      history.push("/login")
  }

    return (
        <div className="full-width">
            
            <AddressBar account={state.account}
                balance={state.balance}/>
            <Transfer payment={payment}
				onInputChangeUpdateField={onInputChangeUpdateField}
				fields={fields}
				txstatus={txstatus}
			    txid={txid}/>
                
            <div className="full-width margin-y">
			<span className="button is-medium is-info centered-button" onClick={setBank}>
                Transaction History
			</span>
            </div>
        </div>
    )
}