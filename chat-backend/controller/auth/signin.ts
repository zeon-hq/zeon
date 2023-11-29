import { SigninControllerArgs } from "./auth.types"
import { User } from "../../schema/user"

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
        return
    }   
}