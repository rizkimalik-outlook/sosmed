document.addEventListener("DOMContentLoaded", function(){
    const GlobalUrl = 'https://selindo.mendawai.com';
    const UrlWS = `${GlobalUrl}/ApiMendawai`;
    const UrlImageFeed = `${GlobalUrl}/ApiBounty2/ImageSaveFeed`;
    
    const ListDataPost = document.getElementById('ListDataWallPost');
    const ListDataPostODD = document.getElementById('ListDataWallPostODD');
    const ListDataPostEVEN = document.getElementById('ListDataWallPostEven');
    const BtnCreatePost = document.getElementById('BtnCreatePost');
    const SelectAccount = document.getElementById('SelectAccount');
    
    // const BtnRefresh = document.getElementById('BtnRefresh');
    // BtnRefresh.addEventListener('click', ListAcountChannel);
    BtnCreatePost.addEventListener('click', (e)=>{
        e.preventDefault();
        popup.show();
        SelectTokenAccount();
    });
    SelectAccount.addEventListener('change', (e)=>{
        e.preventDefault();
        ListDataWallPost();
        // console.log(SelectAccount.value);
    });

    async function ListDataWallPost(){
        try {
            const config = {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    Actions:"ListDataWallPost",
                    DataValue:SelectAccount.value,
                })
            }
            const res = await fetch(UrlWS + '/master/GetDataMaster', config);
            const json = await res.json();
            const data = json.data;
            // console.log(data);

            let html='';
            let html_odd='';
            let html_even='';
            let i=0;
            while (data[i]) {
                let icon='';
                if (data[i].Channel == 'Facebook') {
                    icon = 'dist/img/icon/facebook.png';
                } 
                else if (data[i].Channel == 'Twitter'){
                    icon = 'dist/img/icon/twitter.png';
                }
                else if (data[i].Channel == 'Instagram'){
                    icon = 'dist/img/icon/instagram.png';
                }
                
                let Media = ['', null].includes(data[i].FileName) == true ? '' : `<img src="${UrlImageFeed}/${data[i].FileName}" alt="Feed Post" class="col-12">`;

                if (i & 1) {
                    html_odd += `<div class="">
                        <div class="card card-profile-feed">
                            <div class="card-header card-header-action">
                                <div class="media align-items-center">
                                    <div class="media-img-wrap d-flex mr-10">
                                        <div class="avatar avatar-sm">
                                            <img src="${icon}" alt="user" class="avatar-img rounded-circle">
                                        </div>
                                    </div>
                                    <div class="media-body">
                                        <div class="text-capitalize font-weight-500 text-dark">${data[i].PageName}</div>
                                        <div class="font-12">${data[i].DateCreate}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-capitalize font-weight-500 text-dark">${data[i].Channel}</div>
                                    <div class="text-capitalize font-weight-500 text-dark">${data[i].PageName}</div>
                                </div>
                            </div>
                            <div class="card-body">
                                <p class="card-text mb-10">${data[i].Message}</p>
                                ${Media}
                            </div>
                            <div class="card-footer justify-content-between hide">
                                <div>
                                    <a href="#"><i class="ion ion-md-heart"></i>0</a>
                                </div>
                                <div>
                                    <a href="#">0 comments</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
                else {
                    html_even += `<div class="">
                    <div class="card card-profile-feed">
                        <div class="card-header card-header-action">
                            <div class="media align-items-center">
                                <div class="media-img-wrap d-flex mr-10">
                                    <div class="avatar avatar-sm">
                                        <img src="${icon}" alt="user" class="avatar-img rounded-circle">
                                    </div>
                                </div>
                                <div class="media-body">
                                    <div class="text-capitalize font-weight-500 text-dark">${data[i].PageName}</div>
                                    <div class="font-12">${data[i].DateCreate}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-capitalize font-weight-500 text-dark">${data[i].Channel}</div>
                                <div class="text-capitalize font-weight-500 text-dark">${data[i].PageName}</div>
                            </div>
                        </div>
                        <div class="card-body">
                            <p class="card-text mb-10">${data[i].Message}</p>
                            ${Media}
                        </div>
                        <div class="card-footer justify-content-between hide">
                            <div>
                                <a href="#"><i class="ion ion-md-heart"></i>0</a>
                            </div>
                            <div>
                                <a href="#">0 comments</a>
                            </div>
                        </div>
                    </div>
                </div>`;
                }

                /* html += `<div class="col-lg-6">
                    <div class="card card-profile-feed">
                        <div class="card-header card-header-action">
                            <div class="media align-items-center">
                                <div class="media-img-wrap d-flex mr-10">
                                    <div class="avatar avatar-sm">
                                        <img src="${icon}" alt="user" class="avatar-img rounded-circle">
                                    </div>
                                </div>
                                <div class="media-body">
                                    <div class="text-capitalize font-weight-500 text-dark">${data[i].PageName}</div>
                                    <div class="font-12">${data[i].DateCreate}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-capitalize font-weight-500 text-dark">${data[i].Channel}</div>
                                <div class="text-capitalize font-weight-500 text-dark">${data[i].PageName}</div>
                            </div>
                        </div>
                        <div class="card-body">
                            <p class="card-text mb-10">${data[i].Message}</p>
                            ${Media}
                        </div>
                        <div class="card-footer justify-content-between">
                            <div>
                                <a href="#"><i class="ion ion-md-heart"></i>0</a>
                            </div>
                            <div>
                                <a href="#">0 comments</a>
                            </div>
                        </div>
                    </div>
                </div>`; */

                i++;
            }
            // ListDataPost.innerHTML = "";
            // ListDataPost.innerHTML += html;
            ListDataPostODD.innerHTML = "";
            ListDataPostODD.innerHTML += html_odd;
            ListDataPostEVEN.innerHTML = "";
            ListDataPostEVEN.innerHTML += html_even;
        
        } 
        catch (error) {
            console.log(error);    
        }

    }
    ListDataWallPost();

    async function SelectPageAccount(){
        try {
            const config = {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    Actions:"ViewToken",
                    DataValue:"",
                })
            }
            const res = await fetch(UrlWS + '/master/GetDataMaster', config);
            const json = await res.json();
            const data = json.data;
            // console.log(data);

            let html='<option selected value="All Post">All Post</option>';
            let i=0;
            while (data[i]) {
                html += `<option value="${data[i].PageID}">${data[i].Channel} - ${data[i].PageName}</option>`;
                i++;
            }
            SelectAccount.innerHTML = "";
            SelectAccount.innerHTML += html;
            // $(".chosen-select").chosen();
        } 
        catch (error) {
            console.log(error);    
        }

    }
    SelectPageAccount();

    async function SelectTokenAccount(){
        const SelectToken = document.getElementById('SelectToken');
        try {
            const config = {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    Actions:"ViewToken",
                    DataValue:"",
                })
            }
            const res = await fetch(UrlWS + '/master/GetDataMaster', config);
            const json = await res.json();
            const data = json.data;
            // console.log(data);

            //filter not instagram
            let DataPost = data.filter(function (e) {
                return e.Channel != 'Instagram';
            });

            let html='<option selected value="0">Select Account</option>';
            let i=0;
            while (DataPost[i]) {
                html += `<option channel="${DataPost[i].Channel}" page-id="${DataPost[i].PageID}" page-token="${DataPost[i].PageToken}" page-token-secret="${DataPost[i].PageTokenSecret}">${DataPost[i].Channel} - ${DataPost[i].PageName}</option>`;
                i++;
            }
            SelectToken.innerHTML = "";
            SelectToken.innerHTML += html;
        } 
        catch (error) {
            console.log(error);    
        }

        GetToken = (obj) => {
            document.getElementById('PageID').value = obj.options[obj.selectedIndex].getAttribute('page-id');
            document.getElementById('PageToken').value = obj.options[obj.selectedIndex].getAttribute('page-token');
            document.getElementById('PageTokenSecret').value = obj.options[obj.selectedIndex].getAttribute('page-token-secret');
            document.getElementById('Channel').value = obj.options[obj.selectedIndex].getAttribute('channel');
        }
    }

    async function PublishDataPost() {  
        const databody = {
            PageID:document.getElementById('PageID').value,
            PageToken:document.getElementById('PageToken').value,
            PageTokenSecret:document.getElementById('PageTokenSecret').value,
            StatusMessage:document.getElementById('StatusMessage').value,
            MediaName:document.getElementById('MediaTitle').textContent,
            ImgBase64:document.getElementById('MediaID').value, //img_base64
            Channel:document.getElementById('Channel').value
        }

        if (databody.ImgBase64 != "") {
            const config = {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(databody)
            }
            if (databody.Channel == 'Twitter') {
                const res = await fetch(UrlWS + '/sosialapi/TwitterUploadMedia', config);
                const json = await res.json();
                const row = json.data;
                // console.log(row);
                if (json.message == "success") {
                    const config2 = {
                        method: 'POST',
                        headers: {
                            "Content-Type" : "application/json"
                        },
                        body: JSON.stringify({
                            PageToken:databody.PageToken,
                            PageTokenSecret:databody.PageTokenSecret,
                            StatusMessage:databody.StatusMessage,
                            MediaID:row.media_id_string,
                        })
                    }
                    const res2 = await fetch(UrlWS + '/sosialapi/TwitterPostTweet', config2);
                    const json2 = await res2.json();
                    const data2 = json2.data;

                    if (json2.message == "success") {
                        swal({
                            title: "Success.",
                            text: "Wall post status berhasil terkirim.",
                            icon: "success",
                            button: "Ok"
                        });
                        const ParamData = {
                            page_token : databody.PageToken,       
                            page_token_secret : databody.PageTokenSecret,       
                            channel : databody.Channel,       
                            mention_id : data2.mention_id,       
                            file_name : json.file_name,       
                        }
                        DetailWallPost(ParamData);
                    }
                    else{
                        swal({
                            title: "Gagal.",
                            text: "Wall post gagal terkirim!! " + data2,
                            icon: "error",
                            button: "Ok"
                        });
                    }
                }
            }
            else if(databody.Channel == 'Facebook'){
                const config2 = {
                    method: 'POST',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        PageID:databody.PageID,
                        PageToken:databody.PageToken,
                        StatusMessage:databody.StatusMessage,
                        ImgBase64:databody.ImgBase64
                    })
                }
                const res2 = await fetch(UrlWS + '/sosialapi/FacebookPostFeedMedia', config2);
                const json2 = await res2.json();
                const data2 = json2.data;
                // console.log(data2);

                if (json2.message == "success") {
                    swal({
                        title: "Success.",
                        text: "Wall post status berhasil terkirim.",
                        icon: "success",
                        button: "Ok"
                    });
                    const ParamData = {
                        page_id : databody.PageID,             
                        page_token : databody.PageToken,             
                        channel : databody.Channel,       
                        feed_id : data2.post_id,
                        file_name :  json2.file_name      
                    }
                    DetailWallPost(ParamData);
                }
                else{
                    swal({
                        title: "Gagal.",
                        text: "Wall post gagal terkirim!! " + data2,
                        icon: "error",
                        button: "Ok"
                    });
                }
            }
        }
        else{
            if (databody.Channel == 'Twitter') {
                const config2 = {
                    method: 'POST',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        PageToken:databody.PageToken,
                        PageTokenSecret:databody.PageTokenSecret,
                        StatusMessage:databody.StatusMessage,
                        MediaID:"",
                    })
                }
                const res2 = await fetch(UrlWS + '/sosialapi/TwitterPostTweet', config2);
                const json2 = await res2.json();
                const data2 = json2.data;
                // console.log(data2);
                 
                if (json2.message == "success") {
                    swal({
                        title: "Success.",
                        text: "Wall post status berhasil terkirim.",
                        icon: "success",
                        button: "Ok"
                    });
                    const ParamData = {
                        page_token : databody.PageToken,       
                        page_token_secret : databody.PageTokenSecret,       
                        channel : databody.Channel,       
                        mention_id : data2.mention_id,
                        file_name : ""       
                    }
                    DetailWallPost(ParamData);
                }
                else{
                    swal({
                        title: "Gagal.",
                        text: "Wall post gagal terkirim!! " + data2,
                        icon: "error",
                        button: "Ok"
                    });
                }
            }
            else if(databody.Channel == 'Facebook'){
                const config2 = {
                    method: 'POST',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        PageID:databody.PageID,
                        PageToken:databody.PageToken,
                        StatusMessage:databody.StatusMessage
                    })
                }
                const res2 = await fetch(UrlWS + '/sosialapi/FacebookPostFeed', config2);
                const json2 = await res2.json();
                const data2 = json2.data;
                // console.log(data2);

                if (json2.message == "success") {
                    swal({
                        title: "Success.",
                        text: "Wall post status berhasil terkirim.",
                        icon: "success",
                        button: "Ok"
                    });
                    
                    const ParamData = {
                        page_id : databody.PageID,             
                        page_token : databody.PageToken,             
                        channel : databody.Channel,       
                        feed_id : data2.id,
                        file_name : ""       
                    }
                    DetailWallPost(ParamData);
                }
                else{
                    swal({
                        title: "Gagal.",
                        text: "Wall post gagal terkirim!! " + data2,
                        icon: "error",
                        button: "Ok"
                    });
                }
            }
        }

        RemoveMedia();
        document.getElementById('FormCreatePost').reset();
    }
    
    async function DetailWallPost(obj) {
        // console.log(obj);
        if (obj.channel == 'Twitter') {
            const config = {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    oauth_token:obj.page_token,
                    oauth_token_secret:obj.page_token_secret,
                    mention_id:obj.mention_id,
                })
            }
            const res = await fetch(UrlWS + '/sosialapi/TwitterDetailTweet', config);
            const json = await res.json();
            // console.log(json);
            
            if (json.message == 'success') {
                const configpost = {
                    method: 'POST',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        PostID:json.data.id_str,
                        UserCreate:json.data.user.screen_name,
                        Message:json.data.text,
                        PermalinkUrl:`https://twitter.com/i/web/status/${json.data.id_str}`,
                        PageID:json.data.user.id_str,
                        Channel:obj.channel,
                        FileName:obj.file_name,
                    })
                }
                const respost = await fetch(UrlWS + '/service/Sosmed_GetSosmedPost', configpost);
                const jsonpost = await respost.json();
                console.log(jsonpost);
                ListDataWallPost();
            }
        }  
        else if (obj.channel == 'Facebook') {
            const config = {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    pagetoken:obj.page_token,
                    feedid:obj.feed_id,
                })
            }
            const res = await fetch(UrlWS + '/sosialapi/FacebookFeedDetail', config);
            const json = await res.json();
            // console.log(json);

            if (json.message == 'success') {
                const configpost = {
                    method: 'POST',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        PostID:json.data.id,
                        UserCreate:json.data.from.name,
                        Message:json.data.message,
                        PermalinkUrl:json.data.permalink_url,
                        PageID:json.data.from.id,
                        Channel:obj.channel,
                        FileName:obj.file_name,
                    })
                }
                // console.log(configpost);
                const respost = await fetch(UrlWS + '/service/Sosmed_GetSosmedPost', configpost);
                const jsonpost = await respost.json();
                console.log(jsonpost);
                ListDataWallPost();
            }
        }
    }

    EncodeBase64 = (element) => {
        let file = element.files[0];
        let name = file.name;
        let size = file.size;
        let tipe = file.type;
        // console.log(file);
        
        //max 2mb
        if(size <= 2000000){ 
            if(tipe.split('/')[0] == "image" || tipe.split('/')[0] == "video") {	
                let reader = new FileReader();
                reader.onloadend = function () {
                    const MediaDisply = document.getElementById('MediaDisply');
                    const MediaFigure = document.getElementById('MediaFigure');
                    const MediaTitle = document.getElementById('MediaTitle');
                    const MediaID = document.getElementById('MediaID');
                    MediaFigure.classList.remove('hide');

                    MediaDisply.innerHTML = "";
                    if (tipe.split('/')[0] == "image") {
                        const img = `<img src="${reader.result}" width="60" height="60" alt="${name}" />`;
                        MediaDisply.innerHTML = img;
                    }
                    else{
                        const video = `<video width="60" height="60" controls>
                            <source src="${reader.result}" type="video/mp4">
                            <source src="${reader.result}" type="video/ogg">
                            Your browser does not support the video tag.
                        </video>`;
                        MediaDisply.innerHTML = video;
                    }

                    MediaTitle.innerHTML = name;
                    MediaID.value = reader.result;
                    // console.log(reader.result);
                }
                reader.readAsDataURL(file);
            }else{
                swal({
                    title: "warning.",
                    text: "Media format image / video.",
                    icon: "warning",
                    button: "Ok"
                });
            }
        }else{
            swal({
                title: "warning.",
                text: "Media max size 2MB.",
                icon: "warning",
                button: "Ok"
            });
        }
    }
    
    RemoveMedia = () => {
        document.getElementById('MediaDisply').innerHTML = "";
        document.getElementById('MediaAttach').innerHTML = "";
        document.getElementById('MediaTitle').innerHTML = "";
        document.getElementById('MediaFigure').classList.add('hide');
    }


    const ContentFormCreatePost = function() {
        return $("<div>").append(
            $(`<form id="FormCreatePost" class="mt-10">
                <div class="row ml-10 mr-10">
                    <div class="col-md-6 form-group">
                        <label>Select Account / Fan Page</label>
                        <select class="form-control custom-select form-control-sm custom-select-sm chosen-select" id="SelectToken" required onchange="GetToken(this)"></select>
                        <input type="hidden" id="PageID">
                        <input type="hidden" id="PageToken">
                        <input type="hidden" id="PageTokenSecret">
                        <input type="hidden" id="Channel">
                    </div>
                    <div class="col-md-6 form-group"></div>
                    <div class="col-md-12 form-group">
                        <label>Status</label>
                        <textarea id="StatusMessage" class="form-control mb-0" rows="3" placeholder="Write something about you.." style="height: 200px;"></textarea>
                    </div>
                    <div class="col-md-12 form-group">
                        <input type="hidden" id="MediaID" class="hide">
                        <input type="file" id="MediaAttach" class="hide" onchange="EncodeBase64(this)">
                        <button type="button" class="btn btn-light btn-wth-icon icon-wthot-bg btn-sm" onclick="document.querySelector('#MediaAttach').click();">
                            <span class="icon-label"><i class="fa fa-camera"></i> </span><span class="btn-text">Media</span>
                        </button>
                    </div>
                    <div class="col-md-12 form-group">
                        <figure class="figure mb-15 hide" id="MediaFigure">
                            <button type="button" class="btn btn-icon btn-icon-only btn-secondary btn-icon-style-4" onclick="RemoveMedia()"><i class="icon-close"></i></button>
                            <div id="MediaDisply"></div>
                            <figcaption class="figure-caption" id="MediaTitle"></figcaption>
                        </figure>
                    </div>
                </div>   
            </form>`)
        );
    }

    const popup = $("#popup").dxPopup({
        contentTemplate: ContentFormCreatePost,
        width: 800,
        height: 600,
        container: ".dx-viewport",
        showTitle: true,
        title: "Create Post",
        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: true,
        showCloseButton: true,
        position: {
            at: "center",
            my: "center"
        },
        toolbarItems: [{
          widget: "dxButton",
          toolbar: "bottom",
          location: "after",
          options: {
            text: "Publish",
            onClick: function(e) {
                PublishDataPost();
                popup.hide();
            }
          }
        }]
    }).dxPopup("instance");

    
});