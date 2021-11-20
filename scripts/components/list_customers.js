import { 
    UrlWS,
    UrlImageFeed,
    UrlImageProfile,
    ListAllCustomer,
    JmlLive,
    TxtSearchCustomer,
    ChatID,
    UserID,
    RoomID,
	options
} from "./const_elements.js";

import SelectCustomer from './select_customer.js';


const DataAllCustomer = async (AgentNya) => {
    try {
        const config = {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                Data1:"ListAllCustomer",
                Data2:AgentNya,
                Data3:"",
                Data4:"",
                Data5:""
            })
        }

        const res = await fetch(UrlWS, config);
        const obj = await res.json();
        const raws = obj.data;
        // console.log(raw);

        let html = "";
        let pagename = "";
        let icon = "";
        let profile = ""; 
        let identity = "";
        let img_feed = "";

        if (res.ok) {
            raws.map((raw, index) => {
                // console.log(raw, index);
                let aktif = "";
                // let selectParams = JSON.stringify(raw);
                let Channel = raw.AssignTo;
                let NewChat = raw.NewChat > 0 ? `<span class="badge badge-info badge-pill"><span>${raw.NewChat}</span></span>` : '<span class="badge badge-soft-secondary badge-pill"><span><i class="fa fa-check"></i></span></span>';
                let NamaCustomer = raw.NamaCustomer == 'New Customer' ? `<strong class="text-info">${raw.NamaCustomer}</strong>` : raw.NamaCustomer;
                
                if(Channel == 'FBFeed' || Channel == 'IGFeed'){
                    if(ChatID.value == raw.ChatID && RoomID.value == raw.RoomID){
                        aktif = "read-chat active-user";
                    }
                }
                else{
                    if(ChatID.value == raw.ChatID ){
                        aktif = "read-chat active-user";
                        UserID.value = raw.UserID; //set id ketika customer relogin
                    }
                }

                if (Channel == "FBMessenger"){
                    icon = options.messenger.icon;
                    profile = options.messenger.icon;
                    pagename = raw.PageName;
                    identity = raw.Nama;
                }
                else if (Channel == "IGFeed"){
                    icon = options.instagram.icon;
                    profile = options.instagram.icon;
                    pagename = raw.PageName;
                    img_feed = UrlImageFeed+'/'+raw.imgbase;
                    identity = raw.Nama;
                }
                else if (Channel == "FBFeed"){
                    icon = options.facebook.icon;
                    profile = UrlImageProfile+'/'+raw.UserID+".jpg";
                    pagename = raw.PageName;
                    img_feed = UrlImageFeed+'/'+raw.RoomID+".jpg";
                    identity = raw.Nama;
                }
                else if (Channel == "FBMention"){
                    icon = options.facebook.icon;
                    profile = UrlImageProfile+'/'+raw.UserID+".jpg";
                    pagename = raw.PageName;
                    identity = raw.Nama;
                }
                else if (Channel == "DMTwitter"){
                    icon = options.twitter_dm.icon;
                    profile = options.twitter_dm.icon;
                    pagename = raw.PageName;
                    identity = raw.Nama;
                }
                else if (Channel == "TWMention"){
                    icon = options.twitter.icon;
                    profile = UrlImageProfile+'/'+raw.UserID+'.jpg';
                    pagename = raw.PageName;
                    identity = raw.Nama;
                }
                else if (Channel == "WA"){
                    icon = options.whatsapp.icon;
                    profile = options.whatsapp.icon;
                    pagename = options.whatsapp.label;
                    identity = raw.Email;
                }
                else{
                    icon = options.chat.icon;
                    profile = options.chat.icon;
                    pagename = options.chat.label;
                    identity = raw.Email;
                }

                // html += `<a href="javascript:void(0)" class="media read-chat border-bottom ${aktif}" onclick="SelectCustomer(${selectParams})" >
                html += `<a href="javascript:void(0)" class="media read-chat border-bottom ${aktif}" id="cust-${raw.ChatID}" >
                <div class="media-img-wrap mt-10">
                        <div class="avatar border rounded-50 border-2 border-grey"><img src="${profile}" class="avatar-img rounded-circle"></div>
                    </div>
                    <div class="media-body">
                        <div>
                            <div class="user-name">${NamaCustomer}</div>
                            <div class="user-last-chat">${identity}</div>
                            <div class="user-last-chat"><img src="${icon}" class="avatar-img rounded-circle mt-5" height="15" width="15"> ${Channel} </div>
                        </div>
                        <div>
                            <div class="last-chat-time">${raw.DateCreate}</div>
                            <div class="last-chat-time my-5">${NewChat}</div>
                            <div class="last-chat-time">${pagename}</div>
                        </div>
                    </div>
                </a>`;

            });

            JmlLive.textContent = raws.length; 
        
        }
        ListAllCustomer.innerHTML = "";
        ListAllCustomer.innerHTML += html;

        //? CARI CUSTOMER
        const listCust = ListAllCustomer.getElementsByTagName("a");
        TxtSearchCustomer.addEventListener("keyup",(e)=>{
            e.preventDefault();

            for (let i in listCust) {
                const mediaBody = listCust[i].getElementsByClassName("media-body")[0];
                const txtValue = mediaBody.textContent || mediaBody.innerText;

                if (txtValue.toLowerCase().indexOf(TxtSearchCustomer.value) > -1) {
                    listCust[i].style.display = '';
                }
                else{
                    listCust[i].style.display = 'none';
                }
            }
            return;
        });

        //? SELECT CUSTOMER
        raws.map((raw, index) => {
            document.getElementById(`cust-${raw.ChatID}`)
            .addEventListener('click', () => {
                SelectCustomer(raw);
            });
        });

    } 
    catch (error) {
        console.log(error);
    }
}

export default DataAllCustomer;