const url_ws = 'https://selindo.mendawai.com/ApiMendawai/dashboard';
// const url_ws = 'https://invision.ddns.net:30008/ApiMendawai/dashboard';
const DashLine = Highcharts.chart('grafik_detail_channel', {
	chart: {
		type: 'spline',
		zoomType: 'x'
	},
	title: {
		text: ''
	},
	subtitle: {
		text: ''
	},
	xAxis: {
		title: {
			text: ''
		},
		labels: {
			overflow: 'justify'
		}
	},
	yAxis: {
		title: {
			text: ''
		},
	},
	legend: {
		enabled: true,
		layout: 'vertical',
		align: 'right',
		verticalAlign: 'top',
		x: -10,
		y: 10,
		floating: true,
		borderWidth: 0,
		backgroundColor: 'transparent',
		shadow: false
	},
	tooltip: {
		headerFormat: '<span style="font-size:12px;margin-left:10px;"><b> {point.key}</b></span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0;font-size:10px;" align="right">{series.name}: </td>' +
            '<td style="padding:0;font-size:10px;"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
	},
	plotOptions: {
		spline: {
			marker: {
				enable: false
			}
		},
	},
	credits:{
		enabled : false
	},
	series: []
	
});



async function DashLineChannel(){		
	if (DashLine) {
		const x_axis1 = DashLine.xAxis[0];
		const config = {
			method: 'POST',
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({
				Actions:"DashLineChannel"
			})
		}

		try {
			const res = await fetch(url_ws + '/GetDashChannel',config);
			const obj = await res.json();
			const data = obj.data;
			// console.log(data);

			if (obj.success) {
				let JamNya = [],
				Chating = [],
				Facebook = [],
				Twitter = [],
				Instagram = [],
				Whatsapp = [],
				Email = [];
				
				let colors = ["#00a0dc","#8d6cab","#dd5143","#e68523","#57bfc1","#edb220","#dc4b89","#69a62a","#046293","#66418c"];
				
				// console.log(DashLine.series.length);
				for(var i = DashLine.series.length -1; i > -1; i--) {
					DashLine.series[i].remove();
				}
				
				for(let i=0; i < data.length; i++){
					JamNya.push(data[i].JamNya);
					Chating.push(data[i].Chating);
					Facebook.push(data[i].Facebook);
					Twitter.push(data[i].Twitter);
					Instagram.push(data[i].Instagram);
					Whatsapp.push(data[i].Whatsapp);
					Email.push(data[i].Email);
				}

				x_axis1.setCategories(JamNya);
				DashLine.addSeries({
					name: 'Chating',
					color : colors[0],
					data: Chating
				});
				DashLine.addSeries({
					name: 'Facebook',
					color : colors[1],
					data: Facebook
				}); 
				DashLine.addSeries({
					name: 'Twitter',
					color : colors[2],
					data: Twitter
				}); 
				DashLine.addSeries({
					name: 'Instagram',
					color : colors[3],
					data: Instagram
				}); 
				DashLine.addSeries({
					name: 'Whatsapp',
					color : colors[4],
					data: Whatsapp
				}); 
				DashLine.addSeries({
					name: 'Email',
					color : colors[5],
					data: Email
				}); 
				
				DashLine.redraw();
				return res;
			} 
		} 
		catch (error) {
			console.log(error);	
		}
	}
}
DashLineChannel();


async function DashTotalChannel(){
	const config = {
		method: 'POST',
		headers: {
			"Content-Type" : "application/json"
		},
		body: JSON.stringify({
			Actions:"DashTotalChannel"
		})
	}
	
	try {
		const res = await fetch(url_ws + '/GetDashChannel', config);
		const obj = await res.json();
		const array = obj.data;

		if(obj.success){
			let allchannel = [];
			let que_allchannel = [];
			// console.log(obj)
			
			for (let i = 0; i < array.length; i++) {
				allchannel.push(array[i].Total);
				que_allchannel.push(array[i].Que);
				
				if (array[i].AssignTo == "Chat") {
					$("#txtChat").text(array[i].Total);
					$("#QueChat").text(array[i].Que);
				}
				else if (array[i].AssignTo == "FBMessenger") {
					$("#txtFBMessenger").text(array[i].Total);
					$("#QueFBMessenger").text(array[i].Que);
				} 
				else if (array[i].AssignTo.split('_')[0] == "FBFeed") {
					$("#txtFBFeed").text(array[i].Total);
					$("#QueFBFeed").text(array[i].Que);
				} 
				else if (array[i].AssignTo == "FBMention") {
					$("#txtFBMention").text(array[i].Total);
					$("#QueFBMention").text(array[i].Que);
				} 
				else if (array[i].AssignTo == "TWMention") {
					$("#txtTWMention").text(array[i].Total);
					$("#QueTWMention").text(array[i].Que);
				} 
				else if (array[i].AssignTo == "DMTwitter") {
					$("#txtDMTwitter").text(array[i].Total);
					$("#QueDMTwitter").text(array[i].Que);
				} 
				else if (array[i].AssignTo.split('_')[0] == "IGFeed") {
					$("#txtIGFeed").text(array[i].Total);
					$("#QueIGFeed").text(array[i].Que);
				} 
				else if (array[i].AssignTo == "Email") {
					$("#txtEmail").text(array[i].Total);
					$("#QueEmail").text(array[i].Que);
				} 
				else if (array[i].AssignTo == "WA") {
					$("#txtWhatsapp").text(array[i].Total);
					$("#QueWhatsapp").text(array[i].Que);
				} 
				else {}
			}
			
			
			function getSum(total, num) {
				return total + Math.round(num);
			}
			$("#txtAllChannel").text(allchannel.reduce(getSum, 0));
			$("#QueAllChannel").text(que_allchannel.reduce(getSum, 0));
		}
	} 
	catch (error) {
		console.log(error);	
	}

}
DashTotalChannel();

async function DashAgentOnline(){
	const config = {
		method: 'POST',
		headers: {
			"Content-Type" : "application/json"
		},
		body: JSON.stringify({
			Actions:"DashAgentOnline"
		})
	}

	try {
		const res = await fetch(url_ws + '/GetDashChannel',config);
		const obj = await res.json();

		if(res.ok){
			let html = "";
			
			$("#jml_agent").html(obj.data.length);
			for (let i = 0; i < obj.data.length; i++) {
				html += '<div class="media">'+
					'<div class="media-img-wrap">'+
						'<div class="avatar avatar-xs">'+
							'<img src="dist/img/agent.png" alt="user" class="avatar-img rounded-circle">'+
						'</div>'+
					'</div>'+
					'<div class="media-body">'+
						'<div>'+
							'<span class="d-block mb-5">'+
								'<span class="font-weight-500 text-dark text-capitalize">'+obj.data[i].USER_NAME+'</span>'+
								'<small class="pull-right">Max ('+ Number(obj.data[i].MAX_CHAT) +')</small>'+
							'</span>'+
							'<span class="font-13">Today Handled : '+obj.data[i].jmlday+'</span><br>'+
							'<span class="d-block font-13">Live Chat : '+obj.data[i].jml+'</span>'+
						'</div>'+
					'</div>'+
				'</div>';
			}
			$("#list_agent").html("");
			$("#list_agent").append(html);
			return res;
		}
	} 
	catch (error) {
		console.log({error});	
	}
}
DashAgentOnline();

async function DashTableChannel(){
	const config = {
		method: 'POST',
		headers: {
			"Content-Type" : "application/json"
		},
		body: JSON.stringify({
			Actions:"DashTableChannel"
		})
	}
	
	try {
		const res = await fetch(url_ws + '/GetDashChannel', config);
		const obj = await res.json();
		const data = obj.data;

		if(res.ok){
			let html = "";
			let icon = "";
			let label = "";
			// console.log(obj)

			for (let i = 0; i < data.length; i++) {
				let AssignTo = data[i].AssignTo.split("_")[0];
				if(AssignTo == 'FBMessenger'){
					icon = "dist/img/icon/messenger.png";
					label = "Messenger <br> <small>( " + data[i].PageName + " )</small>";
				}
				else if(AssignTo == 'FBFeed'){
					icon = "dist/img/icon/facebook.png";
					label = "Facebook Feeds <br> <small>( " + data[i].PageName + " )</small>";
				}
				else if(AssignTo == 'FBMention'){
					icon = "dist/img/icon/facebook.png";
					label = "Facebook Mention <br> <small>( " + data[i].PageName + " )</small>";
				}
				else if(AssignTo == 'TWMention'){
					icon = "dist/img/icon/twitter.png";
					label = "Twitter Mention <br> <small>( " + data[i].PageName + " )</small>";
				}
				else if(AssignTo == 'DMTwitter'){
					icon = "dist/img/icon/twitter_dm.png";
					label = "Twitter DM <br> <small>( " + data[i].PageName + " )</small>";
				}
				else if(AssignTo == 'IGFeed'){
					icon = "dist/img/icon/instagram.png";
					label = "Instagram Feeds <br> <small>( " + data[i].PageName + " )</small>";
				}
				else if(AssignTo == 'WA'){
					icon = "dist/img/icon/whatsapp.png";
					label = "Whatsapp";
				}
				else {
					icon = "dist/img/icon/chat.png";
					label = "Chat";
				}
			
				html += '<tr>'+
					'<td>'+
						'<div class="media align-items-center">'+
							'<div class="media-img-wrap d-flex mr-10">'+
								'<div class="avatar avatar-xs"><img src="'+icon+'" alt="user" class="avatar-img rounded-circle"></div>'+
							'</div>'+
							'<div class="media-body">'+
								'<span class="d-block">'+label+'</span>'+
							'</div>'+
						'</div>'+
					'</td>'+
					'<td><span class="w-130p d-block text-truncate">'+data[i].UserID+'</span></td>'+
					'<td>'+data[i].Nama+'</td>'+
					'<td><p class="">'+data[i].Pesan+'</p></td>'+
					'<td>'+data[i].DateCreate+'</td>'+
					'<td>'+data[i].agent_handle+'</td>'+
				'</tr>';
			}
			$("#tbl_dashchannel").html("");
			$("#tbl_dashchannel").append(html);
			return res;
		}
	} 
	catch (error) {
		console.log(error);	
	}

}
DashTableChannel();


async function DashTotalQue(){
	const config = {
		method: 'POST',
		headers: {
			"Content-Type" : "application/json"
		},
		body: JSON.stringify({
			Actions:"DashTotalQue"
		})
	}

	try {
		const res = await fetch(url_ws + '/GetDashChannel',config);
		const obj = await res.json();

		if(res.ok){
			// console.log(obj);
			$("#TotalQue").html(obj.data.length);
		}
	} 
	catch (error) {
		console.log({error});	
	}
}
DashTotalQue();

$("#btn_refresh").click(function () { 
	// DashBarChannel();
	DashLineChannel();
	DashTotalChannel();
	DashAgentOnline();
	DashTableChannel();
	DashTotalQue();
});

setInterval(function(){ 
	DashLineChannel();
	DashTotalChannel();
	DashAgentOnline();
	DashTableChannel();
	DashTotalQue();
}, 5000);
