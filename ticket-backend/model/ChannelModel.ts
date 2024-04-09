import mongoose, { Schema } from 'mongoose';

const widgetButtonSettingSchema = new Schema({
    widgetButtonColor: String,
    widgetLogo: String,
});

const widgetHeaderSectionSchema = new Schema({
    topBannerColor: String,
    topLogo: String,
    mainHeading: String,
    subHeading: String,
    textColor: String,
    strokeColor: String,
});

const miscellaneousSchema = new Schema({
    showBranding: Boolean,
});

const widgetBehaviorSchema = new Schema({
    collectUserEmail: Boolean,
    title: String,
    subTitle: String,
    emailTitle: String,
    emailSubTitle: String,
    placeholderTextForEmailCapture: String,
    placeholderTextForMessageCapture: String,
    autoReply: String,
    agentName: String,
    agentProfilePic: String,
});

const operatingHoursSchema = new Schema({
    to: Date,
    from: Date,
    enableOperatingHours: Boolean,
    hideNewConversationButtonWhenOffline: Boolean,
    hideWidgetWhenOffline: Boolean,
    timezone: String,
    autoReplyMessageWhenOffline: String,
});

const inChatWidgetSchema = new Schema({
    topLogo: String,
    title: String,
    subTitle: String,
    link: String,
    enabled: Boolean
});

const userAvatarsSchema = new Schema({
    
    enableUserAvatars: Boolean,
      userAvatarsLinks: [
        {
          link: String,
          enabled: Boolean
        }
      ],
      additonalUserAvatars: String
})

const channelSchema = new Schema({
    name: String,
    slackChannelId:{type:String},
    emailNewTicketNotification:{type:Boolean,default:false},
    accessToken:{type:String},
    appearance: {
        newConversationButton: {
            buttonColor: String,
            title: String,
            textColor: String,
            subTitle: String,
        },
        widgetButtonSetting: widgetButtonSettingSchema,
        widgetHeaderSection: widgetHeaderSectionSchema,
        miscellaneous: miscellaneousSchema,
        userAvatars: userAvatarsSchema,
    },
    behavior: {
        widgetBehavior: widgetBehaviorSchema,
        avatarSetting: {
            avatarType: String,
        },
        operatingHours: operatingHoursSchema,
    },
    workspaceId: String,
    channelId: String,
    inChatWidgets: [inChatWidgetSchema],
    members: [String],
},{
    timestamps:true
});

const ChannelModel = mongoose.model('channels', channelSchema);

export default ChannelModel;
