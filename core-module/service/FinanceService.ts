const FINANCE_API_DOMAIN = process.env.FINANCE_API_DOMAIN;
import axios from 'axios';

export const createBulkCategory = async (data:any) => {
    try {
        const res = await axios.post(`${FINANCE_API_DOMAIN}/category/bulk`, data);
        return res.data;
    } catch (error) {
        throw error;
    }
}