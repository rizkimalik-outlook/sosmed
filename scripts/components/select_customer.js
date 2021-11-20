import {  
    UrlImageProfile,
    FormSend,
    ChatAktif,
    ChatOptions,
    TxtCustomerID,
    TxtCustomerName,
    ImgCustomerIcon,
    CustIdentity,
    Email,
    ChatID,
    CustomerID,
    CustID_tChat,
    UserID,
    PageID,
    RoomID,
    AlamatIP,
    AssignTo,
    BtnEndChat,
    BtnFileAttach,
	options
} from "./const_elements.js";

import {  
    LoadConversation,
    LoadConversationMention,
    LoadConversationFeed
} from "./load_conversation.js";

import {  
	ClearFormSend,
    BlockFormSend,
} from "./form_elements.js";

import DataAllCustomer from "./list_customers.js";


const SelectCustomer = async (obj) => {
    // console.log(obj);
    if (obj.NamaCustomer != "New Customer") {
        BtnEndChat.classList.remove('hide');
    }
    else {
        BtnEndChat.classList.add('hide');
    } 
    
    
    FormSend.classList.remove('hide');
    ChatAktif.classList.remove('hide');
    ChatOptions.classList.remove('hide');
    BlockFormSend(false);
    ClearFormSend();

    let profile = "";
    let identity = "";
    let Channel = obj.AssignTo;
    // let Channel = obj.AssignTo.split('_')[0];
    if (Channel == "FBMessenger"){
        profile = options.messenger.icon;
        identity = obj.Nama;
        BtnFileAttach.classList.remove('hide');
    }
    else if (Channel == "IGFeed"){
        profile = options.instagram.icon;
        identity = obj.Nama;
        BtnFileAttach.classList.add('hide');
    }
    else if (Channel == "FBFeed"){
        profile = UrlImageProfile+'/'+obj.UserID+".jpg";
        identity = obj.Nama;
        BtnFileAttach.classList.add('hide');
    }
    else if (Channel == "FBMention"){
        profile = UrlImageProfile+'/'+obj.UserID+".jpg";
        identity = obj.Nama;
        BtnFileAttach.classList.add('hide');
    }
    else if (Channel == "DMTwitter"){
        profile = options.twitter_dm.icon;
        identity = obj.Nama;
        BtnFileAttach.classList.remove('hide');
    }
    else if (Channel == "TWMention"){
        profile = UrlImageProfile+'/'+obj.UserID+'.jpg';
        identity = obj.Nama;
        BtnFileAttach.classList.remove('hide');
    }
    else if (Channel == "WA"){
        profile = options.whatsapp.icon;
        identity = obj.Email;
        BtnFileAttach.classList.remove('hide');
    }
    else{
        profile = options.chat.icon;
        identity = obj.Email;
        BtnFileAttach.classList.remove('hide');
    }

    UserID.value = obj.UserID;
    CustomerID.value = obj.CustomerID;
    CustID_tChat.value = obj.CustID_tChat;
    ChatID.value = obj.ChatID;
    Email.value = obj.Email;
    CustIdentity.value = identity;
    PageID.value = obj.GroupID;
    AssignTo.value = obj.AssignTo;
    RoomID.value = obj.RoomID;
    AlamatIP.value = ""; // clear value data
    
    TxtCustomerID.textContent = identity;
    TxtCustomerName.textContent = obj.Nama;
    ImgCustomerIcon.innerHTML = `<img src="${profile}" alt="user" class="avatar-img rounded-circle">`;

    DataAllCustomer(AgentName.value).then(() => {
        if(Channel == 'IGFeed' || Channel == 'FBFeed'){
            LoadConversationFeed(obj);
        }
        else if(Channel == 'TWMention' || Channel == 'FBMention'){
            LoadConversationMention(obj);
        }
        else{
            LoadConversation(obj.ChatID, obj.UserID, obj.Email);
        }
    });
}


export default SelectCustomer;