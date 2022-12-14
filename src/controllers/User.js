import User from "../schemas/User.js";
import Video from "../schemas/Video.js";

export const updateUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).send(updatedUser);
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("You can only update your account...!");
  }
};

export const deleteUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.send("User Successfully Deleted...!");
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("You can only Delete Your account...!");
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.send(error);
  }
};
export const subscribe = async (req, res) => {
  try {
    console.log("Sub it is");
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.send("Subscription succesfull!");
  } catch (error) {
    res.send(error);
  }
};

export const unsubscribe = async (req, res) => {
  try {
    console.log("Unsub it is");
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.send("Unsubscription succesfull!");
  } catch (error) {
    res.send(error);
  }
};

export const like = async (req, res) => {
  
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });

    res.json("The video has been liked");
  } catch (error) {
    res.send(error);
  }
};

export const dislike = async (req, res) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet:{ dislikes:id },
      $pull:{ likes:id },
    });
    res.json("The video has been disliked");
  } catch (error) {
    res.send(error);
  }
};
