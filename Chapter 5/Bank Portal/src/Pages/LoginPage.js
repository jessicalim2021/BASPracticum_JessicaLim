import React, { useState } from 'react';
import AppLogin from '../Components/AppLogin';
import {determineBank } from '../Utils/utils'
import {useHistory} from 'react-router-dom'
import Description from '../Components/Description'

export default function LoginPage(){

    const history = useHistory()
    const [fields, setFields] = useState({})
    
    const onInputChangeUpdateField = (name, value) => {
        console.log("name: ", name, " value:", value);

        fields[name] = value;

        setFields({
            ...fields
        });
    };

    const login = () => {
        
        const account = fields.friendlyid;
        console.log("account", account);
        const url = determineBank(account) + "/userdet"
        if(url){
            fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    friendlyid: account,
                }),
            })
            .then((res) => {
                return res.json()
            })
            .then(function (data) {
                //navigate("/transfer", {})

                history.push({
                    pathname: "/transfer", 
                    state : {    
                        account,
                        name:data.name
                    }
                })

            }).catch((err) => {})
        }
    };
    

    return (
        <div className="full-width">
            <AppLogin 
                login={login}
                fields={fields}
                onInputChangeUpdateField={onInputChangeUpdateField}

                />
        </div>
    )
}