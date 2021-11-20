document.addEventListener("DOMContentLoaded", function(){
	// const UrlWS = 'https://invision.ddns.net:30008/ApiMendawai';
    const UrlWS = 'https://selindo.mendawai.com/ApiMendawai';
    const BtnRefresh = document.getElementById('BtnRefresh');
    BtnRefresh.addEventListener('click', ListAcountChannel);

    async function ListAcountChannel(){
        try {
            const config = {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    Data1:"AccountChannel",
                    Data2:"",
                    Data3:"",
                    Data4:"",
                    Data5:""
                })
            }
            const res = await fetch(UrlWS + '/SP_SosialMedia', config);
            const json = await res.json();
            const data = json.data;
            // console.log(data);

            $("#tbl_account_channel").dxDataGrid({
				dataSource: data,
                allowColumnReordering: true,
				showBorders: true,
				showRowLines: true,
				hoverStateEnabled: true,
				paging: {
					pageSize: 10
				},
				filterRow: {
					visible: true,
					applyFilter: "auto"
				},
				searchPanel: {
					visible: true,
					width: 240,
					placeholder: "Search..."
				},
                grouping: {
                    autoExpandAll: true,
                },
				columns: [{
                    dataField: "Channel",
                    groupIndex: 0
                },{
					dataField: "PageName",
					caption: "Page Name",
                    cellTemplate: function (container, options) {
                        let dataParams = options.data;
                        if(dataParams.Channel == "Facebook"){
                            icon = 'dist/img/icon/facebook.png';
                        }
                        else if(dataParams.Channel == "Instagram"){
                            icon = 'dist/img/icon/instagram.png';
                        }
                        else if(dataParams.Channel == "Twitter"){
                            icon = 'dist/img/icon/twitter.png';
                        }

						$("<div>")
							.append(`<div class="media align-items-center">
                                <div class="media-img-wrap d-flex mr-10">
                                    <div class="avatar avatar-xs">
                                        <img src="${icon}" alt="${dataParams.Channel}" class="avatar-img rounded-circle">
                                    </div>
                                </div>
                                <div class="media-body">
                                    <span class="d-block">${dataParams.PageName}</span>
                                </div>
                            </div>`)
							.appendTo(container);
					}
				},{
					dataField: "PageID",
					caption: "Page ID"
				},{
					dataField: "AccountName",
					caption: "Accoun tName"
				},{
					dataField: "AccountID",
					caption: "Account ID"
				},{
					caption: "Action",
					cellTemplate: function (container, options) {
                        let dataParams = JSON.stringify(options.data);
						$("<div>")
							.append(`<button type="button" name="BtnUnsubcribe" class="btn btn-dark btn-sm" onclick='UnsubcribeChannel(${dataParams})'>Unsubcribe</button>`)
							.appendTo(container);
					}
				}]
			});          
        } 
        catch (error) {
            console.log(error);    
        }

    }
    ListAcountChannel();

    UnsubcribeChannel = async (obj) => {
        // console.log(obj);
        let DataBody,url;
        if (obj.Channel == "Facebook") {
            url = `${UrlWS}/sosialapi/FacebookUnsubcribe`; 
            DataBody = JSON.stringify({
                pagetoken:obj.PageToken,
                pageid:obj.PageID
            });
        }
        else if (obj.Channel == "Twitter") {
            url = `${UrlWS}/sosialapi/TwitterUnsubcribe`; 
            DataBody = JSON.stringify({
                oauth_token:obj.PageToken,
                oauth_token_secret:obj.PageTokenSecret
            });
        }
        else if (obj.Channel == "Instagram") {
            url = `${UrlWS}/sosialapi/FacebookUnsubcribe`; 
            DataBody = JSON.stringify({
                pagetoken:obj.PageToken,
                pageid:obj.PageID
            });
        }

        swal({
            title: "Unsubcribe.",
            text: "Apakah kamu yakin unsubcribe channel?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async (unsubcribe) => {
            if (unsubcribe) {
                try {
                    const config = {
                        method: 'POST',
                        headers: {
                            "Content-Type" : "application/json"
                        },
                        body: DataBody
                    }
                    const res = await fetch(url, config);
                    const json = await res.json();
                    // console.log(json);

                    if (json.message == "success") {
                        swal({
                            title: json.message,
                            text: "Akun berhasil unsubribe channel",
                            icon: "success",
                            button: "Ok"
                        })
                        .then(()=>{
                            const config = {
                                method: 'POST',
                                headers: {
                                    "Content-Type" : "application/json"
                                },
                                body: JSON.stringify({
                                    Data1:"UnsubcribeChannel",
                                    Data2:obj.Channel,
                                    Data3:obj.PageID,
                                    Data4:"",
                                    Data5:""
                                })
                            }
                            // console.log(config);
                            fetch(UrlWS + '/SP_SosialMedia', config).then(res => res.json()).then(res => console.log(res));
                            ListAcountChannel();
                        })
                        .then(ListAcountChannel());
                    } 
                    else {
                        swal({
                            title: json.message,
                            text: json.data,
                            icon: "error",
                            button: "Ok"
                        }); 
                    }
                    

                } 
                catch (error) {
                    console.log(error);    
                }
            }
        }); 
    }
});