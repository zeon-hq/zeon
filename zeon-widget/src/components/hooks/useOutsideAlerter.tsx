import { Ref } from "react";
import {useEffect } from "react"

const useOutsideAlerter = (ref:Ref<any>,callback?:any) => {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
    
      function handleClickOutside(event:React.MouseEvent<HTMLElement>) {
        //   @ts-ignore
        if (ref.current && !ref.current.contains(event.target)) {
          callback()
        }
      }
      // Bind the event listener
      //   @ts-ignore
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        //   @ts-ignore
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
}
export default useOutsideAlerter