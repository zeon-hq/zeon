import { SigninControllerArgs } from "./auth.types"
import { User } from "../../schema/user"
import {Logger} from "zeon-core/dist/index"
import {ZeonServices} from "zeon-core/dist/types/types"


const logger = new Logger(ZeonServices.CHAT)

export const signinController = async ( fields:SigninControllerArgs, response:any ) => {
    try {
        const fieldMap:any = {}
        fields.formFields.forEach((item:any) => (
            fieldMap[item.id] = item.value
        ))
        console.log(fieldMap)
        return
    } catch (error) {
        console.log(error)
        logger.error({
            message: "Error in signin",
            error,
        })
        return
    }   
}