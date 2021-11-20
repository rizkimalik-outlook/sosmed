
document.addEventListener("DOMContentLoaded", function(){

	//? define URL
	// const UrlSignalR = 'https://10.255.3.241/wschatlive/signalr';
	// const UrlWS = 'https://10.255.3.241/ws_btn/SP_SosialMedia';
	const UrlSignalR = 'http://192.168.25.61/signalr/signalr';
	const UrlWS = 'http://192.168.25.61/wschatlive/SP_SosialMedia';
	const UrlAttachment = 'http://192.168.25.61/signalr/FileUpload';
	
	
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
	
	//? define Hidden Feature
	const CustIdentity = document.getElementById('CustIdentity');
	const Email = document.getElementById('Email');
	const ChatID = document.getElementById('ChatID');
	const CustomerID = document.getElementById('CustomerID');  //custid dari mcustomer
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
	const BtnConfirmEndChat = document.getElementById('BtnConfirmEndChat');
	const BtnCreateTicket = document.getElementById('BtnCreateTicket');
	// const BtnUpdateProfile = document.getElementById('BtnUpdateProfile');
	// const BtnCustProfile = document.getElementById('BtnCustProfile');
	// const FormUpdateProfile = document.getElementById('FormUpdateProfile');
	
	
	
	//? Event Listener
	BtnConfirmEndChat.addEventListener('click', EndChat);
	BtnCreateTicket.addEventListener('click', CreateTicket);
	// BtnUpdateProfile.addEventListener('click', CustomerProfile);
	FileAttach.addEventListener('change',() => {
		EncodeImageFileAsURL(FileAttach);
	});


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
	
	//koneksi signalr
	$.connection.hub.url = UrlSignalR;
	const chat = $.connection.serverHub;
	// console.log(chat);
	
	(() => {
		//callback agent login
		chat.client.ReturnLoginAgent = function (Agent_ID, Agent_Name, Message) {
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

		//callback chat cust
		chat.client.ReturnSendMessageDataCust = function (User_ID, Cust_Name, Text, Agent_ID, Agent_Name, Type_File, Attach_Image, Date_Create) {
			
			// UserID.value = User_ID;
			const EncodeText = (Text).replace(/\r?\n/g, '<br>');
			const date = new Date(),
			Y = addZero(date.getFullYear()), M = addZero(date.getMonth()), D = addZero(date.getDate()), 
			h = addZero(date.getHours()), m = addZero(date.getMinutes()), s = addZero(date.getSeconds());
	
			DataAllCustomer(AgentName.value); 
			SoundControl.getInstance().playSound("MESSAGE");
			// PushNotification(Cust_Name,Text,User_ID,'chat.png');
			
			// pesan chat masuk di ui pisahin berdasarkan id customer masing2
			if(User_ID == UserID.value){
				let MsgText;
	
				if(Boolean(Type_File) === true){
					// let tipe = Type_File.split('/')[0];
					let style = 'height:150px !important;width:auto !important;border-radius:0px !important';
					let file = Type_File == 'image' ? `<img src='${UrlAttachment}/${Attach_Image}' style='${style}'><br/> ${Text} (click to download).` : `<i class='fa fa-file-text-o'></i>  ${Text} (click to download).`;
					MsgText = `<a href='${UrlAttachment}/${Attach_Image}' target='_blank'> ${file} </a>`;
				}
				else{
					MsgText = EncodeText;
				} 

				const html = `<li class="media received">
					<div class="avatar">
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
		
		//callback endchat 
		chat.client.ReturnEndChat_User = function (Cust_ID, Agent_ID, Chat_ID) {
			DataAllCustomer(AgentName.value); 
			DataConversation.innerHTML = "";
			FormSend.classList.add('hide');
			ChatAktif.classList.add('hide');
			ChatOptions.classList.add('hide');
		}
	
		$.connection.hub.start().done(function () {
			// AgentName.value = username;
			AgentID.value = $.connection.hub.id;
			
			function LoginSignalR(){
				console.log('Agent Login : '+ AgentID.value);
				chat.server.loginAgent(AgentID.value, AgentName.value);
				DataAllCustomer(AgentName.value);
			}
			setTimeout(() => { LoginSignalR() }, 2000);
			
			//Agent Reply
			async function SendMessage() {
				const EncodeMessage = (Messages.value).replace(/\r?\n/g, '<br>');
				const date = new Date(),
				Y = addZero(date.getFullYear()), M = addZero(date.getMonth()), D = addZero(date.getDate()), 
				h = addZero(date.getHours()), m = addZero(date.getMinutes()), s = addZero(date.getSeconds());
				
				// console.log(FileAttach.files[0].type.split('/')[0]);
				let MsgText,FileType;
				if(SrcResultbase64.value){
					FileType = FileAttach.files[0].type.split('/')[0];
					const style = 'height:150px !important;width:auto !important;border-radius:0px !important';
					const file = FileType == 'image' ? `<img src='${SrcResultbase64.value}' style='${style}'><br/> ${Messages.value} (click to download).` : `<i class='fa fa-file-text-o'></i>  ${Messages.value} (click to download).`;
					// MsgText = `<a href='${SrcResultbase64.value}' target='_blank'> ${file} </a>`;
					MsgText = `<a href='javascript:();' onclick='window.open("${SrcResultbase64.value}", "_blank");'> ${file} </a>`;
				}
				else{
					FileType = "";
					MsgText = EncodeMessage;
				} 
	
				//Post message to API & DB
				chat.server.sendMessageDataAgent(ChatID.value, CustomerID.value, UserID.value, TxtCustomerName.textContent, EncodeMessage, AgentID.value, AgentName.value, NameResultbase64.value, Resultbase64.value, Email.value, FileType, date);
				
				//Post message to View HTML
				const FormatSend = `<li class='right clearfix'>
					<span class='chat-img pull-right'>
						<img src='img/agent.png' alt='User Avatar' class='activity-icon bg-info small'>
					</span>
					<div class='chat-body clearfix'>
						<div class='header'>
						<strong class='primary-font'>${AgentName.value}</strong>
						<small class='pull-right text-muted'><i class='fa fa-clock-o'></i>${Y}-${M}-${D} ${h}:${m}:${s}</small>
						</div>
						<p>${MsgText}</p> 
					</div>
				</li>`;
				
				DataConversation.innerHTML += FormatSend;
				$(".DataConversation").animate({
					scrollTop: DataConversation.scrollHeight
				}, "fast");
				ClearFormSend();
			}
	
			BtnSendMsg.addEventListener('click', () => {
				if(Messages.value){
					SendMessage();
				}
				else{
					Messages.focus();
				}
			});
		});
	})();
	
	
	
	DataAllCustomer = async (AgentNya) => {
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
			const raw = obj.data;
			// console.log(raw);
	
			let html = "";
			if (res.ok) {
				for (i = 0; i < raw.length; i++) {
					let aktif = "";
					let selectParams = JSON.stringify(raw[i]);
					let NewChat = raw[i].NewChat > 0 ? `<span class="badge badge-info badge-pill"><span>${raw[i].NewChat}</span></span>` : '<span class="badge badge-soft-secondary badge-pill"><span><i class="fa fa-check"></i></span></span>';
					let NamaCustomer = raw[i].NamaCustomer == 'New Customer' ? `<strong class="text-info">${raw[i].NamaCustomer}</strong>` : raw[i].NamaCustomer;
					if(ChatID.value == raw[i].ChatID){
						aktif = "read-chat active-user";
					}

					html += `<a href='javascript:void(0)' class='media read-chat border-bottom ${aktif}' onclick='SelectCustomer(${selectParams})'>
						<div class="media-img-wrap mt-5">
							<div class="avatar"><img src="${options.chat.icon}" class="avatar-img rounded-circle"></div>
						</div>
						<div class="media-body">
							<div>
								<div class="user-name">${NamaCustomer}</div>
								<div class="user-last-chat">${raw[i].Email}</div>
							</div>
							<div>
								<div class="last-chat-time mb-10">${raw[i].DateCreate}</div>
								<div class="last-chat-time">${NewChat}</div>
							</div>
						</div>
					</a>`;
	
				} 
				JmlLive.textContent = raw.length;
			
			}
			ListAllCustomer.innerHTML = "";
			ListAllCustomer.innerHTML += html;

			// CARI CUSTOMER
			const listCust = ListAllCustomer.getElementsByTagName("a");
			TxtSearchCustomer.addEventListener("keyup",(e)=>{
				e.preventDefault();

				for (let i = 0; i < listCust.length; i++) {
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
	
		} 
		catch (error) {
			console.log(error);
		}
	}
	
	SelectCustomer = (obj) => {
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
	
		UserID.value = obj.UserID;
		CustomerID.value = obj.CustomerID;
		ChatID.value = obj.ChatID;
		Email.value = obj.Email;
		CustIdentity.value = obj.Email;
		// PageID.value = obj.GroupID;
		
		TxtCustomerID.textContent = obj.Email;
		TxtCustomerName.textContent = obj.Nama;
		ImgCustomerIcon.innerHTML = `<img src="${options.chat.icon}" alt="user" class="avatar-img rounded-circle">`;
	
		DataAllCustomer(AgentName.value).then(() => {
			LoadConversation(obj.ChatID, obj.UserID, obj.Email);
		});
	}
	
	async function LoadConversation(ChatIDNya, UserIDNya, EmailNya){
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
					Data5:""
				})
			}
			const res = await fetch(UrlWS, config);
			const json = await res.json();
			const raw = json.data;
			// console.log(raw);
	
			if(res.ok){
				let html = "";
				for (i = 0; i < raw.length; i++) {
					
					let MsgText;
					const EncodeMessage = raw[i].Pesan.replace(/\r?\n/g, '<br>');
					// const EncodeMessage = $('<div />').text(raw[i].Pesan).html();
	
					if(Boolean(raw[i].JenisChat) === true){
						let tipe = raw[i].JenisChat.split('/')[0];
						let style = 'height:150px !important;width:auto !important;border-radius:0px !important';
						// let file = tipe.split(':')[1] == 'image' ? `<img src='${UrlAttachment}/${raw[i].JenisChat},${raw[i].imgbase}' style='${style}'><br/> ${raw[i].Pesan} (click to download).` : `<i class='fa fa-file-text-o'></i>  ${raw[i].Pesan} (click to download).`;

						let file = raw[i].JenisChat == 'image' ? `<img src='${UrlAttachment}/${raw[i].Filename}' style='${style}'><br/> ${raw[i].Pesan} (click to download).` : `<i class='fa fa-file-text-o'></i>  ${raw[i].Pesan} (click to download).`;
						MsgText = `<a href='${UrlAttachment}/${raw[i].Filename}' target='_blank'> ${file} </a>`;
						// MsgText = `<a href='javascript:();' onclick='window.open("${raw[i].JenisChat},${raw[i].imgbase}", "_blank");'> ${file} </a>`;
					}
					else{
						MsgText = EncodeMessage;
					} 

					if(raw[i].FlagTo == "Cust"){
						html += `<li class="media received">
							<div class="avatar">
								<img src="${options.chat.icon}" alt="user" class="avatar-img rounded-circle">
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
							<div class="avatar">
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
							<div class="avatar">
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
	
	async function EndChat(){
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
		fetch(UrlWS,config).then(res => res.json()).then(res => console.log(res));
		chat.server.endChat_User(UserID.value, AgentID.value, ChatID.value);
	
		BtnEndChat.classList.add('hide');
		DataConversation.innerHTML = '';
		DataAllCustomer(AgentName.value);
		FormSend.classList.add('hide');
		ChatAktif.classList.add('hide');
		ChatOptions.classList.add('hide');
	}
	
	
	
	async function CreateTicket(){
		// location.href = `addticket.aspx?chatid=${ChatID.value}&agentid=${AgentName.value}&custid=${CustomerID.value}&email=${Email.value}`;
		let w = "200";
		let h = "400";
		let left = (screen.width/2)-(w/2);
		let top = (screen.height/2)-(h/2);
		
		newwindow = window.open("addticket.aspx?chatid="+ChatID.value+"&custid="+CustomerID.value+"&agentid="+AgentName.value+"&email="+Email.value,'width=1000px,Height=700px,toolbar=0,menubar=0,location=0,top='+top+',left='+left);  
		if (window.focus) {newwindow.focus()}
	}
	
	function EncodeImageFileAsURL(element) {
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
	
			//reset ulang
			ClearFormSend();
		}
		else{
			if (type != "video") {
				reader.onloadend = function () {
					const solution = reader.result.split("base64,")[1];
					Resultbase64.value = solution;
					NameResultbase64.value = `${nama_file}.${format}`;
					// NameResultbase64.value = element.files[0].name;
					Messages.value = element.files[0].name +" ("+ (size / 1000).toFixed(2) +" KB)";
					SrcResultbase64.value = reader.result;
				}
				reader.readAsDataURL(file);
			}
			else{
				swal({
					title: "Gagal.",
					text: "Format Video tidak bisa terkirim.",
					icon: "error",
					button: "Ok"
				});
		
				//reset ulang
				ClearFormSend();
			}
		}
	}
	
	function ClearFormSend() {
		//reset file yg terkirim
		Messages.value = '';
		Resultbase64.value = '';
		NameResultbase64.value = '';
		SrcResultbase64.value = '';
	}
	
	function addZero(x) {
		if (x < 10) {
			x = "0" + x;
		}
		return x;
	}

	test = async () => {
		alert('asdasda')
	}

	
});
	