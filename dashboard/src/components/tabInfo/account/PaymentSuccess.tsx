import React, { useEffect } from 'react'
import useQuery from 'hooks/useQuery'
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import useDashboard from 'hooks/useDashboard';

type Props = {}

const PaymentSuccess = (props: Props) => {
    // get session id from url
    const query = useQuery();
    const {workspaceInfo} = useDashboard();
    const paymentSuccess = async () => {
        try {
            const res = await axios.post("http://localhost:3005/payment-success", {
                sessionId: query.get("session_id")
            });
            showNotification({
                title: "Success",
                message: res.data.message || "Payment successful",
                color: "green",
            });
        } catch (error:any) {
            showNotification({
                title: "Error",
                message: error ?? error?.message ?? "Something went wrong",
                color: "red",
            });
        }
    }
    useEffect(() => {
        paymentSuccess();
    },[])
  return (
    <div>PaymentSuccess</div>
  )
}

export default PaymentSuccess