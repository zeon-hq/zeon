import { Input } from "@mantine/core";
import { useDispatch } from "react-redux";
import { setTicketFilterText } from "reducer/slice";
export function TicketSearch() {
  const dispatch = useDispatch();
  return (
    <>
      <Input 
        style={{
          marginTop:'0px',
          padding: "0px 12px 12px 12px",
        }}
        onChange={(e: any) => {
          dispatch(setTicketFilterText(e.target.value));
        }}
        placeholder="Enter E-mail or Ticket # to start searching"
      />
    </>
  );
}
