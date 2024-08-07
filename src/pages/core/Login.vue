<template>
    <v-app id="login">
        <v-content>
            <v-toolbar :color="$root.themeColor" style="padding: 1rem">
                <img src="static/logo-ipone-white.png" width="60vh"></img>
            </v-toolbar>
            <v-card class="flex" flat tile :color="$root.themeColorFooter">
                <v-card-actions></v-card-actions>
            </v-card>
            <v-layout style="padding: 2rem">
                <v-spacer></v-spacer>
                <v-flex d-flex lg3 sm12 xs12>
                    <v-card class="elevation-1 pa-3" :color="$root.themeColor">
                        <v-card-text>
                            <div class="layout column align-center">
                                <h1 class="flex my-4 white--text">EXTERNAL PORTAL</h1>
                            </div>
                            <v-form>
                                <div class="white--text">Username</div>
                                <v-text-field solo append-icon="person"  placeholder="Username" type="text" v-model="userName" :error="error" :rules="[rules.required]" />
                                <div class="white--text">Password</div>
                                <v-text-field solo placeholder="Password" :type="hidePassword ? 'password' : 'text'" :append-icon="hidePassword ? 'visibility_off' : 'visibility'"  id="password" :rules="[rules.required]" v-model="password" :error="error" @click:append="hidePassword = !hidePassword"
                                />
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn round class=" white--text" block :color="$root.themeColorFooter" @click="login" :loading="loading">
                                <h3>Login</h3>
                            </v-btn>
                        </v-card-actions>
                        <v-flex d-flex lg12 sm12 xs12>
                            <v-spacer></v-spacer>
                            <img src="static/Banner-login.png" width="80%"></img>
                            <v-spacer></v-spacer>
                        </v-flex>
                    </v-card>
                </v-flex>
                <v-spacer></v-spacer>
            </v-layout>
            <v-container fluid grid-list-xl>
                <v-layout row wrap>
                    <v-flex d-flex lg3 sm6 xs12>
                        <widget icon="domain" title="Office" :supTitle="$t('65 Ramkhamhang Sapansung Bangkok 10240')" color="#2196F3" />
                    </v-flex>
                    <v-flex d-flex lg3 sm6 xs12>
                        <widget round icon="mdi-chart-line" title="Line" :supTitle="$t('@it_ipone1')" color="#1ab3a3" />
                    </v-flex>
                    <v-flex d-flex lg3 sm6 xs12>
                        <widget icon="phone" title="Phone" :supTitle="$t('02 - 372 3461')" color="#767676" />
                    </v-flex>
                    <v-flex d-flex lg3 sm6 xs12 @click="sendMail">
                        <widget icon="email" title="Email" :supTitle="$t('it@ip-one.com')" color="#51adf6" />
                    </v-flex>
                </v-layout>
            </v-container>
            <v-footer dark height="auto">
                <v-card class="flex" flat tile :color="$root.themeColorFooter">
                    <v-card-actions class="black--text justify-center">
                        &copy;copyright 2024 by I.P.One Co., Ltd.
                    </v-card-actions>
                </v-card>
            </v-footer>
            <v-snackbar color="orange" v-model="showResult" :timeout="3500">
                {{ result }}
            </v-snackbar>
    
        </v-content>
    </v-app>
</template>

<script>
import axios from 'axios';
import { sync } from "vuex-pathify";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            loading: false,
            userName: '',
            password: '',
            hidePassword: true,
            error: false,
            showResult: false,
            result: '',
            rules: {
                required: value => !!value || 'Required.'
            }
        }
    },
    computed: {
        ...sync("*"),
    },
    mounted: function() {
        this.$refs.videoRef.play();
    },
    methods: {
        login() {
            const vm = this;
            return vm.$router.push({ name: 'ManageData' });
            if (!vm.userName || !vm.password) {

                vm.result = "Username and Password can't be null.";
                vm.showResult = true;

                return;
            }
            this.ValidateLogin(vm.userName, vm.password)
        },
        sendMail() {
            console.log("sendMail")
            window.location.href = "mailto:it@ip-one.com?subject=Subject&body=message%20goes%20here";
        },
        async ValidateLogin(usn, pwd) {
            const vm = this;
            vm.loading = true
           
            try {
                const auth = {
                    userID: usn,
                    password: pwd
                }
                localStorage.removeItem('storedData')
                const response = await axios.post('https://externalportal.ip-one.com/api/Logistics/v1/Login', auth);
                console.log(response)
                if (response.data.authentication) {
                        vm.loading = false
                        vm.$store.commit('resetState');
                        vm.infoLogin.authentication = response.data.authentication
                        vm.infoLogin.username = response.data.results[0].userName
                        localStorage.setItem('storedData', vm.infoLogin.username)
                        vm.$router.push({ name: 'Reports' });
                } else {
                    vm.loading = false
                    vm.error = true;
                      Swal.fire({
                        text: 'Username or Password is incorrect.',
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#0c80c4",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                        }
                    });

                }
            } catch (error) {
                console.error(error);
                vm.error = true;
                vm.loading = false
                     Swal.fire({
                        text: 'User Not Found',
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#0c80c4",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                        }
                    });
            }
        }
    }
}
</script>

<style scoped lang="css">
#login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
}
</style>
