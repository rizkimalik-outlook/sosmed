import { 
    UrlWS,
    UrlAttachmentChat,
    UrlAttachmentSosmed,
    UrlImageFeed,
    UrlImageProfile,
    UrlAttachAgent,
    UrlAttachCust,

    DataConversation,
    TxtCustomerName,
	options,
    images,
    files,
    audios,
    videos

} from "./const_elements.js";


const LoadConversation = async (ChatIDNya, UserIDNya, EmailNya) => {
    DataConversation.innerHTML = ''; //clear body
    try {
        const config = {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                Data1:"LoadConversation",
                Data2:ChatIDNya,
                Data3:UserIDNya,
                Data4:EmailNya,
                Data5:"Chat"
            })
        }
        const res = await fetch(UrlWS, config);
        const json = await res.json();
        const raw = json.data;
        // console.log(raw);

        if(res.ok){
            let html = "";
            let profile = "";
            
            for (let i = 0; i < raw.length; i++) {
                
                let MsgText;
                const EncodeMessage = raw[i].Pesan.replace(/\r?\n/g, '<br>');
                let attachment = `${UrlAttachmentSosmed}/${raw[i].Filename}`;
                let TipeFile = [null, ''].includes(raw[i].Filename) == true ? '' : raw[i].Filename.split('.')[1].toLowerCase();
                // const EncodeMessage = $('<div />').text(raw[i].Pesan).html();

                let Channel = raw[i].AssignTo;
                if (Channel == "FBMessenger"){
                    profile = options.messenger.icon;
                    if (raw[i].FlagTo == "Agent") {
                        attachment = `${UrlAttachAgent}/${raw[i].Filename}`;
                    }
                    else{
                        attachment = `${UrlAttachCust}/${raw[i].Filename}`;
                    }
                }
                else if (Channel == "FBMention"){
                    profile = UrlImageProfile+'/'+raw[i].UserID+'.jpg';
                }
                else if (Channel == "DMTwitter"){ 
                    profile = options.twitter_dm.icon;
                    if (raw[i].FlagTo == "Agent") {
                        attachment = `${UrlAttachmentChat}/${raw[i].Filename}`;
                    }
                    else{
                        attachment = `${UrlAttachCust}/${raw[i].Filename}`;
                    }
                }
                else if (Channel == "TWMention"){
                    profile = UrlImageProfile+'/'+raw[i].UserID+'.jpg';
                    if (raw[i].FlagTo == "Agent") {
                        attachment = `${UrlAttachAgent}/${raw[i].Filename}`;
                    }
                }
                else if (Channel == "WA"){
                    profile = options.whatsapp.icon;
                }
                else{
                    profile = options.chat.icon;
                }

                
                let style = 'height:150px !important;width:auto !important;border-radius:0px !important';
                if(Boolean(raw[i].Filename) === true){
                    let file='';
                    let namafile= raw[i].Pesan == '' ? raw[i].Filename : raw[i].Pesan;

                    if (images.includes(TipeFile) == true) {
                        file = `<img src='${attachment}' style='${style}'><br/> ${namafile} (click to download).`;
                    }
                    else if (files.includes(TipeFile) == true){
                        file = `<i class='fa fa-file-text-o'></i>  ${namafile} (click to download).`;
                    }
                    else if (audios.includes(TipeFile) == true){
                        file = `<audio controls>
                            <source src='${attachment}' type='audio/mpeg'>
                            Your browser does not support the audio tag.
                        </audio>
                        <br/>${namafile} (click to play)`;
                    }
                    else if (videos.includes(TipeFile) == true){
                        file = `<video height='240' controls>
                            <source src='${attachment}' type='video/mp4'>
                            Your browser does not support the video tag.
                        </video>
                        <br/>${namafile} (click to play)`;
                    }
                    MsgText = `<a href='${attachment}' target='_blank'> ${file} </a>`;
                }
                else{
                    MsgText = EncodeMessage;
                } 
                

                if(raw[i].FlagTo == "Cust"){
                    html += `<li class="media received">
                        <div class="avatar border rounded-50 border-2 border-grey">
                            <img src="${profile}" alt="user" class="avatar-img rounded-circle">
                        </div>
                        <div class="media-body">
                            <div class="msg-box">
                                <div>
                                    <strong class='primary-font'>${raw[i].Nama}</strong>
                                    <p>${MsgText}</p>
                                    <span class="chat-time"><i class='fa fa-clock-o'></i> ${raw[i].DateCreate}</span>
                                    <div class="arrow-triangle-wrap">
                                        <div class="arrow-triangle right"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>`;
                }
                else if(raw[i].FlagTo == "Bot"){
                    html += `<li class="media sent">
                        <div class="media-body">
                            <div class="msg-box">
                                <div>
                                    <strong class='primary-font text-white'>${raw[i].Nama}</strong>
                                    <p>${MsgText}</p>
                                    <span class="chat-time"><i class='fa fa-clock-o'></i> ${raw[i].DateCreate}</span>
                                    <div class="arrow-triangle-wrap">
                                        <div class="arrow-triangle left"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="avatar border rounded-50 border-2 border-warning">
                            <img src="${options.bot.icon}" alt="user" class="avatar-img rounded-circle">
                        </div>
                    </li>`;
                }
                else{
                    html += `<li class="media sent">
                        <div class="media-body">
                            <div class="msg-box">
                                <div>
                                    <strong class='primary-font text-white'>${raw[i].Nama}</strong>
                                    <p>${MsgText}</p>
                                    <span class="chat-time"><i class='fa fa-clock-o'></i> ${raw[i].DateCreate}</span>
                                    <div class="arrow-triangle-wrap">
                                        <div class="arrow-triangle left"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="avatar border rounded-50 border-2 border-grey">
                            <img src="${options.agent.icon}" alt="user" class="avatar-img rounded-circle">
                        </div>
                    </li>`;
                }
               
            }
            DataConversation.innerHTML += html;
            
            $(".DataConversation").animate({
                scrollTop: DataConversation.scrollHeight
            }, "fast");
        }
    }
    catch(error){
        console.log(error);
    }

}

const LoadConversationMention = async (obj) => {
    DataConversation.innerHTML = ''; //clear body
    const TextPage = obj.TextPage == null ? '' : obj.TextPage;
    let html = "", ImgMedia = "";

    if (obj.Filename) {
        if (obj.Filename.split('.')[1] == "mp4") {
            ImgMedia = `<video height='240' controls>
                <source src='${UrlImageFeed}/${obj.Filename}' type='video/mp4'>
                Your browser does not support the video tag.
            </video>`;
        }
        else {
            ImgMedia = `<img src="${UrlImageFeed}/${obj.Filename}" class='' alt="Feed Post" style="max-height:300px;">`;
        }
    }
    
    //?Mention Content img media & caption detail
    html += `<div class="card-columns card-column-1">
        <div class="card card-profile-feed mb-0 rounded-bottom-0">
            <div class="card-body">
                <p class="card-text mb-30">${TextPage}</p>
                <div class="feed-img-layout">
                    <center>${ImgMedia}</center>
                </div>
            </div>
            <div class="card-footer justify-content-between">
                <div><a href="#" onclick="document.getElementById('FormDataComment').classList.toggle('hide');"><i class="ion ion-md-chatboxes"></i> <span id="JmlComment">0</span> &nbsp; Comment</a></div>
                <div><a href="${obj.PermalinkUrl}" target="_blank">Permalink Url &nbsp; <i class="ion ion-md-link"></i></a></div>
            </div>
        </div>
        <div class="card card-profile-feed border-top-0 rounded-top-0 hide" id="FormDataComment">
            <div class="card-body" style="overflow:auto;">
                <div class="">
                    <div id="DataComment"></div>
                </div>
            </div>
        </div>
    </div>`;
    DataConversation.innerHTML += html;
    
    
    //?Mention comment & reply
    try {
        const config = {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                Data1:"LoadConversation",
                Data2:obj.ChatID,
                Data3:obj.RoomID,
                Data4:obj.Email,
                Data5:"Mention"
            })
        }
        const res = await fetch(UrlWS, config);
        const json = await res.json();
        const data = json.data;

        document.getElementById('DataComment').innerHTML = '';
        if(json.success){
            let i=0, comment="", profile="";

            //? load percakapan
            while (data[i]) {
                let color="", radio_btnreply="", class_justify="", data_reply="", MsgText="";
                
                String.prototype.replaceAll = function (search, replacement) {
                    let target = this;
                    return target.split(search).join(replacement);
                }
                let StrPesan = (data[i].Pesan).replaceAll(`@[${data[i].CustomerID}]`, `<strong>${TxtCustomerName.textContent}</strong>`);
                let attachment = `${UrlAttachmentSosmed}/${data[i].Filename}`;
                let TipeFile = [null, ''].includes(data[i].Filename) == true ? '' : (data[i].Filename).split('.')[1].toLowerCase();
                let style = 'height:150px !important;width:auto !important;border-radius:0px !important';

                let Channel = data[i].AssignTo.split('_')[0];
                if(data[i].FlagTo == "Agent"){
                    profile = options.agent.icon;
                }
                else if (Channel == "FBMention"){
                    profile = UrlImageProfile+'/'+data[i].UserID+'.jpg';
                }
                else if (Channel == "TWMention"){
                    profile = UrlImageProfile+'/'+data[i].UserID+'.jpg';
                    if (data[i].FlagTo == "Agent") {
                        attachment = `${UrlAttachAgent}/${data[i].Filename}`;
                    }
                }

                if(Boolean(data[i].Filename) === true){
                    let file='';
                    let namafile= data[i].Pesan == '' ? data[i].Filename : data[i].Pesan;

                    if (images.includes(TipeFile) == true) {
                        file = `<img src='${attachment}' style='${style}'><br/> ${namafile} (click to download).`;
                    }
                    else if (files.includes(TipeFile) == true){
                        file = `<i class='fa fa-file-text-o'></i>  ${namafile} (click to download).`;
                    }
                    else if (audios.includes(TipeFile) == true){
                        file = `<audio controls>
                            <source src='${attachment}' type='audio/mpeg'>
                            Your browser does not support the audio tag.
                        </audio>
                        <br/>${namafile} (click to play)`;
                    }
                    else if (videos.includes(TipeFile) == true){
                        file = `<video height='240' controls>
                            <source src='${attachment}' type='video/mp4'>
                            Your browser does not support the video tag.
                        </video>
                        <br/>${namafile} (click to play)`;
                    }
                    MsgText = `<a href='${attachment}' target='_blank'> ${file} </a>`;
                }
                else{
                    MsgText = StrPesan;
                } 

                
                if (data[i].FlagTo == "Cust") {
                    if (data[i].PesanReplyCust) {
                        data_reply = `<blockquote class="border-left border-10 border-info text-light font-12 pa-5 mb-5 bg-light-10">
                            <p><em>${data[i].PesanReplyCust}</em></p>
                        </blockquote>`;
                    }
                    
                    radio_btnreply = `<div>
                        <label for="postid${data[i].AlamatIP}" class="badge badge-light mr-10 mb-0">reply</label>
                        <input type="radio" id="postid${data[i].AlamatIP}" name="PostID" value="${data[i].AlamatIP}" data-post="${StrPesan}" class="mb-0" onclick="AlamatIP.value=this.value">
                    </div>`;
                    class_justify = `justify-content-between`;
                }
                
                if (data[i].FlagTo == "Agent") {
                    data_reply = `<blockquote class="border-left border-10 border-info text-light font-12 pa-5 mb-5 bg-light-10">
                        <p><em>${data[i].PesanReply}</em></p>
                    </blockquote>`;
                }

                comment += `<div class="media">
                    <div class="media-img-wrap d-flex mr-0">
                        <div class="avatar avatar-xs">
                            <img src="${profile}" alt="user" class="avatar-img rounded-circle">
                        </div>
                    </div>
                    <div class="media-body">
                        <div class="mb-10 border rounded-10 pa-10 ${color}">
                            <div class="text-capitalize font-14 font-weight-500 text-dark">${data[i].Nama}</div>
                            <div class="font-15">
                                ${data_reply}
                                <p>${MsgText}</p>
                            </div>
                            <div class="d-flex mt-5 ${class_justify}">
                                <div>
                                    <span class="font-11 text-light mr-15 mb-0">${data[i].DateCreate}</span>
                                    <a href="#" onclick="document.getElementById('FormDataReply${data[i].AlamatIP}').classList.toggle('hide');" class="font-11 text-light text-capitalize hide">
                                        <span id="JmlReply${data[i].AlamatIP}">0</span> reply
                                    </a>
                                </div>
                                ${radio_btnreply}
                            </div>
                        </div>

                        <div class="hide" id="FormDataReply${data[i].AlamatIP}"> 
                            <div id="DataReply${data[i].AlamatIP}"></div>
                            <div class="media"> 
                                <div class="media-img-wrap d-flex mr-0">
                                    <div class="avatar avatar-xs">
                                        <img src="${options.agent.icon}" alt="user" class="avatar-img rounded-circle">
                                    </div>
                                </div>
                                <div class="media-body">
                                    <div class="form-group mb-15">
                                        <div class="input-group">
                                            <input type="text" class="form-control rounded-input border border-light-10" placeholder="Type Reply...">
                                            <div class="input-group-append hide">
                                                <button class="btn btn-outline-light" type="button">file</button>
                                            </div>
                                            <div class="input-group-append">
                                                <button class="btn btn-outline-light btn-rounded border border-light-10" type="button"><i class="fa fa-send pr-5"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>`;

                i++;
            }
            document.getElementById('JmlComment').innerText = data.length;
            document.getElementById('DataComment').innerHTML += comment;
        }
    } 
    catch (error) {
        console.log(error);	
    }

}

const LoadConversationFeed = async (obj) => {
    DataConversation.innerHTML = ''; //clear body
    const TextPage = obj.TextPage == null ? '' : obj.TextPage;
    let html = "", ImgMedia = "";

    if (obj.Filename) {
        if (obj.Filename.split('.')[1] == "mp4") {
            ImgMedia = `<video height='240' controls>
                <source src='${UrlImageFeed}/${obj.Filename}' type='video/mp4'>
                Your browser does not support the video tag.
            </video>`;
        }
        else {
            ImgMedia = `<img src="${UrlImageFeed}/${obj.Filename}" class='' alt="Feed Post" style="max-height:300px;">`;
        }
    }
    
    //?Feed Content img media & caption detail
    html += `<div class="card-columns card-column-1">
        <div class="card card-profile-feed mb-0 rounded-bottom-0">
            <div class="card-body">
                <p class="card-text mb-30">${TextPage}</p>
                <div class="feed-img-layout">
                    <center>${ImgMedia}</center>
                </div>
            </div>
            <div class="card-footer justify-content-between">
                <div><a href="#" onclick="document.getElementById('FormDataComment').classList.toggle('hide');"><i class="ion ion-md-chatboxes"></i> <span id="JmlComment">0</span> &nbsp; Comment</a></div>
                <div><a href="${obj.PermalinkUrl}" target="_blank">Permalink Url &nbsp; <i class="ion ion-md-link"></i></a></div>
            </div>
        </div>
        <div class="card card-profile-feed border-top-0 rounded-top-0 hide" id="FormDataComment">
            <div class="card-body" style="overflow:auto;">
                <div class="">
                    <div id="DataComment"></div>
                </div>
            </div>
        </div>
    </div>`;
    DataConversation.innerHTML += html;
    
    
    //?Feed comment & reply
    try {
        const config = {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                Data1:"LoadConversation",
                Data2:obj.ChatID,
                Data3:obj.RoomID,
                Data4:obj.Email,
                Data5:"Feed"
            })
        }
        const res = await fetch(UrlWS, config);
        const json = await res.json();
        const data = json.data;

        document.getElementById('DataComment').innerHTML = '';
        if(json.success){
            let i=0, comment="", profile="";

            //? load percakapan
            while (data[i]) {
                let color="", radio_btnreply="", class_justify="", data_reply="", MsgText="";
                
                String.prototype.replaceAll = function (search, replacement) {
                    let target = this;
                    return target.split(search).join(replacement);
                }
                let StrPesan = (data[i].Pesan).replaceAll(`@[${data[i].CustomerID}]`, `<strong>${TxtCustomerName.textContent}</strong>`);
                let attachment = `${UrlAttachmentSosmed}/${data[i].Filename}`;
                let TipeFile = [null, ''].includes(data[i].Filename) == true ? '' : (data[i].Filename).split('.')[1].toLowerCase();
                let style = 'height:150px !important;width:auto !important;border-radius:0px !important';

                if(Boolean(data[i].Filename) === true){
                    let file='';
                    let namafile= data[i].Pesan == '' ? data[i].Filename : data[i].Pesan;

                    if (images.includes(TipeFile) == true) {
                        file = `<img src='${attachment}' style='${style}'><br/> ${namafile} (click to download).`;
                    }
                    else if (files.includes(TipeFile) == true){
                        file = `<i class='fa fa-file-text-o'></i>  ${namafile} (click to download).`;
                    }
                    else if (audios.includes(TipeFile) == true){
                        file = `<audio controls>
                            <source src='${attachment}' type='audio/mpeg'>
                            Your browser does not support the audio tag.
                        </audio>
                        <br/>${namafile} (click to play)`;
                    }
                    else if (videos.includes(TipeFile) == true){
                        file = `<video height='240' controls>
                            <source src='${attachment}' type='video/mp4'>
                            Your browser does not support the video tag.
                        </video>
                        <br/>${namafile} (click to play)`;
                    }
                    MsgText = `<a href='${attachment}' target='_blank'> ${file} </a>`;
                }
                else{
                    MsgText = StrPesan;
                } 


                if(data[i].FlagTo == "Agent"){
                    profile = options.agent.icon;
                    color = "bg-smoke-light-5";
                }
                else if(data[i].AssignTo.split('_')[0] == "IGFeed"){
                    profile = options.instagram.icon;
                }
                else{
                    profile = UrlImageProfile+'/'+data[i].UserID+".jpg";
                }
                
                if (data[i].FlagTo == "Cust") {
                    if (data[i].PesanReplyCust) {
                        data_reply = `<blockquote class="border-left border-10 border-info text-light font-12 pa-5 mb-5 bg-light-10">
                            <p><em>${data[i].PesanReplyCust}</em></p>
                        </blockquote>`;
                    }
                    
                    radio_btnreply = `<div>
                        <label for="postid${data[i].AlamatIP}" class="badge badge-light mr-10 mb-0">reply</label>
                        <input type="radio" id="postid${data[i].AlamatIP}" name="PostID" value="${data[i].AlamatIP}" data-post="${StrPesan}" class="mb-0" onclick="AlamatIP.value=this.value">
                    </div>`;
                    class_justify = `justify-content-between`;
                }
                
                if (data[i].FlagTo == "Agent") {
                    data_reply = `<blockquote class="border-left border-10 border-info text-light font-12 pa-5 mb-5 bg-light-10">
                        <p><em>${data[i].PesanReply}</em></p>
                    </blockquote>`;
                }

                comment += `<div class="media">
                    <div class="media-img-wrap d-flex mr-0">
                        <div class="avatar avatar-xs">
                            <img src="${profile}" alt="user" class="avatar-img rounded-circle">
                        </div>
                    </div>
                    <div class="media-body">
                        <div class="mb-10 border rounded-10 pa-10 ${color}">
                            <div class="text-capitalize font-14 font-weight-500 text-dark">${data[i].Nama}</div>
                            <div class="font-15">
                                ${data_reply}
                                <p>${MsgText}</p>
                            </div>
                            <div class="d-flex mt-5 ${class_justify}">
                                <div>
                                    <span class="font-11 text-light mr-15 mb-0">${data[i].DateCreate}</span>
                                    <a href="#" onclick="document.getElementById('FormDataReply${data[i].AlamatIP}').classList.toggle('hide');" class="font-11 text-light text-capitalize hide">
                                        <span id="JmlReply${data[i].AlamatIP}">0</span> reply
                                    </a>
                                </div>
                                ${radio_btnreply}
                            </div>
                        </div>

                        <div class="hide" id="FormDataReply${data[i].AlamatIP}"> 
                            <div id="DataReply${data[i].AlamatIP}"></div>
                            <div class="media"> 
                                <div class="media-img-wrap d-flex mr-0">
                                    <div class="avatar avatar-xs">
                                        <img src="${options.agent.icon}" alt="user" class="avatar-img rounded-circle">
                                    </div>
                                </div>
                                <div class="media-body">
                                    <div class="form-group mb-15">
                                        <div class="input-group">
                                            <input type="text" class="form-control rounded-input border border-light-10" placeholder="Type Reply...">
                                            <div class="input-group-append hide">
                                                <button class="btn btn-outline-light" type="button">file</button>
                                            </div>
                                            <div class="input-group-append">
                                                <button class="btn btn-outline-light btn-rounded border border-light-10" type="button"><i class="fa fa-send pr-5"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>`;

                i++;
            }
            document.getElementById('JmlComment').innerText = data.length;
            document.getElementById('DataComment').innerHTML += comment;
        }
    } 
    catch (error) {
        console.log(error);	
    }

}


export {
    LoadConversation,
    LoadConversationMention,
    LoadConversationFeed
}
