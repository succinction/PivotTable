/// GET DATA FROM API SIMULATE
import {blob} from './traffic_bytes.json.js'

const externalAPI = () => {
    // SIMULATE STREAM TO REAL JSON TO ARRAY OF OBJECTS
    return blob.split('\n').map(string => JSON.parse(string));
}

export default externalAPI;
