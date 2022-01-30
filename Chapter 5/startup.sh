
ROOT_DIR="C:\Stellar\Blockchain-Development-for-Finance-Projects\chapter 5"

##  federationA and federationB 
echo "starting federation server"

echo ""
echo "================================================================"
echo ""


SERVICE="federationA"
cd "$ROOT_DIR/federationA"
 ./federation 
echo ""
sleep 1

SERVICE="federationB"
cd "$ROOT_DIR/federationB"
 ./federation 
echo ""
sleep 1

echo ""
echo "================================================================"
echo ""


# # ## complianceA and complianceB 
echo "starting compliance server"

SERVICE="complianceA"
cd "$ROOT_DIR/complianceA"
./compliance --migrate-db 
./compliance  
echo ""

SERVICE="complianceB"
cd "$ROOT_DIR/complianceB"
./compliance --migrate-db 
./compliance 
echo ""

echo ""
echo "================================================================"
echo ""


## bridgeA and bridgeB 
echo "starting bridge server"

#read -p "Press any key to resume ..."
SERVICE="bridgeA"
cd "$ROOT_DIR/bridgeA"
./bridge --migrate-db 
 ./bridge
echo ""

SERVICE="bridgeB"
cd "$ROOT_DIR/bridgeB"
./bridge --migrate-db 
 ./bridge 
echo ""

echo ""
echo "================================================================"
echo ""


cd "$ROOT_DIR/servers"

sleep 3

## CallbacksA and CallbacksB
echo "starting Callback server"
SERVICE="CallbacksA"
 nodemon ./CallbacksA.js 

SERVICE="CallbacksB"
 nodemon ./CallbacksB.js
echo ""

sleep 3

## DBServerA.js and node DBServerB.j
# echo "starting backend server"
#read -p "Press any key to resume ..."
SERVICE="DBServerA"
node ./DBServerA.js  

SERVICE="DBServerB"  
node ./DBServerB.js 

echo ""
echo "================================================================"
echo ""


## start frontend
echo "Starting frontend"
cd "$ROOT_DIR/Bank Portal"
npm start
echo ""
echo "================================================================"
echo ""


## check processes status 
echo "Final status: "
sleep 30
netstat -tulpn | sort

