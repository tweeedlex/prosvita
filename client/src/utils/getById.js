import axios from "axios"
import { SERVER_URL } from "../config"

export const getBrandById = async (id, set) => {
    await axios.get(SERVER_URL + "/api/brand/" + id).then(response => set(response.data))
}

export const getTypeById = async (id, set) => {
    await axios.get(SERVER_URL + "/api/type/" + id).then(response => set(response.data))
}
