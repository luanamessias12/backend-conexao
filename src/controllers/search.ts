import { Response } from "express-serve-static-core";
import { ExtendedRequest } from "../types/extended-request";
import { searchSchema } from "../schemas/search";
import { findTweetsByBody } from "../services/tweet";

export const searchTweets = async (req: ExtendedRequest, res: Response) => {
          const safeData = searchSchema.safeParse(req.query);
          if (!safeData.success) {
            res.json({ error: safeData.error?.flatten().fieldErrors });
            return;
          }
    
          let perPage = 2;
          let currentPage = safeData.data.page ?? 0;

       const tweets = await findTweetsByBody(
            safeData.data.q,
            currentPage,
            perPage
       );  
       
       res.json( { tweets, page: currentPage });
} 