import { SigninControllerArgs } from "./auth.types";
import { User } from "../../schema/user";
import { Team } from "../../schema/team";
import { Invite } from "../../schema/invite";
import { sendEmailOnSignUp } from "../../utils/notifications";
import {Logger} from "zeon-core/dist/index"
import {ZeonServices} from "zeon-core/dist/types/types"

const logger = new Logger(ZeonServices.CHAT)

export const signupController = async (
  fields: SigninControllerArgs,
  response: any
) => {
  try {
    const fieldMap: any = {};
    fields.formFields.forEach((item: any) => (fieldMap[item.id] = item.value));
    // console.log(fieldMap);
    const { email, firstName, lastName } = fieldMap;
    let { id } = response.user;
    const user = await User.create({
      email: email,
      firstName: firstName,
      lastName: lastName
    });

    // Add all the teams user has been invited to in the user db
    const invitedTeams = await Invite.find({ email: email }).exec();
    for(let team of invitedTeams) {
      user.teams.push(team.workspaceId)
    }

    // In the all the teams, add this user as the member
    for(let team of invitedTeams) {
      const teamDoc = await Team.findById(team.workspaceId).exec()
      teamDoc.members.push(user._id)
      await teamDoc.save()
    }

    await user.save()

    await sendEmailOnSignUp({
      email: email,
      firstName: firstName,
      lastName: lastName
    })

    return;
  } catch (error) {
    console.log(error);
    logger.error({
      message: "Error in signup",
      error,
    });
    return;
  }
};
