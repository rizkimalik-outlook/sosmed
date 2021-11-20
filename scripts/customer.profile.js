

document.addEventListener("DOMContentLoaded", function(){

	//? define URL
	const UrlWS = 'https://selindo.mendawai.com/ApiMendawai';
	// const UrlWS = 'https://invision.ddns.net/wschatlive';
	// const UrlWS = 'https://ice.icephone.id:8013/WsSosialMedia';

    const BtnCustProfile = document.getElementById('BtnCustProfile');
    const CustomerID = document.getElementById('CustomerID');
    const AgentName = document.getElementById('AgentName');
    const DataConversation = document.getElementById('DataConversation');
    const FormSend = document.getElementById('FormSend');
    const ChatAktif = document.getElementById('ChatAktif');
    const ChatOptions = document.getElementById('ChatOptions');
	const AssignTo = document.getElementById('AssignTo');

    CloseModal = () => {}; 
    BtnCustProfile.addEventListener('click', () => {
        ModalCustomerProfile()
		.then(DataTypeCustomer())
		.then(DataKantorCabang());
    });

	
    ViewCustomer =  async (CustID) => {
        // FormUpdateProfile.reset(); 
		let ValueChannel = "";
		if (AssignTo.value == "IGFeed") {
			ValueChannel = document.getElementById('TxtCustomerName').textContent;
		}
		else{
			ValueChannel = document.getElementById('CustID_tChat').value;
		}

		const CustomerIdentity = document.querySelector('[name=CustomerIdentity]');
		const CustID_tChat = document.querySelector('[name=CustID_tChat]');
		CustomerIdentity.value = ValueChannel;
		CustID_tChat.value = document.getElementById('CustID_tChat').value;

		document.querySelector('[name=CustomerID]').value = "";
		document.querySelector('[name=CustomerName]').value = "";
		document.querySelector('[name=PhoneNumber]').value = "";
		document.querySelector('[name=Email]').value = "";
		document.querySelector('[name=CustomerType]').value = "";
		document.querySelector('[name=Cabang]').value = "";
		document.querySelector('[name=Address]').value = "";
        
        try {
			const config = {
				method: 'POST',
				headers: {
					"Content-Type" : "application/json"
				},
				body: JSON.stringify({
					Actions:"ViewCustomer",
					DataValue:CustID
				})
			}
	
			const res = await fetch(UrlWS + '/master/GetDataMaster', config);
			const obj = await res.json();
			const data = obj.data[0];
            // console.log(data);
                        
            if (res.ok) {
                if (obj.data.length > 0) {
					setTimeout(() => {
						// if (CustomerIdentity.value == data.Email) {
							document.querySelector('[name=CustomerID]').value = data.CustomerID;
							document.querySelector('[name=CustomerName]').value = data.Name;
							document.querySelector('[name=PhoneNumber]').value = data.HP;
							document.querySelector('[name=Email]').value = data.Email;
							// document.querySelector('[name=Email]').value = CustomerIdentity.value;
							document.querySelector('[name=CustomerType]').value = data.CusStatus;
							document.querySelector('[name=Cabang]').value = data.Cabang;
							document.querySelector('[name=Address]').value = data.Alamat;
							
						// }
						// else{
						// 	alert('Mohon maaf email tdk sesuai dengan Identity Customer.');
						// 	ViewCustomer(CustomerID.value);
						// }
						$("[name=Cabang]").chosen().val();
						$("[name=Cabang]").trigger("chosen:updated");
	
						$("[name=CustomerType]").chosen().val();
						$("[name=CustomerType]").trigger("chosen:updated");
					}, 1000);
                }
                else{
					console.log('data new');
					document.querySelector('[name=CustomerID]').value = document.getElementById('CustomerID').value;
					document.querySelector('[name=CustID_tChat]').value = document.getElementById('CustID_tChat').value;
					document.querySelector('[name=CustomerName]').value = document.getElementById('TxtCustomerName').textContent;
					document.querySelector('[name=Email]').value = document.getElementById('Email').value;
				}
            }
	
		} 
		catch (error) {
			console.log(error);
		}
    }
	
    CustomerChannel = async (object) => {
		if (object != undefined) {
			try {
				const config = {
					method: 'POST',
					headers: {
						"Content-Type" : "application/json"
					},
					body: JSON.stringify({
						Actions:"CustomerChannel",
						DataValue:object.CustomerID //email value
					})
				}
		
				const res = await fetch(UrlWS + '/master/GetDataMaster', config);
				const obj = await res.json();
				const data = obj.data;
				// console.log(data);
		
				$('.DetailCustomerChannel').DataTable( {
					"data": data,
					"destroy": true,
					"width": "100%",
					"searching": false,
					"paging": false,
        			"info": false,
					"columns" : [
						{ "data" : "CustomerID" },
						{ "data" : "FlagChannel" },
						{ "data" : "ValueChannel" },
						{ "data" : "CustomerID", render: function ( data, type, row ) {
							return `<a href='javascript:ViewCustomer(${data}).then(CloseModal())' class='btn btn-xs btn-success btn-block'>Pilih</a>`;
						} }
					]
				});
				
			} 
			catch (error) {
				console.log(error);
			}
		}
	}

	async function PostCustomerProfile(){
		const Email = document.querySelector('[name=Email]').value;
		const PhoneNumber = document.querySelector('[name=PhoneNumber]').value;

		let FlagChannelValue="";
		if (AssignTo.value == "FBMessenger" || AssignTo.value == "FBMention" || AssignTo.value == "FBFeed") {
			FlagChannelValue = "Facebook";
		}
		else if (AssignTo.value == "DMTwitter" || AssignTo.value == "TWMention") {
			FlagChannelValue = "Twitter";
		}
		else if (AssignTo.value == "IGFeed") {
			FlagChannelValue = "Instagram";
		}
		else {
			FlagChannelValue = "Chat";
		}

		const data = {
            FlagChannel:FlagChannelValue,
            UserCreate:AgentName.value,
            CustomerIdentity:document.querySelector('[name=CustomerIdentity]').value,
            CustomerID:document.querySelector('[name=CustomerID]').value,
            CustID_tChat:document.querySelector('[name=CustID_tChat]').value,
			CustomerName:document.querySelector('[name=CustomerName]').value,
			PhoneNumber:document.querySelector('[name=PhoneNumber]').value,
			Email:document.querySelector('[name=Email]').value,
			CustomerType:document.querySelector('[name=CustomerType]').value,
			Cabang:document.querySelector('[name=Cabang]').value,
			Address:document.querySelector('[name=Address]').value
		}
        console.log(data);

		if (Boolean(Email) == false && data.FlagChannel == "Chat") {
			swal({
				title: "Gagal.",
				text: 'Email kosong harus di isi.',
				icon: "warning",
				button: "Ulang"
			});
		}
		/* else if (Boolean(PhoneNumber) == false) {
			swal({
				title: "Gagal.",
				text: 'No Telp kosong harus di isi.',
				icon: "warning",
				button: "Ulang"
			});
		} */
		else {
		/* else if (CustomerIdentity == Email) { */
			try {
				const config = {
					method: 'POST',
					headers: {
						"Content-Type" : "application/json"
					},
					body: JSON.stringify(data)
				}
		
				const res = await fetch(UrlWS + '/service/Sosmed_UpdateProfile', config);
				const obj = await res.json();
				// const row = obj.data[0];
				// console.log(obj);

				if (res.ok) {
					/* if (row.Status == "Available") {
						swal({
							title: "Gagal.",
							text: `${row.Message}  \nCustomerID : ${row.CustomerID} \nEmail : ${row.Email}`,
							icon: "warning",
							button: "Ulang"
						});
					}
					else{ */
						swal({
							title: "Success.",
							text: "Success Sync Profile.",
							icon: "success",
							button: "Ok",
							timer: 1000
						});
						
						DataConversation.innerHTML = '';
						DataAllCustomer(AgentName.value);
						FormSend.classList.add('hide');
						ChatAktif.classList.add('hide');
						ChatOptions.classList.add('hide');
					// }
					
				}
				
		
			} 
			catch (error) {
				console.log(error);
			}
		}
		/* }
		else {
			alert('Mohon maaf email tdk sesuai dengan Identity Customer.');
		}
         */
        
    }

	
    async function DataCustomer(dhxWindow,value){
		CloseModal = () => { dhxWindow.hide() }

		try {
			const config = {
				method: 'POST',
				headers: {
					"Content-Type" : "application/json"
				},
				body: JSON.stringify({
					Actions:"DataCustomer",
					// DataValue:''
					DataValue:value
				})
			}
	
			
			const res = await fetch(UrlWS + '/master/GetDataMaster', config);
			const obj = await res.json();
			const data = obj.data;
			// console.log(data)
			
			$("#TblDataCustomer").dxDataGrid({
				dataSource: data,
				showBorders: true,
				showRowLines: true,
				hoverStateEnabled: true,
				paging: {
					pageSize: 5
				},
				filterRow: {
					visible: true,
					applyFilter: "auto"
				},
				/* searchPanel: {
					visible: true,
					width: 240,
					placeholder: "Search..."
				}, */
				columns: [{
					dataField: "CustomerID",
					caption: "Customer ID"
				},{
					dataField: "Name",
					caption: "Nama"
				},{
					dataField: "HP",
					caption: "Telp"
				},{
					dataField: "Email",
					caption: "Email"
				},{
					dataField: "Alamat",
					caption: "Alamat"
				},{
					caption: "Action",
					cellTemplate: function (container, options) {
						$("<div>")
							.append(`<a href='javascript:ViewCustomer(${options.data.CustomerID}).then(CloseModal())' class='btn btn-xs btn-success btn-block'>Pilih</a>`)
							.appendTo(container);
					}
				}],
				masterDetail: {
					enabled: true,
					template: async function(container, options) { 
						var object = options.data;

						if (object != undefined) {
							try {
								const config2 = {
									method: 'POST',
									headers: {
										"Content-Type" : "application/json"
									},
									body: JSON.stringify({
										Actions:"CustomerChannel",
										DataValue:object.CustomerID //email value
									})
								}
						
								const res2 = await fetch(UrlWS + '/master/GetDataMaster', config2);
								const obj2 = await res2.json();
								const data2 = obj2.data;
								// console.log(data);
						
								$("<div>")
										.dxDataGrid({
											dataSource: data2,
											columnAutoWidth: true,
											showBorders: true,
											columns: [{
												dataField: "CustomerID",
												caption: "Customer ID"
											},{
												dataField: "FlagChannel",
												caption: "Flag Channel"
											},{
												dataField: "ValueChannel",
												caption: "Value Channel"
											},{
												dataField: "ID",
												caption: "Action",
												cellTemplate: function (container, options) {
													container.html(`<a href='javascript:ViewCustomer(${options.data.CustomerID}).then(CloseModal())' class='btn btn-xs btn-success btn-block'>Pilih</a>`);
												}
											}],
											
										}).appendTo(container);
								
							} 
							catch (error) {
								console.log(error);
							}
						} 
					}
				} 
			});
			
		} 
		catch (error) {
			console.log(error);
		}
	}
	
    async function DataKantorCabang(){
		try {
			const config = {
				method: 'POST',
				headers: {
					"Content-Type" : "application/json"
				},
				body: JSON.stringify({
					Actions:"KantorCabang",
					DataValue:""
				})
			}
	
			const res = await fetch(UrlWS + '/master/GetDataMaster', config);
			const obj = await res.json();
			const data = obj.data;
			// console.log(data);
	
            let html = '';
			let no = 1;
			
			if (data.length > 0) {
				for(let i=0; i < data.length; i++){
					html += `<option value="${data[i].Kode}">${data[i].NamaDaerah} - ${data[i].Jenis} - ${data[i].Alamat} - ${data[i].NoTelp}</option>`;
				}
				document.querySelector('[name=Cabang]').innerHTML = "";
				document.querySelector('[name=Cabang]').innerHTML += html;
				$("[name=Cabang]").chosen().val();
				$("[name=Cabang]").trigger("chosen:updated");
			}
		} 
		catch (error) {
			console.log(error);
		} 
    }

    async function DataTypeCustomer(){
		try {
			const config = {
				method: 'POST',
				headers: {
					"Content-Type" : "application/json"
				},
				body: JSON.stringify({
					Actions:"TypeCustomer",
					DataValue:""
				})
			}
	
			const res = await fetch(UrlWS + '/master/GetDataMaster', config);
			const obj = await res.json();
			const data = obj.data;
			// console.log(data);
	
            let html = '';
            let no = 1;

            for(let i=0; i < data.length; i++){
                html += `<option value="${data[i].Type}">${data[i].Type}</option>`;
            }
            document.querySelector('[name=CustomerType]').innerHTML = "";
			document.querySelector('[name=CustomerType]').innerHTML += html;
			$("[name=CustomerType]").chosen().val();
			$("[name=CustomerType]").trigger("chosen:updated");
			

		} 
		catch (error) {
			console.log(error);
		}
    }

	//validasi number
	isNumberKey = (evt) => {
		var charCode = (evt.which) ? evt.which : Event.keyCode
		if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;

		return true;
    }

	CariCustomer = async (value) => {
		// console.log(value);
		const config = {
			method: 'POST',
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({
				Actions:"ListAllCustomer",
				DataValue:value
			})
		}
		
		try {
			const res = await fetch(UrlWS + '/master/GetDataMaster', config);
			const obj = await res.json();
			const data = obj.data;
			// console.log(data)

			let options = '';
			for(let i=0; i < data.length; i++){
				options += `<option value="${data[i].CustomerID}">
					${data[i].CustomerID} -> ${data[i].Name} ->  ${data[i].Email}
				</option>`;
			}
			$('#list_customer').html(options);
		} 
		catch (error) {
			console.log(error);	
		} 
	}


	async function ModalCustomerProfile(){
	// async function ModalCustomerProfile(CustIdNya, CustIdChannel, CustIdentity, IsNew, AgentName){
		const dhxWindow = new dhx.Window({
			title: "Customer Profile.",
			modal: true,
			header: true,
			footer: true,
			closable: true,
			movable: true,
			resizable: true,
			width: 1000, 
			height: 550
		});
		
		const layout = new dhx.Layout("layout", {
			css: "dhx_layout-cell--bordered",
			fitToContainer: true,
			margin: 0,
			cols: [{
				id: "form",
				header: "Form Customer",
				width: "100%",
				height: "100%",
				padding: 0
			}]
		});
		layout.getCell("form").attachHTML(FormCustomerProfile);
	
		dhxWindow.attach(layout); 
		dhxWindow.show();
		dhxWindow.footer.data.add({
			type: "button",
			size: "medium",
			color: "info",
			value: "Data Customer",
			id: "BtnDataCustomer",
			// icon: "dxi dxi-rotate-right",
			// circle : true
		});
		dhxWindow.footer.data.add({
			type: "spacer",
		});
		dhxWindow.footer.data.add({
			type: "button",
			size: "medium",
			color: "secondary",
			value: "Close",
			id: "BtnCloseModal"
		});
		dhxWindow.footer.data.add({
			type: "button",
			size: "medium",
			color: "success",
			value: "Submit",
			id: "BtnUpdateCustomer"
		});
		dhxWindow.footer.events.on("click", function(id) {
			if (id == "BtnUpdateCustomer") {
				PostCustomerProfile();
				dhxWindow.hide();
				
			}
			else if(id == 'BtnDataCustomer'){
				ModalDataCustomer();
			}
			else if(id == 'BtnCloseModal'){
				// PostResetProfile();
				dhxWindow.hide();
			}
		});

		window.setTimeout(()=>{ViewCustomer(CustomerID.value)}, 1000);
	}

	async function ModalDataCustomer(){
		const dhxWindow = new dhx.Window({
			title: "Data Customer.",
			id:"ModalDataCustomer",
			modal: true,
			header: true,
			footer: true,
			closable: true,
			movable: true,
			resizable: true,
			width: 1000, 
			height: 550,
		});
		
		const layout = new dhx.Layout("layout", {
			css: "dhx_layout-cell--bordered",
			fitToContainer: true,
			margin: 0,
			cols: [{
				id: "table",
				header: false,
				width: "100%",
				height: "100%",
				padding: 10
			}]
		});
		layout.getCell("table").attachHTML(TblDataCustomer);
	
		dhxWindow.attach(layout); 
		dhxWindow.show();

		// dhxWindow.setFullScreen(); //auto fullscreen
		let isFullScreen = false, oldSize = null, oldPos = null;
		dhxWindow.header.data.add({icon: "dxi dxi-arrow-expand", id: "fullscreen"}, 2);
		dhxWindow.header.events.on("click", function(id) {
			if (id === "fullscreen") {
				if (isFullScreen) {
					dhxWindow.setSize(oldSize.width, oldSize.height);
					dhxWindow.setPosition(oldPos.left, oldPos.top);
				} else {
					oldSize = dhxWindow.getSize();
					oldPos = dhxWindow.getPosition();
					dhxWindow.setFullScreen();
				}
				isFullScreen = !isFullScreen;
			}
		});
		dhxWindow.footer.data.add({
			type: "spacer",
		});
		dhxWindow.footer.data.add({
			type: "button",
			size: "medium",
			color: "secondary",
			value: "Close",
			id: "BtnCloseModal"
		});
		dhxWindow.footer.events.on("click", function(id) {
			if(id == 'BtnCloseModal'){
				// PostResetProfile();
				dhxWindow.hide();
			}
		});

		window.setTimeout(()=>{
			DataCustomer(dhxWindow,"");
			ClickSearch = async (value) => {
				DataCustomer(dhxWindow, value);
			}
		}, 1000);

		
	}

	const FormCustomerProfile = `<form id="FormCustomerProfile" class="mt-10">
		<div class="row ml-10 mr-10">
			<input type="hidden" name="CustomerID">
			<input type="hidden" name="CustID_tChat">
			<input type="hidden" name="IsNew">
			<input type="hidden" name="AgentName">

			<div class="col-md-6 form-group">
				<div class="form-group">
					<label>Customer Name</label>
					<input type="text" name="CustomerName" class="form-control form-control-sm" placeholder="Customer Name">
					<small class="form-text text-muted">
						Masukan nama lengkap customer.
					</small>
				</div>
			</div>
			<div class="col-md-6 form-group">
				<div class="form-group">
					<label>Identity Customer</label>
					<input type="text" name="CustomerIdentity" class="form-control form-control-sm" placeholder="Account Identity"  readonly>
					<small id="textblok" class="form-text text-muted">
						Identitas Akun sosial media.
					</small>
				</div>
			</div>

			<div class="col-md-6 form-group">
				<div class="form-group">
					<label>Email</label>
					<input type="email" name="Email" placeholder="Email" class="form-control form-control-sm">
				</div>
			</div>
			<div class="col-md-6 form-group">
				<div class="form-group">
					<label>Phone Number</label>
					<input placeholder="Phone Number" type="number" name="PhoneNumber" class="form-control form-control-sm" onkeypress="return isNumberKey(event)">
				</div>
			</div>

			<div class="col-md-4 form-group">
				<label>Customer Type</label>
				<select class="form-control custom-select form-control-sm custom-select-sm chosen-select" name="CustomerType" required></select>
			</div>
			<div class="col-md-8 form-group">
				<label>Kantor Cabang</label>
				<select class="form-control custom-select form-control-sm custom-select-sm chosen-select" name="Cabang" required></select>
			</div>
			
			<div class="col-md-12 form-group">
				<label>Address</label>
				<textarea name="Address" class="form-control mb-0" rows="3" placeholder="Address.." style="height: 120px;"></textarea>
			</div>
		</div>   
	</form>`;

	const TblDataCustomer = `<div class="row mb-10">
		<div class="col-lg-4">
			<div class="input-group">
				<input type="text" class="form-control form-control-sm" list="list_customer" id="txt_cari" onkeyup="CariCustomer(this.value)" onchange="ClickSearch(document.getElementById('txt_cari').value)" placeholder="CustomerID, Name, Email">
				<span class="input-group-btn">
					<button class="btn btn-light btn-sm" type="button" id="btn_search" onclick="ClickSearch(document.getElementById('txt_cari').value)">Search</button>
				</span>
			</div>
			<datalist id="list_customer">
				<!-- <option value="Safari">Safari | 89 </option> -->
			</datalist> 
		</div>
	</div>
	<div class="demo-container">
		<div id="TblDataCustomer"></div>
	</div>`;
});


/* const TblDataCustomer = `<div class="row mb-10">
		<div class="col-lg-4">
			<div class="input-group">
				<input type="text" class="form-control form-control-sm" list="list_customer" id="txt_cari" onkeyup="CariCustomer(this.value)" placeholder="CustomerID, Name, Email">
				<span class="input-group-btn">
					<button class="btn btn-light btn-sm" type="button" id="btn_search" onclick="ClickSearch(document.getElementById('txt_cari').value)">Search</button>
				</span>
			</div>
		<datalist id="list_customer">
				<!-- <option value="Safari">Safari | 89 </option> -->
			</datalist> 
		</div>
	</div>

	<table class="table table-striped table-bordered" width="100%" id="TblDataCustomer">
		<thead>
			<tr>
				<th>View</th>
				<th>CustomerID</th>
				<th>Name</th>
				<th>HP</th>
				<th>Email</th>
				<th>Address</th>
				<th>Action</th>
			</tr>
		</thead>
	</table>`;
	 */