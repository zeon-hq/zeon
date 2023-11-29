import { APIOptions } from "supertokens-node/lib/build/recipe/emailverification";

export type SigninControllerArgs = {
        formFields: {
            id: string;
            value: string;
        }[];
        options: APIOptions;
        userContext: any;
    }
