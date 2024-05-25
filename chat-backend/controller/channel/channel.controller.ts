import dotenv from "dotenv";
import { Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { getUser, getWorkspaceByWorkspaceId } from "zeon-core/dist/func";
import { CannedResponse } from "../../schema/cannedResponse";
import { Channel } from "../../schema/channel";
import { generateRandomString } from "../../utils/blocks";
dotenv.config();


export const createChannel = async (req: SessionRequest, res: Response) => {
  try {
    const workspaceId = req.body.workspaceId;
    const {userId} = req.user;
    const name = req.body.name;
    const workspace = await getWorkspaceByWorkspaceId(workspaceId);
    if(!workspace){
      return res.status(400).json({
        message: "No workspace found",
      });
    }

    const channel = await Channel.create({
      name,
      workspaceId,
      channelId:generateRandomString(6),
      members:[ userId]
    });

    console.log("using types");
    return res.status(200).json({
      message: "Channels created successfully",
      id: channel.channelId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateChannelInfo = async (req: SessionRequest, res: Response) => {
  const { updatedData } = req.body;
  const { channelId } = req.params;
  updatedData._id = undefined;
  console.log("payload", updatedData);
  try {
    const updatedChannel = await Channel.findOneAndUpdate(
      {channelId},
      { $set: updatedData },
      { new: true }
    );
    console.log("updatedChannel", updatedChannel);
    return res.status(200).json({
      message: "Channel data updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getChannel = async (req: Request, res: Response) => {
  const { channelId } = req.params;
  try {
    const channel = await Channel.findOne({channelId});
    if (!channel) {
      return res.status(400).json({
        message: "No channel found",
      });
    }
    return res.status(200).json({
      message: "Channel data fetched successfully",
      channel,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const createCanned = async (req: SessionRequest, res: Response) => {
  const {channelId, title, message} = req.body;
  if(!channelId){
    return res.status(400).json({
      message: "Channel Id is required",
    });
  }

  try {
    // create a canned response from the message and title
    const canned = await CannedResponse.create({
      title,
      message,
    })

    // add the canned response to the channel
    Channel.findOne({channelId}, (err:any, channel:any) => {
      if(err){
        return res.status(500).json({
          message: "Something went wrong",
        });
      }
      if(!channel){
        return res.status(400).json({
          message: "No channel found",
        });
      }
      if(!channel.cannedResponses){
        channel.cannedResponses = [];
      }
      channel.cannedResponses.push(canned._id);
      channel.save();

      return res.status(200).json({
        message: "Canned response created successfully"
      })
    })


  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export const getAllCannedResponsedFromChannel = async (req: SessionRequest, res: Response) => {
  const {channelId} = req.params;
  if(!channelId){
    return res.status(400).json({
      message: "Channel Id is required",
    });
  }

  try {
    // create a canned response from the message and title
    const channel = await Channel.findOne({channelId}).exec();

    // loop through channel.cannedResponses and get the canned response
    const canned = await CannedResponse.find({
      _id: {
        $in: channel.cannedResponses
      }
    })
    
    return res.status(200).json({
      message: "Canned response fetched successfully",
      canned
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export const updatedCannedResponse = async (req: SessionRequest, res: Response) => {

  const {cannedId} = req.body;
  if(!cannedId){
    return res.status(400).json({
      message: "Canned Id is required",
    });
  }

  try {

    CannedResponse.findById(cannedId, (err:any, canned:any) => {
      if(err){
        return res.status(500).json({
          message: "Something went wrong",
        });
      }
      if(!canned){
        return res.status(400).json({
          message: "No canned response found",
        });
      }
      canned.title = req.body.title;
      canned.message = req.body.message;
      canned.save();

      return res.status(200).json({
        message: "Canned response updated successfully"
      })
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

}

export const deleteCannedResponse = async (req: SessionRequest, res: Response) => {
  const {cannedId} = req.params;
  if(!cannedId){
    return res.status(400).json({
      message: "Canned Id is required",
    });
  }

  try {

    CannedResponse.deleteOne({_id: cannedId}, (err:any) => {
      if(err){
        return res.status(500).json({
          message: "Something went wrong",
        });
      }
      return res.status(200).json({
        message: "Canned response deleted successfully"
      })
    })


  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export const getUserFromChannel = async (req: SessionRequest, res: Response) => {
  try {
    const { channelId  } = req.params;
    const channelObj = await Channel.findOne({channelId}).exec()
    if (!channelObj) {
      return res.status(400).json({
        message: "No channel found",
      });
    }
    const channel = channelObj.toObject();

    const workspaceId = channel.workspaceId;
    // get all the members from the channel
    // const members = await User.find({
    //   _id: {
    //     $in: channel.members
    //   }
    // })
    // loop through the members and get the user details
    const members = await Promise.all(channel.members.map(async (member:string) => {
      const user = await getUser({userId: member, workspaceId});
      return user;
    }))
    if (!members) {
      return res.status(400).json({
        message: "No member found",
      });
    }
    return res.status(200).json({
      message: "Member fetched successfully",
      members,
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",

    })
  }
}

export const addUserIdsToChannel = async (req: SessionRequest, res: Response) => {
  let {userIds, channelId } = req.body;
  try {
  
    // find channel with channelId
    const channel = await Channel.findOne({channelId});
    if(!channel){
      return res.status(500).json({ message: "No channel found" });
    }

    // remove ids from userIds that are already in channel.members
    userIds = userIds.filter((id: string) => !channel.members.includes(id));


    // add user ids to channel.members
    channel.members = [...channel.members, ...userIds];
    await channel.save();
    return res.status(200).json({ channelId });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",

    })
  }
}

export const removeUserIdsFromChannel = async (req: SessionRequest, res: Response) => {
  let {userIds, channelId} = req.body;
  try {
    
    // find channel with channelId
    const channel = await Channel.findOne({channelId});
    if(!channel){
      return res.status(500).json({ message: "No channel found" });
    }

    const newMembers:string[] = []
    channel.members.forEach((id: string) => {
      console.log(">>> mactch with to string", userIds[0] === id.toString())
      console.log(">>> mactch with", userIds[0] === id)

      if(!userIds.includes(id.toString())){
        newMembers.push(id)
      }
    })
    
    channel.members = [...newMembers];

    console.log(">>> channel.members", channel.members)
    await channel.save();
    return res.status(200).json({ channelId });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",

    })
  }
}

export const updateCustomPrompt = async (req: SessionRequest, res: Response) => {
  const { channelId, customPrompt } = req.body;
  try {
    const channel = await Channel.findOne({
      channelId,
    });
    if (!channel) {
      return res.status(400).json({
        message: "No channel found",
      });
    }
    channel.customPrompt = customPrompt;
    await channel.save();
    return res.status(200).json({
      message: "Custom prompt updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export const getCustomPrompt = async (req: SessionRequest, res: Response) => {
  const { channelId } = req.params;
  try {
    const channel = await Channel.findOne
    ({channelId});
    if (!channel) {
      return res.status(400).json({
        message: "No channel found",
      });
    }
    return res.status(200).json({
      message: "Custom prompt fetched successfully",
      customPrompt: channel.customPrompt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
  
}
