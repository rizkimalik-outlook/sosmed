import { 
    UrlApiMendawai,
    DataConversation,
    FormSend,
    ChatAktif,
    ChatOptions,
    CustomerID,
    AgentName,
    AssignTo,
} from "./const_elements.js";
import DataAllCustomer from "./list_customers.js";


const ViewCustomer =  async (CustID) => {
    let ValueChannel = "";
    if (AssignTo.value == "IGFeed") {
        ValueChannel = document.getElementById('TxtCustomerName').textContent;
    }
    else if (AssignTo.value == "Chat") {
        ValueChannel = document.getElementById('CustIdentity').value;
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

        const res = await fetch(UrlApiMendawai + '/master/GetDataMaster', config);
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
                        document.querySelector('[name=Address]').value = data.Alamat;
                        // document.querySelector('[name=Email]').value = CustomerIdentity.value;
                        // document.querySelector('[name=CustomerType]').value = data.CusStatus;
                        // document.querySelector('[name=Cabang]').value = data.Cabang;
                        
                    // }
                    // else{
                    // 	alert('Mohon maaf email tdk sesuai dengan Identity Customer.');
                    // 	ViewCustomer(CustomerID.value);
                    // }
                    $("[name=CustomerType]").dxSelectBox("instance").option("value", data.CusStatus);  
                    $("[name=Cabang]").dxDropDownBox("instance").option("value", [data.Cabang]);  
                    
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

    const CustomerType = $("[name=CustomerType]").dxSelectBox("instance"); 
    const Cabang = $("[name=Cabang]").dxDropDownBox("instance"); 

    const data = {
        FlagChannel:FlagChannelValue,
        UserCreate:AgentName.value,
        CustomerIdentity:document.querySelector('[name=CustomerIdentity]').value,
        CustomerID:document.querySelector('[name=CustomerID]').value,
        CustID_tChat:document.querySelector('[name=CustID_tChat]').value,
        CustomerName:document.querySelector('[name=CustomerName]').value,
        PhoneNumber:document.querySelector('[name=PhoneNumber]').value,
        Email:document.querySelector('[name=Email]').value,
        // CustomerType:document.querySelector('[name=CustomerType]').value,
        // Cabang:document.querySelector('[name=Cabang]').value,
        CustomerType:CustomerType.option('value'),
        Cabang:Cabang.option('value')[0],
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
    
            const res = await fetch(UrlApiMendawai + '/service/Sosmed_UpdateProfile', config);
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


async function DataCustomer(CustID){
    try {
        const config = {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                Actions: "DataCustomer",
                DataValue: CustID
            })
        }

        
        const res = await fetch(UrlApiMendawai + '/master/GetDataMaster', config);
        const obj = await res.json();
        const data = obj.data;
        
        $("#TblDataCustomer").dxDataGrid({
            dataSource: data,
            showBorders: true,
            showRowLines: true,
            rowAlternationEnabled: true,
            hoverStateEnabled: true,
            paging: {
                pageSize: 10
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
                width: 100,
                cellTemplate: function (container, options) {
                    $("<div>")
                        .append(`<button type='button' class='btn btn-xs btn-primary btn-block BtnViewCust' id='id-${options.data.CustomerID}' >Pilih</button>`)
                        .appendTo(container);

                    let BtnViewCust = document.getElementById(`id-${options.data.CustomerID}`)
                        BtnViewCust.addEventListener('click', (e) => {
                            e.preventDefault();
                            ViewCustomer(options.data.CustomerID);
                            $("#ModalDataCustomer").dxPopup("instance").hide();
                        });
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
                    
                            const res2 = await fetch(UrlApiMendawai + '/master/GetDataMaster', config2);
                            const obj2 = await res2.json();
                            const data2 = obj2.data;
                            // console.log(data);
                    
                            $("<div>").dxDataGrid({
                                dataSource: data2,
                                columnAutoWidth: true,
                                showRowLines: true,
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
                                },/* {
                                    dataField: "ID",
                                    caption: "Action",
                                    cellTemplate: function (container, options) {
                                        // container.html(`<a href='javascript:ViewCustomer(${options.data.CustomerID}).then(CloseModal())' class='btn btn-xs btn-success btn-block'>Pilih</a>`);
                                        container.html(`<button type="button" class='btn btn-xs btn-success btn-block BtnDetailCust' value='${options.data.CustomerID}'>Pilih</button>`);
                                    }
                                } */],
                                
                            }).appendTo(container);
                            
                        } 
                        catch (error) {
                            console.log(error);
                        }
                    } 
                }
            } 
        });

        ///? Search customer
        CariCustomer();

        $("#btn_search").dxButton({
            stylingMode: "outlined",
            text: "Search",
            type: "default",
            onClick: function() {
                // DevExpress.ui.notify("The Outlined button was clicked");
                const valSearch = $("#txt_search").dxDropDownBox("instance"); 
                const CustID = valSearch.option('value')[0] ?? '';
                DataCustomer(CustID);
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

        const res = await fetch(UrlApiMendawai + '/master/GetDataMaster', config);
        const obj = await res.json();
        const data = obj.data;
        
        var dataGrid;
        $("[name=Cabang]").dxDropDownBox({
            placeholder: "Pilih Cabang...",
            // value: [0],
            valueExpr: "Kode",
            displayExpr: "NamaDaerah",
            showClearButton: true,
            dataSource: new DevExpress.data.ArrayStore({
                data: data,
                key: "Kode"
            }),
            contentTemplate: function(e){
                var value = e.component.option("value"),
                    $dataGrid = $("<div>").dxDataGrid({
                        dataSource: e.component.getDataSource(),
                        columns: ["Nama", "Kode", "NamaDaerah","Jenis","Alamat","KantorCabang","NoTelp"],
                        hoverStateEnabled: true,
                        paging: { enabled: true, pageSize: 10 },
                        filterRow: { visible: true },
                        scrolling: { mode: "virtual" },
                        height: 345,
                        selection: { mode: "single" },
                        selectedRowKeys: value,
                        onSelectionChanged: function(selectedItems){
                            var keys = selectedItems.selectedRowKeys;
                            e.component.option("value", keys);
                        }
                    });
                
                dataGrid = $dataGrid.dxDataGrid("instance");
                
                e.component.on("valueChanged", function(args){
                    var value = args.value;
                    dataGrid.selectRows(value, false);
                });
                
                return $dataGrid;
            }
        });

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

        const res = await fetch(UrlApiMendawai + '/master/GetDataMaster', config);
        const obj = await res.json();
        const data = obj.data;

        $("[name=CustomerType]").dxSelectBox({
            dataSource: new DevExpress.data.ArrayStore({
                data: data,
                key: "Type"
            }),
            showClearButton: true,
            displayExpr: "Type",
            valueExpr: "Type",
            // value: data[0].Type,
            searchEnabled: true
        }).dxSelectBox("instance");
    } 
    catch (error) {
        console.log(error);
    }
}

//validasi number
const isNumberKey = (evt) => {
    var charCode = (evt.which) ? evt.which : Event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    else {
        return true;
    }

}

let CariCustomer = async () => {
    const config = {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            Actions:"ListAllCustomer",
            DataValue: ''
        })
    }
    
    try {
        const res = await fetch(UrlApiMendawai + '/master/GetDataMaster', config);
        const obj = await res.json();
        const data = obj.data;

        var dataGrid;
        $("#txt_search").dxDropDownBox({
            placeholder: "Cari Customer...",
            // value: [0],
            valueExpr: "CustomerID",
            displayExpr: "CustomerID",
            showClearButton: true,
            // searchEnabled: true,
            dataSource: new DevExpress.data.ArrayStore({
                data: data,
                key: "CustomerID"
            }),
            contentTemplate: function(e){
                var value = e.component.option("value"),
                    $dataGrid = $("<div>").dxDataGrid({
                        dataSource: e.component.getDataSource(),
                        columns: ["CustomerID", "Name", {dataField:"Email", caption: "Channel"}],
                        hoverStateEnabled: true,
                        paging: { enabled: true, pageSize: 10 },
                        filterRow: { visible: true },
                        scrolling: { mode: "virtual" },
                        height: 345,
                        selection: { mode: "single" },
                        selectedRowKeys: value,
                        onSelectionChanged: function(selectedItems){
                            var keys = selectedItems.selectedRowKeys;
                            e.component.option("value", keys);
                        }
                    });
                
                dataGrid = $dataGrid.dxDataGrid("instance");
                
                e.component.on("valueChanged", function(args){
                    var value = args.value;
                    dataGrid.selectRows(value, false);
                });
                
                return $dataGrid;
            }
        });
    } 
    catch (error) {
        console.log(error);	
    } 
}

async function ModalCustomerProfile(){
    const popupContentTemplate = function () {
        const scrollView = $("<div>")
            
        scrollView.append(FormCustomerProfile);

        scrollView.dxScrollView({
            width: '100%',
            height: '100%'
        });

        return scrollView;
    };

    const popup = $("#ModalCustomerProfile").dxPopup({
        contentTemplate: popupContentTemplate,
        container: ".dx-viewport",
        showTitle: true,
        title: "Profile Customer",
        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        showCloseButton: true,
        toolbarItems: [{
            widget: "dxButton",
            toolbar: "bottom",
            location: "before",
            options: {
                icon: "fa fa-users",
                text: "Data Customer",
                type: "default",
                stylingMode: "outlined",
                onClick: function (e) {
                    ModalDataCustomer();
                }
            }
        }, {
            widget: "dxButton",
            toolbar: "bottom",
            location: "after",
            options: {
                text: "Close",
                onClick: function (e) {
                    popup.hide();
                }
            }
        },{
            widget: "dxButton",
            toolbar: "bottom",
            location: "after",
            options: {
                stylingMode: "contained",
                type: "default",
                text: "Submit",
                onClick: function (e) {
                    PostCustomerProfile();
                    popup.hide();
                }
            }
        }]
    }).dxPopup("instance");
    popup.show();

    ViewCustomer(CustomerID.value);
    DataTypeCustomer();
    DataKantorCabang();

    document.getElementById('isNumber').addEventListener('keypress', (event) => {
        if (event.charCode > 31 && (event.charCode < 48 || event.charCode > 57)) {
            event.preventDefault();
            return false;
        }
        else {
            return true;
        }
    });
}

async function ModalDataCustomer(){
    const popupContentTemplate = function () {
        const scrollView = $("<div>")
            
        scrollView.append(TblDataCustomer);

        scrollView.dxScrollView({
            width: '100%',
            height: '100%'
        });

        return scrollView;
    };

    const popup = $("#ModalDataCustomer").dxPopup({
        contentTemplate: popupContentTemplate,
        container: ".dx-viewport",
        showTitle: true,
        title: "Data Customer",
        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        showCloseButton: true,
        toolbarItems: [ {
            widget: "dxButton",
            toolbar: "bottom",
            location: "after",
            options: {
                text: "Close",
                onClick: function (e) {
                    popup.hide();
                }
            }
        }]
    }).dxPopup("instance");
    popup.show();
    DataCustomer('');

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
                <input type="text" name="CustomerIdentity" class="form-control form-control-sm" placeholder="Account Identity" readonly>
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
                <input placeholder="Phone Number" type="number" name="PhoneNumber" class="form-control form-control-sm" id="isNumber">
            </div>
        </div>

        <div class="col-md-4 form-group">
            <label>Customer Type</label>
            <div id="CustomerType" name="CustomerType"></div>
        </div>
        <div class="col-md-8 form-group">
            <label>Kantor Cabang</label>
            <div id="Cabang" name="Cabang"></div>
        </div>
        
        <div class="col-md-12 form-group">
            <label>Address</label>
            <textarea name="Address" class="form-control mb-0" rows="3" placeholder="Address.." style="height: 120px;"></textarea>
        </div>
    </div>   
</form>`;

const TblDataCustomer = `<div class="row mb-10">
    <div class="col-lg-5">
        <div id="txt_search"></div> 
    </div>
    <div class="col-lg-1">
        <div id="btn_search"></div>
    </div>
</div>
<div class="demo-container">
    <div id="TblDataCustomer"></div>
</div>`;

export {
    ModalCustomerProfile,
    DataKantorCabang,
    DataTypeCustomer
}
