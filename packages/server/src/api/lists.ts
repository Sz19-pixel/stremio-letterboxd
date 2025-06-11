import { Router } from "express";
import { z } from "zod";
import { letterboxdCacher } from "../workers/letterboxdCacher.js";

const router = Router();

const AddListsSchema = z.object({
  urls: z.array(z.string().url()).min(1)
});

router.post("/", async (req, res) => {
  try {
    const { urls } = AddListsSchema.parse(req.body);

    const configs = urls.map(url => ({
      url,
      catalogName: "",
      posterChoice: "cinemeta" as const
    }));

    await letterboxdCacher.addLists(configs);

    res.status(200).json({ 
      success: true, 
      message: `تم إضافة ${urls.length} قائمة بنجاح`
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'طلب غير صالح'
    });
  }
});

export default router;
