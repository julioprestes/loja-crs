import axios from "@/utils/axios";

export const verificarToken = async () => {
    try {
        const response = await axios.get('/users/info-by-token');

        return response.status === 200;
    } catch (error) {
        return false;
    }
};