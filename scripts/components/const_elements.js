function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    let regexS = "[\\?&]" + name + "=([^&#]*)";
    let regex = new RegExp(regexS);
    let results = regex.exec(url);
    return results == null ? null : results[1];
}


//? define URL
const userlogin = gup('userlogin', location.search);

//? define whatsapp
const ApiKeyWA = 'c8dfe29e3a0946519cceb81b5f7e001f8f8f72ba';
const SenderWA = '6281218465767';

// const UrlSignalR = 'https://10.255.3.241/wschatlive/signalr';
// const UrlWS = 'https://10.255.3.241/ws_btn/SP_SosialMedia';
// const UrlAttachment = 'https://10.255.3.241/wschatlive/signalr/FileUpload';

const GlobalUrl = 'https://selindo.mendawai.com';
// const GlobalUrl = 'https://invision.ddns.net:30008';
const UrlWS = `${GlobalUrl}/ApiMendawai/SP_SosialMedia`;
const UrlApiMendawai = `${GlobalUrl}/ApiMendawai`;
const UrlSignalR = `${GlobalUrl}:30008/SignalR`;
// const UrlAttachmentChat = `${GlobalUrl}/SignalR/FileAttachment`;
const UrlAttachmentChat = `${GlobalUrl}:30008/FileAttachment`;
const UrlAttachmentSosmed = `${GlobalUrl}/ApiBounty2/ImageSave`;
const UrlImageFeed = `${GlobalUrl}/ApiBounty2/ImageSaveFeed`;
const UrlImageProfile = `${GlobalUrl}/ApiBounty2/ImageSaveProfile`;
const UrlAttachAgent = `${GlobalUrl}/ApiTeleport/img_from_agent`;
const UrlAttachCust = `${GlobalUrl}/ApiBounty2/Attach_from_user`;



//? define Chat Conversation
const Messages = document.getElementById('Messages');
const FileAttach = document.getElementById('FileAttach');
const DataConversation = document.getElementById('DataConversation');
const ListAllCustomer = document.getElementById('ListAllCustomer');
const FormSend = document.getElementById('FormSend');

//? define Detail Customer
const JmlQue = document.getElementById('JmlQue');
const JmlLive = document.getElementById('JmlLive');
const AgentStatus = document.getElementById('AgentStatus');
const ChatAktif = document.getElementById('ChatAktif');
const ChatOptions = document.getElementById('ChatOptions');
const TxtCustomerID = document.getElementById('TxtCustomerID'); //custid dari tchat
const TxtCustomerName = document.getElementById('TxtCustomerName');
const ImgCustomerIcon = document.getElementById('ImgCustomerIcon');
const TxtSearchCustomer = document.getElementById('TxtSearchCustomer');
const BtnCustProfile = document.getElementById('BtnCustProfile');

//? define Hidden Feature
const CustIdentity = document.getElementById('CustIdentity');
const Email = document.getElementById('Email');
const ChatID = document.getElementById('ChatID');
const CustomerID = document.getElementById('CustomerID');  //custid dari mcustomer
const CustID_tChat = document.getElementById('CustID_tChat');  //custid dari tchat
const UserID = document.getElementById('UserID');
const AgentID = document.getElementById('AgentID');
const AgentName = document.getElementById('AgentName');
const PageID = document.getElementById('PageID');
const RoomID = document.getElementById('RoomID');
const AlamatIP = document.getElementById('AlamatIP');
const AssignTo = document.getElementById('AssignTo');
const Resultbase64 = document.getElementById('Resultbase64');
const SrcResultbase64 = document.getElementById('SrcResultbase64');
const NameResultbase64 = document.getElementById('NameResultbase64');

//? define Button
const BtnSendMsg = document.getElementById('BtnSendMsg');
const BtnEndChat = document.getElementById('BtnEndChat');
const BtnFileAttach = document.getElementById('BtnFileAttach');
const BtnIconNotif = window.parent.document.getElementById('BtnIconNotif');

const options = {
    chat: {
        icon: 'dist/img/icon/chat.png',
        label: 'Chatting Apps'
    },
    messenger: {
        icon: 'dist/img/icon/messenger.png',
        label: 'Facebook Messenger'
    },
    facebook: {
        icon: 'dist/img/icon/facebook.png',
        label: 'Facebook Feed'
    },
    twitter: {
        icon: 'dist/img/icon/twitter.png',
        label: 'Instagram Feed'
    },
    twitter_dm: {
        icon: 'dist/img/icon/twitter_dm.png',
        label: 'Instagram Feed'
    },
    instagram: {
        icon: 'dist/img/icon/instagram.png',
        label: 'Instagram Feed'
    },
    instagram_dm: {
        icon: 'dist/img/icon/instagram_dm.png',
        label: 'Instagram Feed'
    },
    whatsapp: {
        icon: 'dist/img/icon/whatsapp.png',
        label: 'Whatsapp Apps'
    },
    agent: {
        icon: 'dist/img/agent.png',
        label: 'User Icon'
    },
    bot: {
        icon: 'dist/img/bot.png',
        label: 'Bot Icon'
    }
}

const images = ['jpg', 'png', 'gif', 'svg'];
const files = ['pdf', 'xlsx', 'docx', 'zip', 'rar', 'txt'];
const audios = ['mp3', 'wav', 'ogg', 'wav', 'aac' , 'wma'];
const videos = ['mp4', 'mpg', 'webm', 'wmv'];


export {
    userlogin,
    GlobalUrl,
    UrlWS,
    UrlApiMendawai,
    UrlSignalR,
    UrlAttachmentChat,
    UrlAttachmentSosmed,
    UrlImageFeed,
    UrlImageProfile,
    UrlAttachAgent,
    UrlAttachCust,

    ApiKeyWA,
    SenderWA,

    Messages,
    FileAttach,
    DataConversation,
    ListAllCustomer,
    FormSend,

    JmlQue,
    JmlLive,
    AgentStatus,
    ChatAktif,
    ChatOptions,
    TxtCustomerID,
    TxtCustomerName,
    ImgCustomerIcon,
    TxtSearchCustomer,
    BtnCustProfile,

    CustIdentity,
    Email,
    ChatID,
    CustomerID,
    CustID_tChat,
    UserID,
    AgentID,
    AgentName,
    PageID,
    RoomID,
    AlamatIP,
    AssignTo,
    Resultbase64,
    SrcResultbase64,
    NameResultbase64,

    BtnSendMsg,
    BtnEndChat,
    BtnFileAttach,
    BtnIconNotif,

    options,
    images,
    files,
    audios,
    videos,

}