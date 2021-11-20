document.addEventListener("DOMContentLoaded", function(){

	// const AgentName = 'agent1';
	const AgentName = document.getElementById("ASPxPopupControl2_ASPxCallbackPanel11_txt_username").value;

	const GlobalUrl = 'https://selindo.mendawai.com';
	const UrlWS = `${GlobalUrl}/ApiMendawai/SP_SosialMedia`;
	$.connection.hub.url = `${GlobalUrl}:30008/SignalR`;
	// $.connection.hub.url = "https://selindo.mendawai.com/signalr_ty1/signalr";
	const signalr = $.connection.serverHub;
	// console.log(chat);

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


	$(function () {
		// blending chat 
		signalr.client.ReturnPusher_Que = function (Type, ChatID, CustID, CustName, AgentID, Agent_Name, Message) {
			if (Type == "True" && Agent_Name == AgentName) {
				console.log("notif pusher que");
				NotifSosmed();
				// SoundControl.getInstance().playSound("MESSAGE");
				// $("#BtnIconNotif").trigger("click");
			}
		}

		//chat live
		signalr.client.ReturnSendMessageDataCust = function (clientId, client_name, text, AgentId, Agent_name, typeFile, AttachImage, DateCreate) {
			if(clientId != $("#UserID").val() && Agent_Name == AgentName){
				console.log("notif chat");
				NotifSosmed();
				SoundControl.getInstance().playSound("MESSAGE");
				// $("#BtnIconNotif").trigger("click");
				PushNotification(client_name,text,clientId,options.chat.icon);
			}
		}

		//sosial media
		signalr.client.ReturnPusher_Que_sosmed = function (Type,Chat_ID,Cust_ID,Cust_Name,Agent_ID,Agent_Name,Message,Page_ID,FileName, Assign_To, Alamat_IP) {
			if(Cust_ID != $("#UserID").val() && Agent_Name == AgentName){
				let icons = "";
				let AssignChannel = Assign_To.split('_')[0];
				let TextMsg = [null, ''].includes(Message) == true ? FileName : Message;
				
				if (AssignChannel == "FBMessenger"){
					icons = options.messenger.icon;
				}
				else if (AssignChannel == "FBMention"){
					icons = options.facebook.icon;
				}
				else if (AssignChannel == "DMTwitter"){ 
					icons = options.twitter_dm.icon;
				}
				else if (AssignChannel == "TWMention"){
					icons = options.twitter.icon;
				}
				else if (AssignChannel == "WA"){
					icons = options.whatsapp.icon;
				}
				else if (AssignChannel == "FBFeed"){
					icons = options.facebook.icon;
				}
				else if (AssignChannel == "IGFeed"){
					icons = `${options.instagram.icon}`;
				}
				else{
					icon = options.chat.icon;
				}
				
				NotifSosmed();
				SoundControl.getInstance().playSound("MESSAGE");
				// $("#BtnIconNotif").trigger("click");
				PushNotification(Cust_Name,TextMsg,Chat_ID,icons);
			}
		}

		

		//login notif
		signalr.client.ReturnLoginAgent = function (AgentID, Agent_Name, message) {
			console.log(AgentID, Agent_Name, message);
		}


		function LoginSignalRNotif(){
			$.connection.hub.start().done(function () {
				const AgentID = $.connection.hub.id;
				console.log(`signalr notification = ${AgentName} : ${AgentID}`);

				NotifSosmed();
				signalr.server.loginAgent(AgentID, AgentName);
				// signalr.server.loginNotification(AgentID, AgentName);
			});
			
		}

		setTimeout( function() {
			LoginSignalRNotif();
		}, 2000);
		
			

	});


	async function NotifSosmed(){
		try {
			const config = {
				method: 'POST',
				headers: {
					"Content-Type" : "application/json"
				},
				body: JSON.stringify({
					Data1:"ListNotification",
					Data2:AgentName,
					Data3:"",
					Data4:"",
					Data5:""
				})
			}
			const res = await fetch(UrlWS, config);
			const json = await res.json();
			const row = json.data;
			// console.log(row);

			if(row.length > 0){
				let html = "";
				let icon = ""; // AssignTo

				$("#JmlNotif").html(""); //clear 
				$("#JmlNotif").append(row.length); 
				
				if(row.length != 0){
					document.title = '(' + row.length + ') Helpdesk BTN';
				}
				else{
					document.title = 'Helpdesk BTN';
				}
				
				html += `<li><a>You have <span class="badge badge-info">${row.length}</span> unread messages.</a></li>`;
				for (i = 0; i < row.length; i++) {
					if(row[i].AssignTo == "FBMessenger"){
						icon = "dist/img/icon/messenger.png";
					}
					else if(row[i].AssignTo == "FBFeed"){
						icon = "dist/img/icon/facebook.png";
					}
					else if(row[i].AssignTo == "FBMention"){
						icon = "dist/img/icon/facebook.png";
					}
					else if(row[i].AssignTo == "TWMention"){
						icon = "dist/img/icon/twitter.png";
					}
					else if(row[i].AssignTo == "DMTwitter"){
						icon = "dist/img/icon/twitter_dm.png";
					}
					else if(row[i].AssignTo == "IGFeed"){
						icon = "dist/img/icon/instagram.png";
					}
					else if(row[i].AssignTo == "WA"){
						icon = "dist/img/icon/whatsapp.png";
					}
					else{
						icon = "dist/img/icon/chat.png";
					}
					
					let Message = [null, ''].includes(row[i].Pesan) == true ? row[i].Filename : row[i].Pesan;
					html += `<li>
						<a class="clearfix" href="livechat_coba.aspx?idpage=1010" onclick="ReadNotif(\'${row[i].ChatID}\',\'${row[i].RoomID}\')">
							<img src="${icon}" alt="User Avatar">
							<div class="detail">
								<strong>${row[i].Nama}</strong>
								<p class="no-margin text-nowrap" style="width:150px;">${Message}</p>
								<small class="text-muted"><i class="fa fa-check text-success"></i> ${row[i].DateCreate}</small>
								<span class="label label-default">${row[i].AssignTo}</span>
							</div>
						</a>	
					</li>`;
				}

				$("#ListNotification").html(""); //clear the tbody
				$('#ListNotification').append(html);
			}
		} catch (error) {
			console.log(error);
		}

	}
	// NotifSosmed();

	ReadNotif = (ChatIDnya, RoomIDNya) => {
		const config = {
			method: 'POST',
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({
				Data1:"ReadNotification",
				Data2:ChatIDnya,
				Data3:RoomIDNya,
				Data4:"",
				Data5:""
			})
		}

		return fetch(UrlWS, config)
		.then((response) => response.json())
		.then((responseJson) => {
			let str = JSON.stringify(responseJson);
			let obj = JSON.parse(str);
			// console.log(obj);
			NotifSosmed();
		});
	}

	ReadAllNotif = () => {
		const config = {
			method: 'POST',
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({
				Data1:"ReadAllNotification",
				Data2:AgentName,
				Data3:"",
				Data4:"",
				Data5:""
			})
		}

		return fetch(UrlWS, config)
		.then((response) => response.json())
		.then((responseJson) => {
			let str = JSON.stringify(responseJson);
			let obj = JSON.parse(str);
			// console.log(obj);
			$("#jml_notif").html(0); 
			document.title = 'Invision Helpdesk';
			NotifSosmed();
			
		});

		
	}

	$("#BtnIconNotif").click(function (e) { 
		e.preventDefault();
		NotifSosmed();
	});
	

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
		var Optn = {
			body: Body,
			icon: Icon,
			tag: Tag
		}
		var notif = new Notification(Title,Optn);

		notif.onclick = function(event) {
			event.preventDefault(); 
			location.href = "livechat_coba.aspx?idpage=1010";
		}
	}

});