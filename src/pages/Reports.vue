<template>
    <container id="powerbi">

           <iframe 
             src="https://app.powerbi.com/view?r=eyJrIjoiN2JkYmE3ZDYtY2ZhYy00ZGE4LWJlMGUtZWM1MzgwYTk0MjczIiwidCI6IjQwODIyY2I0LTJmOWEtNDM4ZS1iODAzLWZlZjZhNzJkNGQyZCIsImMiOjEwfQ%3D%3D" width="100%" height="650" border='0'  scrolling='no' marginheight='0' 
             marginwidth='0' frameborder='0' style='float:left; margin-left:0px' allowfullscreen='true'
            webkitallowfullscreen='true' mozallowfullscreen='true'>
                                              </iframe>
    
        <v-spacer></v-spacer>
  </container>
</template>

<script>
import axios from 'axios';
import { sync } from "vuex-pathify";
import functions from '../plugins/functions.js';
import Swal from "sweetalert2";
import keyFilter from '@/plugins/keyFilter'
import { isEmpty } from 'lodash'
import Loading from '../components/core/Loading';

export default {
    components: {
        Loading
    },
    data() {
        const gradients = [
            ['#222'],
            ['#42b3f4'],
            ['red', 'orange', 'yellow'],
            ['purple', 'violet'],
            ['#00c6ff', '#F0F', '#FF0'],
            ['#f72047', '#ffd200', '#1feaea'],
        ]
        return {
            loadingDialog: false,
            loading: false,
            editId: 0,
            showResult: false,
            msgResult: '',
            keyFilter,
            dialog: false,
            functions,
            headers: [],
            // subHeaders: [],
            iframeSrc: '',
            width: 2,
            radius: 10,
            padding: 6,
            lineCap: 'round',
            gradient: gradients[5],
            value: [0, 2, 5, 8, 5, 7, 3, 5, 0, 0, 1, 7, 2, 8, 0],
            gradientDirection: 'top',
            gradients,
            fill: true,
            type: 'trend',
            autoLineWidth: false,
            groupName: '',
            reportName: '',
            reportDesc: '',
            reportUrl: '',
            itemDivision: [],
            division: '',
            status: {
                key: 1,
                text: 'Y',
                displayText: 'Active',
            },
            itemStatus: [{
                    key: 1,
                    text: 'Y',
                    displayText: 'Active',
                },
                {
                    key: 2,
                    text: 'N',
                    displayText: 'InActive',
                }
            ]
        }
    },
    computed: {
        ...sync("*"),
    },
    watch: {
        'infoLogin.samAccount': async function(val) {
            console.log(val, 'infoLogin');
            // this.subHeaders = []
            // this.getMHeaderPowerBi()
        //    setTimeout( await this.getDItemPowerBi(), 6000);
        }
    },
    async created() {
        this.$store.commit('resetState');
    },
    methods: {
        redirect(val) {
            console.log(val, 'val');
            this.iframeSrc = val.reportURL
        },
        async getMHeaderPowerBi() {
            try {
                this.itemDivision = []
                const response = await axios.get('https://portal.ip-one.com/AdsControl/IP1Potal/v1/getMHeaderPowerBi');
                console.log(response, 'getMHeaderPowerBi')
                if (response.data.results.resultTotals != 0) {
                    response.data.results.forEach(element =>
                        this.itemDivision.push({
                            text: element.division_desc,
                            key: element.division_id.trim(),
                            prefix: element.prefix
                        })
                    );
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getDItemPowerBi() {
            try {
                this.headers = []
                this.subHeaders = []
                const response = await axios.get('https://portal.ip-one.com/AdsControl/IP1Potal/v1/getDItemPowerBi');
                console.log("getDItemPowerBi", response)
                console.log("infoLogin.group", this.infoLogin.group)
                if (response.data.results.resultTotals != 0) {
                    response.data.results.forEach(element => {
                        if(['Report_Admin', 'Report_Viewer'].some(i => this.infoLogin.group.includes(i))){
                            this.subHeaders.push({
                                id: element.id,
                                adGroupName: element.adGroupName,
                                reportName: element.reportName,
                                reportDesc: element.reportDesc,
                                reportURL: element.reportURL,
                                groupDivision: element.groupDivision.trim(),
                                division_desc: element.division_desc,
                                create_by: element.create_by,
                                create_date: element.create_date,
                                update_by: element.update_by,
                                update_date: element.update_date,
                            })
                        } else if (this.infoLogin.group.includes(element.adGroupName)) {
                            this.subHeaders.push({
                                id: element.id,
                                adGroupName: element.adGroupName,
                                reportName: element.reportName,
                                reportDesc: element.reportDesc,
                                reportURL: element.reportURL,
                                groupDivision: element.groupDivision.trim(),
                                division_desc: element.division_desc,
                                create_by: element.create_by,
                                create_date: element.create_date,
                                update_by: element.update_by,
                                update_date: element.update_date,
                            })
                        }
                    });
                    console.log("this.subHeaders", this.subHeaders)
                    this.headers = this.functions.distinctArray(this.subHeaders)
                    if (this.subHeaders.length == 0) {
                       await this.getDItemPowerBi()
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        async submit() {
            this.loading = true
            if (isEmpty(this.groupName)) {
                console.log('empty')
                this.msgResult = "Group name can't be null.";
                this.showResult = true;
                this.loading = false
                return
            } else if (isEmpty(this.reportName)) {
                this.msgResult = "Report name can't be null.";
                this.showResult = true;
                this.loading = false
                return
            } else if (isEmpty(this.reportUrl)) {
                this.msgResult = "Report URL can't be null.";
                this.showResult = true;
                this.loading = false
                return
            } else if (isEmpty(this.division)) {
                this.msgResult = "Division can't be null.";
                this.showResult = true;
                this.loading = false
                return
            }
            const createGroup = {
                groupName: `${this.division.prefix}-${this.groupName.toUpperCase()}`,
                groupDesc: this.reportDesc == '' ? " " : this.reportDesc
            }
            console.log(createGroup, 'createGroup')
            const createPowerBiItem = {
                id: this.editId,
                groupName: `${this.division.prefix}-${this.groupName.toUpperCase()}`,
                reportName: this.reportName,
                reportDesc: this.reportDesc == '' ? " " : this.reportDesc,
                reportUrl: this.reportUrl,
                groupDivision: this.division.key,
                create_by: this.infoLogin.empId,
                update_by: this.infoLogin.empId,
                status: this.status.text
            }
            const addMemberGroup = {
                groupName: this.disabledFormReport ? this.groupName.toUpperCase() : `${this.division.prefix}-${this.groupName.toUpperCase()}`,
                detail: [{
                    userName: this.infoLogin.samAccount,
                }]
            }
            this.disabledFormReport ? addMemberGroup.detail = [] : addMemberGroup.detail
            if (this.userMember.length != 0) {
                let unique_values = [
                    ...new Set(this.userMember.map((element) => element.empID)),
                ];
                this.userMember = unique_values.map(empID => this.userMember.find(x => x.empID === empID));
                this.userMember.forEach(element => {
                    addMemberGroup.detail.push({
                        userName: element.Username.toLowerCase()
                    })
                });
            }
            console.log(createPowerBiItem, 'createPowerBiItem')
            console.log(addMemberGroup, 'addMemberGroup')
            try {
                if (!this.disabledFormReport) {
                    //create
                    const responseAd = await axios.post('https://portal.ip-one.com/AdsControl/Ads/v1/ADsCreateGroup', createGroup);
                    console.log(responseAd, 'responseAd')
                    if (responseAd.data.statusCode == '201') {
                        const responseItem = await axios.post('https://portal.ip-one.com/AdsControl/IP1Potal/v1/postPowerBiItem', createPowerBiItem);
                        console.log(responseItem, 'responseItem')
                        if (responseItem.data.statusCode.statusCode == '201') {
                            const responseMember = await axios.post('https://portal.ip-one.com/AdsControl/Ads/v1/ADsAddRemoveMemberInGroup', addMemberGroup);
                            console.log(responseMember, 'responseMember')
                            if (responseMember.data.statusCode == '201') {
                               this.loadingDialog = true
                           setTimeout(() => {
                            this.loadingDialog = false    
                          Swal.fire({
                                text: 'successfuly',
                                icon: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#0c80c4",
                                confirmButtonText: "OK",
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    // get login and get header detail
                                    if (!localStorage.getItem('storedData')) return false
                                    await this.getUser(localStorage.getItem('storedData'))
                                    this.defaultModel()
                                    setTimeout( await this.getDItemPowerBi(), 3000);
                                }
                            }) 
                        }, 5000);
                            } else {
                                Swal.fire({
                                    text: 'Create item power bi fail. Please contact admin',
                                    icon: "error",
                                    showCancelButton: false,
                                    confirmButtonColor: "#0c80c4",
                                    confirmButtonText: "OK",
                                }).then(async (result) => {
                                    if (result.isConfirmed) {}
                                });
                            }
                        } else {
                            Swal.fire({
                                text: 'Create item power bi fail. Please contact admin',
                                icon: "error",
                                showCancelButton: false,
                                confirmButtonColor: "#0c80c4",
                                confirmButtonText: "OK",
                            }).then(async (result) => {
                                if (result.isConfirmed) {}
                            });
                        }
                    } else if (responseAd.data.statusCode == '409') {
                        Swal.fire({
                            text: 'Group duplicate',
                            icon: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#0c80c4",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {}
                        });
                    } else {
                        Swal.fire({
                            text: 'Create group fail. Please contact admin',
                            icon: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#0c80c4",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {}
                        });
                    }
                } else {
                    //edit
                    const responseItem = await axios.post('https://portal.ip-one.com/AdsControl/IP1Potal/v1/postPowerBiItem', createPowerBiItem);
                    console.log(responseItem, ' edit responseItem')
                    if (responseItem.data.statusCode.statusCode == '201') {
                        const responseMember = await axios.post('https://portal.ip-one.com/AdsControl/Ads/v1/ADsAddRemoveMemberInGroup', addMemberGroup);
                        console.log(responseMember, 'edit responseMember')
                        if (responseMember.data.statusCode == '201') {
                             this.loadingDialog = true
                 setTimeout(() => {
                            this.loadingDialog = false  
                         Swal.fire({
                                text: 'successfuly',
                                icon: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#0c80c4",
                                confirmButtonText: "OK",
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    // get login and get header detail
                                    if (!localStorage.getItem('storedData')) return false
                                    await this.getUser(localStorage.getItem('storedData'))
                                    this.defaultModel()
                                    setTimeout( await this.getDItemPowerBi(), 3000);
                                }
                            });
                    }, 5000);
                        } else {
                            Swal.fire({
                                text: 'Create item power bi fail. Please contact admin',
                                icon: "error",
                                showCancelButton: false,
                                confirmButtonColor: "#0c80c4",
                                confirmButtonText: "OK",
                            }).then(async (result) => {
                                if (result.isConfirmed) {}
                            });
                        }
                    } else {
                        Swal.fire({
                            text: 'Create item power bi fail. Please contact admin',
                            icon: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#0c80c4",
                            confirmButtonText: "OK",
                        }).then(async (result) => {
                            if (result.isConfirmed) {}
                        });
                    }
                }
                this.loading = false
                this.dialog = false
            } catch (error) {
                console.error(error);
            }
        },
        async getUser(username) {
            console.log('localStorage.getItem', localStorage.getItem('storedData'))
            console.log('username', username)
            try {
                const getUserAd = {
                    username: username
                }
                const response = await axios.post('https://portal.ip-one.com/adsControl/Ads/v1/ADsGetUser', getUserAd);
                console.log(response, 'getUser Power BI')
                if (!response.data.locked) {
                    this.infoLogin.name = response.data.name
                    this.infoLogin.firstName = response.data.firstName
                    this.infoLogin.lastName = response.data.lastName
                    this.infoLogin.email = response.data.email
                    this.infoLogin.empId = response.data.empId
                    this.infoLogin.locked = response.data.locked
                    this.infoLogin.group = response.data.group
                    this.infoLogin.samAccount = response.data.samAccount
                }
            } catch (error) {
                console.error(error);
            }
        },
        AddItem() {
            this.dialog = true
            this.disabledFormReport = false
            this.division = ''
            this.defaultModel()
        },
        defaultModel() {
            this.loading = false
            this.groupName = ''
            this.reportName = ''
            this.reportDesc = ''
            this.reportUrl = ''
            this.disabledFormReport = false
            this.status = {
                key: 1,
                text: 'Y',
                displayText: 'Active',
            }
            this.editId = 0
            this.userMember = []
        },
        async editReport(val) {
            console.log('editReport', val)
            this.defaultModel()
            const responseMember = await axios.get(`https://portal.ip-one.com/adsControl/Ads/v1/getMemberIngroup?paramGroup=${val.adGroupName}`);
            console.log(responseMember, 'responseMember')

            if (responseMember.data.statusCode.statusCode == '200') {
                responseMember.data.results.forEach(element => {
                    this.userMember.push({
                        empID: element.empId,
                        Name: element.name,
                        Username: element.samAccount
                    });
                });
            } else {
                this.showResult = true
                this.msgResult = `empty response member`
            }
            this.dialog = true
            this.disabledFormReport = true
            this.groupName = val.adGroupName
            this.reportName = val.reportName
            this.reportDesc = val.reportDesc
            this.reportUrl = val.reportURL
            const splitAdGroupName = val.adGroupName.split("-");
            this.division = {
                prefix: splitAdGroupName[0],
                text: val.division_desc,
                key: val.groupDivision.trim()
            }
            this.editId = val.id
        },
        deleteReport(val) {
            const dataDel = {
                id: val.id.toString(),
                groupName: val.adGroupName
            }
            Swal.fire({
                text: `Are you sure you want to delete report ${val.reportName} ?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#0c80c4",
                cancelButtonColor: "#C0C0C0",
                confirmButtonText: "OK",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const responseItem = await axios.post(`https://portal.ip-one.com/AdsControl/IP1Potal/v1/postDeleteItemPowerBI`, dataDel);
                    console.log(responseItem, 'responseItem')
                    if (responseItem.data.statusCode.statusCode == '200') {
                        this.defaultModel()
                        setTimeout( await this.getDItemPowerBi(), 3000);
                    }
                }
            });

        }
    }
}
</script>

<style scoped>
.v-card--reveal {
align-items: center;
bottom: 0;
justify-content: center;
opacity: .5;
position: absolute;
width: 100%;
}
</style>
