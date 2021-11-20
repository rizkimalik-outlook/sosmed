import { 
    Messages,
    DataConversation,
    TxtCustomerName,
    AgentName,
    AssignTo,
    Resultbase64,
    SrcResultbase64,
    NameResultbase64,
    BtnSendMsg,
    BtnFileAttach,
	options
} from "./const_elements.js";

const ClearFormSend = () => {
    //reset file yg terkirim
    Messages.value = '';
    Resultbase64.value = '';
    NameResultbase64.value = '';
    SrcResultbase64.value = '';
}

const BlockFormSend = (Boolean) => {
    Messages.disabled  = Boolean;
    BtnSendMsg.disabled  = Boolean;
    BtnFileAttach.disabled  = Boolean;
}

const EncodeImageFileAsURL = (element) => {
    const file = element.files[0];
    const reader = new FileReader();
    const size = file.size;
    const type = (file.type).split('/')[0];
    const format = (file.name).split('.')[1];
    // console.log(format);

    let d = new Date();
    let year = d.getFullYear();
    let month = addZero(d.getMonth());
    let date = addZero(d.getDate());
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    const nama_file = `${year}${month}${date}${h}${m}${s}`;
    
    if(size >= 2000000){
        swal({
            title: "Gagal.",
            text: "File tidak bisa lebih dari 2MB.",
            icon: "error",
            button: "Ok"
        });
        ClearFormSend(); //reset ulang
    }
    else{
        if (AssignTo.value == "FBMessenger") {
            reader.onloadend = function () {
                const solution = reader.result.split("base64,")[1];
                Resultbase64.value = solution;
                NameResultbase64.value = `${nama_file}.${format}`;
                Messages.value = element.files[0].name +" ("+ (size / 1000).toFixed(2) +" KB)";
                SrcResultbase64.value = reader.result;
            }
            reader.readAsDataURL(file);
        }
        
        else if (AssignTo.value == "DMTwitter" || AssignTo.value == "TWMention") {
            if (type == "image") {
                reader.onloadend = function () {
                    const solution = reader.result.split("base64,")[1];
                    Resultbase64.value = solution;
                    NameResultbase64.value = `${nama_file}.${format}`;
                    Messages.value = element.files[0].name +" ("+ (size / 1000).toFixed(2) +" KB)";
                    SrcResultbase64.value = reader.result;
                }
                reader.readAsDataURL(file);
            }
            else{
                swal({
                    title: "Gagal.",
                    text: "Hanya bisa Format Image.",
                    icon: "warning",
                    button: "Ok"
                });
                ClearFormSend();
            }
        }
        else if (type == "video") {
            swal({
                title: "Gagal.",
                text: "Format Video tidak bisa terkirim.",
                icon: "warning",
                button: "Ok"
            });
            ClearFormSend(); //reset ulang
        }
    }
}

const CheckStatusSend = (object) => { 
    // console.log(object);
    if (object.Result == "True") {
        swal({
            title: "Success.",
            text: "Pesan telah terkirim",
            icon: "success",
            button: "Ok",
            timer: 2000
        });
    }
    else{
        BlockFormSend(false);
        swal({
            title: "Pesan Tidak Terkirim.",
            text: object.Data1,
            icon: "error",
            button: "Ulang"
        });
    }
}

const ViewMsgToHTML = (MsgText, DateTime) => {
    //Post message to View HTML
    if(AssignTo.value == 'FBFeed' || AssignTo.value == 'IGFeed' || AssignTo.value == 'FBMention' || AssignTo.value == 'TWMention'){
        const DataComment = document.getElementById('DataComment'); //parent
        const JmlComment = document.getElementById('JmlComment');
        const NewComment = document.createElement('div'); //child
        const PostID = document.querySelector("input[name=PostID]:checked");

        let UserTag = "";
        if (AssignTo.value == 'FBFeed' || AssignTo.value == 'FBMention') {
            UserTag = `<strong>${TxtCustomerName.textContent}</strong>`;
        }

        const CommentHtml = `<div class="media">
            <div class="media-img-wrap d-flex mr-0">
                <div class="avatar avatar-xs">
                    <img src="${options.agent.icon}" alt="user" class="avatar-img rounded-circle">
                </div>
            </div>
            <div class="media-body">
                <div class="mb-10 border rounded-10 pa-10 bg-smoke-light-5">
                    <div class="text-capitalize font-14 font-weight-500 text-dark">${AgentName.value}</div>
                    <div class="font-15">
                        <blockquote class="border-left border-10 border-info text-light font-12 pa-5 mb-5 bg-light-10">
                            <p><em>${PostID.getAttribute('data-post')}</em></p>
                        </blockquote>
                        <p>${UserTag} ${MsgText}</p>
                    </div>
                    <div class="d-flex mt-5">
                        <span class="font-11 text-light mr-15"> ${DateTime} </span>
                        <a href="#" class="font-11 text-light text-capitalize font-weight-500 hide">
                            <span id="">0</span> reply
                        </a>
                    </div>
                </div>
            </div>
        </div>`;


        NewComment.innerHTML += CommentHtml;
        DataComment.insertBefore(NewComment, DataComment.firstElementChild);
        // DataComment.parentNode.insertBefore(NewComment, DataComment.firstElementChild);
        JmlComment.innerText = Number( JmlComment.textContent ) + 1;
    }
    /* else if(AssignTo.value == 'TWMention' || AssignTo.value == 'FBMention'){
        let UserTag = "";
        if (AssignTo.value == 'FBMention') {
            UserTag = `<strong>${TxtCustomerName.textContent}</strong>`;
        }

        const CommentHtml = `<li class="media sent">
            <div class="media-body">
                <div class="msg-box">
                    <div>
                        <strong class='primary-font text-white'>${AgentName.value}</strong>
                        <blockquote class="border-left border-dark text-light font-12 pa-5 mb-5 bg-grey">
                            <p><em>${document.querySelector("input[name=PostIDMention]:checked").getAttribute('data-post')}</em></p>
                        </blockquote>
                        <p>${UserTag} ${MsgText}</p>
                        <span class="chat-time"><i class='fa fa-clock-o'></i> ${DateTime}</span>
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
        
        DataConversation.innerHTML += CommentHtml;
        $(".DataConversation").animate({
            scrollTop: DataConversation.scrollHeight
        }, "fast");
    } */
    else{
        const FormatSend = `<li class="media sent">
            <div class="media-body">
                <div class="msg-box">
                    <div>
                        <strong class='primary-font text-white'>${AgentName.value}</strong>
                        <p>${MsgText}</p>
                        <span class="chat-time"><i class='fa fa-clock-o'></i> ${DateTime}</span>
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
        
        DataConversation.innerHTML += FormatSend;
        $(".DataConversation").animate({
            scrollTop: DataConversation.scrollHeight
        }, "fast");
    }
    BlockFormSend(false);
}

const addZero = (x) => {
    if (x < 10) {
        x = "0" + x;
    }
    return x;
}

const gup = (name, url) => {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    let regexS = "[\\?&]" + name + "=([^&#]*)";
    let regex = new RegExp(regexS);
    let results = regex.exec(url);
    return results == null ? null : results[1];
}


export {
    ClearFormSend,
    BlockFormSend,
    CheckStatusSend,
    EncodeImageFileAsURL,
    addZero,
    ViewMsgToHTML,
    gup,
}