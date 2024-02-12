import axios from "axios";
import keys from "../../config/keys";

const instance = axios.create({
    baseURL: keys.JUDGE0_API,
    headers: {
        'X-RapidAPI-Key': keys.RAPID_API_KEY,
        'X-RapidAPI-Host': keys.RAPID_API_HOST
    }
})

export default instance