import React from 'react';

function BankUser(props)  {
    	
	const goBack = () => {
		props.history.push({
			pathname: "/transfer",
			state: {
				account: props.account,
				name: props.name
			}
		})
	}
        return (
			<div>
			
			<button className="button is-medium is-info back-button" onClick={goBack}>Go back</button>
				<div className="panel-block is-paddingless is-12" >
			
                <div className="column is-12" id="token-lists">
                    {
						
                        props.receivedtx.map((tx,index) => {
                            return (
								
                                <div key={index} className="columns token">
									
                                    <div className="column has-text-centered">
									Tx ID:  {tx.txid}
                                    </div>
									<div className="column has-text-centered">
									Sender :  {tx.sender}
                                    </div>
									<div className="column has-text-centered">
									Receiver :  {tx.receiver}
                                    </div>
									<div className="column has-text-centered">
									Amount :  {tx.amount}
                                    </div>
									<div className="column has-text-centered">
									Currency :  {tx.currency}
                                    </div>
									<div className="column has-text-centered">
									Sender KYC :  {tx.kyc_info}
                                    </div>
								</div>
								)
								})
					}
					</div>
				</div>

			</div>
)}


								
export default BankUser;