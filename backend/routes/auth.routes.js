import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    console.log("BODY:", req.body);

  const { name, number} = req.body;

  if (!name?.trim() || !number?.trim()) {
  return res.status(400).json({ message: "Missing fields" });
}
  try {
   // const hashed = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      {number:number.trim()},        // update fields
      {
        $set:{name:name.trim()},
        $setOnInsert:{number:number.trim()},
      },
      {
        new: true,                    // return updated doc
        upsert: true,                 // create if not exists
        setDefaultsOnInsert: true,
      }
      //email,
      //password: hashed,
      //role : role || null,
    );

    res.status(201).json({
      message: "User created",
      userId :user._id.toString(),
     });

  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Numebr exists" });

    res.status(500).json({ message: "Server error" });
  }
});

export default router;
