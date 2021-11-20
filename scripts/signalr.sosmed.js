import { 
	userlogin,
    GlobalUrl,
    SenderWA,
    ApiKeyWA,
    UrlWS,
    UrlSignalR,
    UrlAttachmentChat,
    UrlAttachmentSosmed,
    UrlImageProfile,
    UrlAttachCust,
    Messages,
    FileAttach,
    DataConversation,
    FormSend,
    AgentStatus,
    ChatAktif,
    ChatOptions,
    TxtCustomerName,
    BtnCustProfile,
    Email,
    ChatID,
    CustomerID,
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
    BtnIconNotif,
	options,
    images,
    files,
    audios,
    videos

} from "./components/const_elements.js";

import {  
	ClearFormSend,
    BlockFormSend,
    CheckStatusSend,
    EncodeImageFileAsURL,
    addZero,
	ViewMsgToHTML
} from "./components/form_elements.js";

import DataAllCustomer from './components/list_customers.js';
import { 
    ModalCustomerProfile,
    DataKantorCabang,
    DataTypeCustomer 
} from './components/profile_customer.js';



document.addEventListener("DOMContentLoaded", function(){		
	//? Event Listener
	BtnEndChat.addEventListener('click', (e) => {
        e.preventDefault();
        EndChat();
    });
	FileAttach.addEventListener('change',(e) => {
        e.preventDefault();
		EncodeImageFileAsURL(FileAttach);
	});
    BtnCustProfile.addEventListener('click', () => {
        ModalCustomerProfile()
		// .then(DataTypeCustomer())
		// .then(DataKantorCabang());
    });

	//koneksi signalr
	$.connection.hub.url = UrlSignalR;
	const chat = $.connection.serverHub;
	// console.log(chat);
	
	(() => {
		//callback agent login
		chat.client.ReturnLoginAgent = function (Agent_ID, Agent_Name, Message) {
			// console.log(Agent_ID, Agent_Name, Message);
			const msg = Message.substr(0,6);
			if(msg === "FAILED"){
				swal({
					title: "FAILED.",
					text: "Agent Not Ready!",
					icon: "error",
					button: "Ok"
				});
			}
			else {
				SoundControl.getInstance().playSound("REGISTER");
				AgentStatus.classList.replace('badge-warning','badge-info');
            	AgentStatus.textContent = 'Ready';
			}
		}
	
		
		// pusher Que blending
		chat.client.ReturnPusher_Que = function (Type, Chat_ID, Cust_ID, Cust_Name, Agent_ID, Agent_Name, Message) {
			DataAllCustomer(AgentName.value); 
			SoundControl.getInstance().playSound("MESSAGE");
		}

		//callback webchat cust
		chat.client.ReturnSendMessageDataCust = function (User_ID, Cust_Name, Text, Agent_ID, Agent_Name, Type_File, Attach_Image, Date_Create) {
			console.log(User_ID, Cust_Name, Text, Agent_ID, Agent_Name, Type_File, Attach_Image, Date_Create);
			const EncodeText = (Text).replace(/\r?\n/g, '<br>');
			const date = new Date(),
			Y = addZero(date.getFullYear()), M = addZero(date.getMonth()), D = addZero(date.getDate()), 
			h = addZero(date.getHours()), m = addZero(date.getMinutes()), s = addZero(date.getSeconds());
	
			// BtnIconNotif.click();
			DataAllCustomer(AgentName.value); 
			SoundControl.getInstance().playSound("MESSAGE");
			PushNotification(Cust_Name,Text,User_ID,'chat.png');
			
			// pesan chat masuk di ui pisahin berdasarkan id customer masing2
			if(User_ID == UserID.value){
				let MsgText;
	
				if(Boolean(Type_File) === true){
					// let tipe = Type_File.split('/')[0];
					let style = 'height:150px !important;width:auto !important;border-radius:0px !important';
					let file = Type_File == 'image' ? `<img src='${UrlAttachmentChat}/${Attach_Image}' style='${style}'><br/> ${Text} (click to download).` : `<i class='fa fa-file-text-o'></i>  ${Text} (click to download).`;
					MsgText = `<a href='${UrlAttachmentChat}/${Attach_Image}' target='_blank'> ${file} </a>`;
				}
				else{
					MsgText = EncodeText;
				} 

				const html = `<li class="media received">
					<div class="avatar border rounded-50 border-2 border-grey">
						<img src="${options.chat.icon}" alt="user" class="avatar-img rounded-circle">
					</div>
					<div class="media-body">
						<div class="msg-box">
							<div>
								<strong class='primary-font'>${Cust_Name}</strong>
								<p>${MsgText}</p>
								<span class="chat-time"><i class='fa fa-clock-o'></i> ${Y}-${M}-${D} ${h}:${m}:${s}</span>
								<div class="arrow-triangle-wrap">
									<div class="arrow-triangle right"></div>
								</div>
							</div>
						</div>
					</div>
				</li>`;
				
				DataConversation.innerHTML += html;
				$(".DataConversation").animate({
					scrollTop: DataConversation.scrollHeight
				}, "fast");
			}
		}

		//callback All Sosialmedia
		chat.client.ReturnPusher_Que_sosmed = function (Type,Chat_ID,Cust_ID,Cust_Name,Agent_ID,Agent_Name,Message,Page_ID,FileName, Assign_To, Alamat_IP) {
			// console.log(Type,Chat_ID,Cust_ID,Cust_Name,Agent_ID,Agent_Name,Message,Page_ID,FileName, Assign_To, Alamat_IP);

			const EncodeMessage = $('<div />').text(Message).html();
			const DataComment = document.getElementById('DataComment');
			const JmlComment = document.getElementById('JmlComment');
			const NewComment = document.createElement('div');
			const date = new Date(), Y = addZero(date.getFullYear()), M = addZero(date.getMonth()), D = addZero(date.getDate()), h = addZero(date.getHours()), m = addZero(date.getMinutes()), s = addZero(date.getSeconds());
			const AssignChannel = Assign_To.split('_')[0];
			const TextMsg = [null, ''].includes(Message) == true ? FileName : Message;
			
			let icons = "";
			let profile = "";
			if (AssignChannel == "FBMessenger"){
				icons = options.messenger.icon;
				profile = options.messenger.icon;
			}
			else if (AssignChannel == "FBMention"){
				icons = options.facebook.icon;
				profile = `${UrlImageProfile}/${Cust_ID}.jpg`;
			}
			else if (AssignChannel == "DMTwitter"){ 
				icons = options.twitter_dm.icon;
				profile = options.twitter_dm.icon;
			}
			else if (AssignChannel == "TWMention"){
				icons = options.twitter.icon;
				profile = `${UrlImageProfile}/${Cust_ID}.jpg`;
			}
			else if (AssignChannel == "WA"){
				icons = options.whatsapp.icon;
				profile = options.whatsapp.icon;
			}
			else if (AssignChannel == "FBFeed"){
				icons = options.facebook.icon;
				profile = `${UrlImageProfile}/${Cust_ID}.jpg`;
			}
			else if (AssignChannel == "IGFeed"){
				icons = `${options.instagram.icon}`;
				profile = `${options.instagram.icon}`;
			}
			else{
				icon = options.chat.icon;
				profile = options.chat.icon;
			}

			if (Cust_Name !== AgentName.value && Agent_Name == AgentName.value) {
				// BtnIconNotif.click();
				DataAllCustomer(AgentName.value); 
				SoundControl.getInstance().playSound("MESSAGE");
				PushNotification(Cust_Name,TextMsg,Chat_ID,icons);
			}

			if (Type == 'True') {
				let content = '';
				if(Boolean(FileName) === true){
					let file='';
					let attachment = '';
					let namafile = Message == '' ? FileName : Message;
					let TipeFile = [null, ''].includes(FileName) == true ? '' : FileName.split('.')[1].toLowerCase();

					if (AssignChannel == "TWMention" || AssignChannel == "FBFeed"){
						attachment = `${UrlAttachmentSosmed}/${FileName}`;
					}
					else{
						attachment = `${UrlAttachCust}/${FileName}`;
					}
					
					const style = 'height:150px !important;width:auto !important;border-radius:0px !important';
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
						file = `<video height='150' controls>
							<source src='${attachment}' type='video/mp4'>
							Your browser does not support the video tag.
						</video>
						<br/>${namafile} (click to play)`;
					}
					content = `<a href='${attachment}' target='_blank'> ${file} </a>`;
				}
				else{
					content = EncodeMessage;
				} 

				// pesan chat masuk di ui pisahin berdasarkan id customer masing2
				if(Cust_Name == TxtCustomerName.textContent && Chat_ID == ChatID.value){
					if (AssignChannel == "FBFeed" || AssignChannel == "IGFeed" || AssignChannel == "TWMention" || AssignChannel == "FBMention") {
						const html = `<div class="media">
							<div class="media-img-wrap d-flex mr-0">
								<div class="avatar avatar-xs">
									<img src="${profile}" alt="user" class="avatar-img rounded-circle">
								</div>
							</div>
							<div class="media-body">
								<div class="mb-10 border rounded-10 pa-10">
									<div class="text-capitalize font-14 font-weight-500 text-dark">${Cust_Name}</div>
									<div class="font-15"><p>${content}</p></div>
									<div class="d-flex mt-5 justify-content-between">
										<div>
											<span class="font-11 text-light mr-15">${Y}-${M}-${D} ${h}:${m}:${s}</span>
											<a href="#" onclick="document.getElementById('FormDataReply${Alamat_IP}').classList.toggle('hide');" class="font-11 text-light text-capitalize">
												<span id="JmlReply${Alamat_IP}">0</span> reply
											</a>
										</div>
										<div>
											<label for="postid${Alamat_IP}" class="badge badge-light mr-10 mb-0">reply</label>
											<input type="radio" id="postid${Alamat_IP}" name="PostID" value="${Alamat_IP}" data-post="${EncodeMessage}" class="mb-0" onclick="AlamatIP.value=this.value">
										</div>
									</div>
								</div>
								<div class="hide" id="FormDataReply${Alamat_IP}"> 
									<div id="DataReply${Alamat_IP}"></div>
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
					
						NewComment.innerHTML += html;
						DataComment.insertBefore(NewComment, DataComment.firstElementChild);
						// DataComment.parentNode.insertBefore(NewComment, DataComment);
						JmlComment.innerText = Number( JmlComment.textContent ) + 1;
					}
					/* else if(AssignChannel == "TWMention" || AssignChannel == "FBMention"){
						const html = `<li class="media received">
							<div class="avatar border rounded-50 border-2 border-grey">
								<img src="${profile}" alt="user" class="avatar-img rounded-circle">
							</div>
							<div class="media-body">
								<div class="msg-box">
									<div>
										<strong class='primary-font'>${Cust_Name}</strong>
										<p>${content}</p>
										<span class="chat-time pull-left mr-20"><i class='fa fa-clock-o'></i> ${Y}-${M}-${D} ${h}:${m}:${s}</span>
										<div class="pull-right ml-20">
											<label for="Mentionpostid${Alamat_IP}" class="badge badge-light mr-10 mb-0">reply</label>
											<input type="radio" id="Mentionpostid${Alamat_IP}" name="PostIDMention" value="${Alamat_IP}" data-post="${EncodeMessage}" class="mb-0" onclick="AlamatIP.value=this.value">
										</div>
										<div class="arrow-triangle-wrap">
											<div class="arrow-triangle right"></div>
										</div>
									</div>
								</div>
							</div>
						</li>`;
						
						DataConversation.innerHTML += html;
						$(".DataConversation").animate({
							scrollTop: DataConversation.scrollHeight
						}, "fast");
					} */
					else{
						const html = `<li class="media received">
							<div class="avatar border rounded-50 border-2 border-grey">
								<img src="${profile}" alt="user" class="avatar-img rounded-circle">
							</div>
							<div class="media-body">
								<div class="msg-box">
									<div>
										<strong class='primary-font'>${Cust_Name}</strong>
										<p>${content}</p>
										<span class="chat-time"><i class='fa fa-clock-o'></i> ${Y}-${M}-${D} ${h}:${m}:${s}</span>
										<div class="arrow-triangle-wrap">
											<div class="arrow-triangle right"></div>
										</div>
									</div>
								</div>
							</div>
						</li>`;
						
						DataConversation.innerHTML += html;
						$(".DataConversation").animate({
							scrollTop: DataConversation.scrollHeight
						}, "fast");
					}
				}
			}
		}
		
		//callback endchat 
		chat.client.ReturnEndChat_User = function (Cust_ID, Agent_ID, Chat_ID) {
			DataAllCustomer(AgentName.value); 
			DataConversation.innerHTML = "";
			FormSend.classList.add('hide');
			ChatAktif.classList.add('hide');
			ChatOptions.classList.add('hide');
		}
	
		$.connection.hub.start().done(function () {
			AgentName.value = userlogin;
			AgentID.value = $.connection.hub.id;
			
			function LoginSignalR(){
				console.log('Agent Login : '+ AgentID.value);
				chat.server.loginAgent(AgentID.value, AgentName.value);
				DataAllCustomer(AgentName.value);
			}
			setTimeout(() => { LoginSignalR() }, 2000);
			
			//Agent Reply
			async function SendMessage() {
				BlockFormSend(true);
				const EncodeMessage = (Messages.value).replace(/\r?\n/g, '<br>');
				const date = new Date(),
				Y = addZero(date.getFullYear()), M = addZero(date.getMonth()), D = addZero(date.getDate()), 
				h = addZero(date.getHours()), m = addZero(date.getMinutes()), s = addZero(date.getSeconds());
				const DateTime = `${Y}-${M}-${D} ${h}:${m}:${s}`;
				
				let MsgText,FileType;
				if(SrcResultbase64.value){
					FileType = FileAttach.files[0].type.split('/')[0] == 'application' ? 'file' : FileAttach.files[0].type.split('/')[0]; //image,application,video,audio
					const style = 'height:150px !important;width:auto !important;border-radius:0px !important';
					const file = FileType == 'image' ? `<img src='${SrcResultbase64.value}' style='${style}'><br/> ${Messages.value} (click to download).` : `<i class='fa fa-file-text-o'></i>  ${Messages.value} (click to download).`;
					MsgText = `<a href='javascript:();' onclick='window.open("${SrcResultbase64.value}", "_blank");'> ${file} </a>`;
				}
				else{
					FileType = "";
					MsgText = EncodeMessage;
				} 
				
				//Post message to API & DB
				if (AssignTo.value == 'FBMessenger'){
					let namafile='0:', type='', base64='';
					if (Boolean(Resultbase64.value) == true) {
						type = FileType == 'application' ? 'file' : FileType;
						namafile = `${NameResultbase64.value}`;
						base64 = Resultbase64.value;
					}
					const values = `{Raw:"",Data1:"${PageID.value}",Data2:"${EncodeMessage}",Data3:"${UserID.value}",Data4:"${ChatID.value}",Data5:"${type}",Data6:"${UserID.value}",Data7:"${base64}",Data8:"${namafile}",Data9:"",Data10:""}`;
					const url = `${GlobalUrl}/ApiTeleport/Service1.svc/send_teleport`;
					const config = {
						method: 'POST',
						headers: {
							"Content-Type" : "application/x-www-form-urlencoded"
						},
						// body: JSON.stringify(values)
						body: values
					}
					const res = await fetch(url, config);
					const obj = await res.json();
					if (res.ok) {
						if (obj.Result == "True") {
							chat.server.sendMessageDataAgent(ChatID.value, CustomerID.value, UserID.value, TxtCustomerName.textContent, EncodeMessage, AgentID.value, AgentName.value, NameResultbase64.value, Resultbase64.value, Email.value, FileType, date, 'FBMessenger');
							ViewMsgToHTML(MsgText, DateTime);
						}
						CheckStatusSend(obj);
					}
				}
				else if (AssignTo.value == 'DMTwitter'){
					let media='0', type='text', base64='';
					if (Boolean(Resultbase64.value) == true) {
						type = 'media';
						media = `1:${NameResultbase64.value}`;
						base64 = Resultbase64.value;
					}
					
					const url = `${GlobalUrl}/ApiTeleport/Service1.svc/sendRoshan`;
					const config = {
						method: 'POST',
						headers: {
							"Content-Type" : "application/x-www-form-urlencoded",
						},
						body: JSON.stringify({
							Raw: "",
							Data1: "",
							Data2: "",
							Data3: UserID.value,
							Data4: EncodeMessage,
							Data5: PageID.value,
							Data6: media,
							Data7: type,
							Data8: base64,
							Data9: "",
							Data10: ""
						})
					}
					const res = await fetch(url, config);
					const obj = await res.json();
					// console.log(obj);

					if (res.ok) {
						if (obj.Result == "True") {
							chat.server.sendMessageDataAgent(ChatID.value, CustomerID.value, UserID.value, TxtCustomerName.textContent, EncodeMessage, AgentID.value, AgentName.value, NameResultbase64.value, Resultbase64.value, Email.value, FileType, date, 'DMTwitter');
							ViewMsgToHTML(MsgText, DateTime);
						}
						CheckStatusSend(obj);
					}
				}
				else if (AssignTo.value == 'FBMention'){
					if (AlamatIP.value) {
						const res = await fetch(UrlWS, {
							method: 'POST',
							headers: {
								"Content-Type" : "application/json"
							},
							body: JSON.stringify({
								Data1:"LastData",
								Data2:ChatID.value,
								Data3:UserID.value,
								Data4:"",
								Data5:""
							})
						});
						const obj = await res.json();
						const data = obj.data[0];
						const dataLength = obj.data.length;
						// console.log(data);
		
						if(dataLength > 0){
							// const template_msg = "Silahkan mention/tag akun Invision Astrindo Pratama (@InvisionAP) untuk membalas kembali.";
							const values_fbmention = `{Raw:"",Data1:"${data.GroupID}",Data2:"${data.RoomID}",Data3:"@[${data.UserID}] ${EncodeMessage}",Data4:"${data.ChatID}",Data5:"${data.GroupID}",Data6:"${data.UserID}",Data7:"${AgentName.value}",Data8:"${data.RoomID}",Data9:"${AlamatIP.value}",Data10:"FBMention"}`;
							const api_fbmention = `${GlobalUrl}/ApiTeleport/Service1.svc/send_to_Tower?value=${values_fbmention}`;
							fetch(api_fbmention).then(res => res.json()).then((res) => { 
								if (res.Result == "True") {
									ViewMsgToHTML(MsgText, DateTime);
								}
								CheckStatusSend(res);
							});
						}
					}
					else{
						BlockFormSend(false);
						swal({
							title: "Warning!",
							text: "Pilih data komen untuk membalas pesan.",
							icon: "warning",
							button: "Ok"
						});
					}
				}
				else if (AssignTo.value == 'TWMention'){
					if (AlamatIP.value) {
						const res = await fetch(UrlWS, {
							method: 'POST',
							headers: {
								"Content-Type" : "application/json"
							},
							body: JSON.stringify({
								Data1:"LastData",
								Data2:ChatID.value,
								Data3:UserID.value,
								Data4:"",
								Data5:""
							})
						});
						const obj = await res.json();
						const data = obj.data[0];
						const dataLength = obj.data.length;
						// console.log(data);
		
						if(dataLength > 0){
							let media='0:', base64='';
							if (Boolean(Resultbase64.value) == true) {
								media = `1:${NameResultbase64.value}`;
								base64 = Resultbase64.value;
							}

                            const body = {
                                Raw: "",
                                Data1: data.ChatID,
                                Data2: data.GroupID,
                                Data3: AlamatIP.value,
                                Data4: EncodeMessage,
                                Data5: data.GroupID,
                                Data6: media,
                                Data7: AgentName.value,
                                Data8: data.RoomID,
                                Data9: base64,
                                Data10: "TWMention"
                            }

                            // console.log(body);
	
							const url = `${GlobalUrl}/ApiTeleport/Service1.svc/sendPugna`;
							const config = {
								method: 'POST',
								headers: {
									"Content-Type" : "application/x-www-form-urlencoded",
								},
								body: JSON.stringify(body)
							}
							const res = await fetch(url, config);
							const obj = await res.json();
							// console.log(obj);
	
							if (res.ok) {
								if (obj.Result == "True") {
									ViewMsgToHTML(MsgText, DateTime);
								}
								CheckStatusSend(obj);
							}
							
						}
					}
					else{
						BlockFormSend(false);
						swal({
							title: "Warning!",
							text: "Pilih data komen untuk membalas pesan.",
							icon: "warning",
							button: "Ok"
						});
					}
				}
				else if (AssignTo.value == 'FBFeed'){
					if (AlamatIP.value) {
						const res = await fetch(UrlWS, {
							method: 'POST',
							headers: {
								"Content-Type" : "application/json"
							},
							body: JSON.stringify({Data1:"LastData", Data2:ChatID.value, Data3:RoomID.value, Data4:"", Data5:""})
						});
						const obj = await res.json();
						const data = obj.data[0];
						const dataLength = obj.data.length;
						// console.log(data);
		
						if(dataLength > 0){
							const values = `{Raw:'',Data1:'${data.GroupID}',Data2:'${AlamatIP.value}',Data3:'@[${data.UserID}] ${EncodeMessage}',Data4:'${data.ChatID}',Data5:'${data.GroupID}',Data6:'${data.UserID}',Data7:'${AgentName.value}',Data8:'${data.RoomID}',Data9:'${AlamatIP.value}',Data10:'FBFeed_Reply'}`;
							const api_fbfeed = `${GlobalUrl}/ApiTeleport/Service1.svc/send_to_Tower?value=${values}`;
							fetch(api_fbfeed).then(res => res.json()).then((res) => { 
								if (res.Result == "True") {
									ViewMsgToHTML(MsgText, DateTime);
								}
								CheckStatusSend(res);
							});
						}
					}
					else{
						BlockFormSend(false);
						swal({
							title: "Warning!",
							text: "Pilih data komen untuk membalas pesan.",
							icon: "warning",
							button: "Ok"
						});
					}
				}
				else if (AssignTo.value == 'IGFeed'){
					if (AlamatIP.value) {
						const res = await fetch(UrlWS, {
							method: 'POST',
							headers: {
								"Content-Type" : "application/json"
							},
							body: JSON.stringify({Data1:"LastData", Data2:ChatID.value, Data3:RoomID.value, Data4:"", Data5:""})
						});
						const obj = await res.json();
						const data = obj.data[0];
						const dataLength = obj.data.length;
						// console.log(data);
		
						if(dataLength > 0){
							const values = `{Raw:'',Data1:'${data.GroupID}',Data2:'@${data.Email} ${EncodeMessage}',Data3:'${AlamatIP.value}',Data4:'${data.ChatID}',Data5:'${data.RoomID}',Data6:'${data.UserID}',Data7:'${AgentName.value}',Data8:'${data.RoomID}',Data9:'',Data10:'IGFeed_Reply'}`;
							const api_igfeed = `${GlobalUrl}/ApiTeleport/Service1.svc/send_EG_Notif?value=${values}`;
							fetch(api_igfeed).then(res => res.json()).then((res) => { 
								if (res.Result == "True") {
									ViewMsgToHTML(`@${data.Email} ${MsgText}`, DateTime);
								}
								CheckStatusSend(res);
							});
						}
					}
					else{
						BlockFormSend(false);
						swal({
							title: "Warning!",
							text: "Pilih data komen untuk membalas pesan.",
							icon: "warning",
							button: "Ok"
						});
					}
				}
				else if(AssignTo.value == 'WA'){
                    //? old wa
					// chat.server.agent_Send_WA(CustomerID.value, AgentID.value, ChatID.value, NoAgentWA, CustomerID.value, AgentName.value, EncodeMessage, Email.value, 'text', '');
					// ViewMsgToHTML(MsgText, DateTime);
					// CheckStatusSend(res);

                    //? new wa
                    const body = {
                        "Data1": ChatID.value, //chatid
                        "api_key": ApiKeyWA,
                        "sender": SenderWA, //agentid
                        "number": CustomerID.value, //custid
                        "message": EncodeMessage,
                        "Data5": SenderWA, //userid
                        "Data6": "",
                        "Data7": "",
                        "Data8": "",
                        "Data9": "",
                        "Data10": ""
                    }
                    // console.log(body);

                    const url = `${GlobalUrl}/apiteleport/Service1.svc/go_whats`;
                    const config = {
                        method: 'POST',
                        headers: {
                            "Content-Type" : "application/x-www-form-urlencoded",
                        },
                        body: JSON.stringify(body),
                        redirect: 'follow'
                    }
                    const res = await fetch(url, config);
                    const obj = await res.json();
                    // console.log(obj);

                    if (res.ok) {
                        if (obj.Result == "True") {
                            ViewMsgToHTML(MsgText, DateTime);
                        }
                        CheckStatusSend(obj);
                    }
				}
				else{
					chat.server.sendMessageDataAgent(ChatID.value, CustomerID.value, UserID.value, TxtCustomerName.textContent, EncodeMessage, AgentID.value, AgentName.value, NameResultbase64.value, Resultbase64.value, Email.value, FileType, date, 'Chat');
					ViewMsgToHTML(MsgText, DateTime);
					// CheckStatusSend(res);
				}

				ClearFormSend();
			}
	
			//buttno send msg
			BtnSendMsg.addEventListener('click', () => {
				if(Messages.value){
					SendMessage();
				}
				else{
					Messages.focus();
				}
			});

			//enter send msg
			Messages.addEventListener('keypress', (e) => {
				if(e.key === 'Enter') {
					if(Messages.value){
						SendMessage();
					}
					else{
						Messages.focus();
					}
				}
			});
		});
	})();
	
	const EndChat = async () => {
		swal({
			title: "End Chat.",
			text: "Apakah ingin mengakhiri percakapan ini?",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((end) => {
			if (end) {
				swal({
					title: "End Chat Berhasil.",
					text: "Ingin create ticket?",
					icon: "success",
					buttons: ["Tidak, Nanti saja", true],
				})
				.then((create) => {
					if (create) {
						CreateTicket();
					}
	
					const config = {
						method: 'POST',
						headers: {
							"Content-Type" : "application/json"
						},
						body: JSON.stringify({
							Data1:"EndChat",
							Data2:ChatID.value,
							Data3:CustomerID.value,
							Data4:Email.value,
							Data5:""
						})
					}
					// console.log(config);
					fetch(UrlWS,config).then(res => res.json()).then(res => console.log(res));
					chat.server.endChat_User(UserID.value, AgentID.value, ChatID.value);
	
					BtnEndChat.classList.add('hide');
					DataConversation.innerHTML = '';
					DataAllCustomer(AgentName.value);
					FormSend.classList.add('hide');
					ChatAktif.classList.add('hide');
					ChatOptions.classList.add('hide');
				});
			}
		});

	}
	
		
	async function CreateTicket(){
		// location.href = `addticket.aspx?chatid=${ChatID.value}&agentid=${AgentName.value}&custid=${CustomerID.value}&email=${Email.value}`;
		let w = "200";
		let h = "400";
		let left = (screen.width/2)-(w/2);
		let top = (screen.height/2)-(h/2);
		
		let newwindow = window.open("../addticket.aspx?chatid="+ChatID.value+"&flagchannel="+AssignTo.value+"&roomid="+RoomID.value+"&custid="+CustomerID.value+"&agentid="+AgentName.value+"&email="+Email.value,'width=1000px,Height=700px,toolbar=0,menubar=0,location=0,top='+top+',left='+left);  
		if (window.focus) {newwindow.focus()}
	}

	//! Push Notification WEB
	function AskPermission() {
		try {
			Notification.requestPermission().then((obj) => {
				console.log(`Notification permission : ${obj}`);
			});
		} 
		catch(e) {
			return false;
		}
		return true;
	}
	AskPermission();

	function PushNotification(Title,Body,Tag,Icon) {
		AskPermission();
		var options = {
			body: Body,
			icon: Icon,
			tag: Tag
		}
		var notif = new Notification(Title,options);

		notif.onclick = function(event) {
			event.preventDefault(); 
			// location.href = "wa.aspx";
		}
	}
	
});
	