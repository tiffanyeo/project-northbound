import { DB } from "../services/DBAccess.js"

// SHOW COUNTRIES AI-MODS
for (let currCountry of DB.locations) {
    
    for (const currAI of DB.participants) {
        if(currAI.locationId == currCountry.id) {
            console.log(`${currCountry.name}s AI models:`, currAI.name);
        }
    }
    
}