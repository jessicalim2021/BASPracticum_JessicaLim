
const DBServerA = "localhost:3600"; // change from 3602 (Bank B) to 3600 (Bank A)
const DBServerB = "localhost:3602";

export function determineBank (friendlyId) {
    const domain = friendlyId.split("*")[1];
    let url = "";
    if (domain == "banka.com") {
        url = "http://" + DBServerA;
    } else if (domain == "bankb.com") {
        url = "http://" + DBServerB;
    } else {
        return console.error("Domain not found", domain);
    }
    console.log("Sending to", url)
    return url
}
