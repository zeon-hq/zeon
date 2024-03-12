import { Request, Response } from "express";

export default class AIController {
    public static async injestPdf(req: Request, res: Response) {
        // start

        // get pdf file, or any type of file


        // store the mongo about the file metadata

        // start the injest process vectoring

        // https://www.youtube.com/watch?v=EFM-xutgAvY&t=914s
        // calculate cost


        // store it in the vector db

        // end
    }

    public static async listfiles(req: Request, res: Response) {
        // start

        // get the list of files along with the vectoring status

        // end
    }

    public static async deleteFile(req: Request, res: Response) {
        // start

        // delete the file from the vector db

        // delete from the file storage system

        // delete from the mongo

        // end
    }
}