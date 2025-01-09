<template>
  <div class="px-4 py-3">
    <v-layout class="mb-3" justify-space-between wrap>
      <div>
        <h2 class="header">แบบคำขอทรัพย์สินสำหรับพนักงานใหม่</h2>
      </div>
      <div>
        <v-chip text-color="black" color="#f8c849">
          วันส่งเรื่อง : {{ currentDate }}
        </v-chip>
        <v-chip text-color="black" color="#f8c849">
          ผู้ส่งเรื่อง : {{ createUser }}
        </v-chip>
      </div>
    </v-layout>

    <EmployeeInfo></EmployeeInfo>

    <div class="gonext my-3">
      <div class="custom-chip" text-color="black" color="#f8c849">
        รายการทรัพย์สินที่ต้องการ : {{ textRequireItem }}
      </div>
      <div>
        <v-btn @click="prevPage" color="#ffc10a" fab small :disabled="e1 === 1">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn @click="nextPage" color="#0580c6" fab small :disabled="e1 === pageCount">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </div>

    <v-stepper v-model="e1" class="mb-2">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">ฝ่ายไอที</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 2" step="2">ฝ่ายธุรการ</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">ฝ่ายสรรหาบุคลากร</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-layout row wrap class="mb-3">
            <v-flex lg2 xl2 class="custom-space">
              <v-select
                :items="filteredITItemLists"
                item-text="list_Description"
                v-model="itAsset"
                solo
                flat
                background-color="#f4f4f4"
                class="inner-card-file"
                hide-details
                :disabled="!this.infoLogin.ADgroup.includes('Admin_Career')"
                :readonly="this.detailState == 'EDIT'"
                label="รายการทรัพย์สิน"
              ></v-select>
            </v-flex>
            <v-flex
              lg2
              xl2
              offset-xl3
              offset-lg3
              v-if="this.itTypeAsset == 'SYSTEMS'"
              class="custom-space"
            >
              <v-text-field
                solo
                label="ชื่อผู้ใช้"
                v-model="myuser"
                hide-details
                class="inner-card-file"
                flat
                background-color="#f4f4f4"
                maxlength="30"
              ></v-text-field>
            </v-flex>
            <v-flex lg2 xl2 v-if="this.itTypeAsset == 'SYSTEMS'" class="custom-space">
              <v-text-field
                solo
                label="รหัสผ่าน"
                v-model="mypass"
                hide-details
                class="inner-card-file"
                flat
                background-color="#f4f4f4"
                maxlength="20"
              ></v-text-field>
            </v-flex>
            <v-flex lg3 xl3 v-if="this.itTypeAsset == 'SYSTEMS'" class="custom-space">
              <v-layout>
                <v-text-field
                  solo
                  label="หมายเหตุ"
                  v-model="myremark"
                  hide-details
                  maxlength="40"
                  class="inner-card-file"
                  flat
                  background-color="#f4f4f4"
                >
                </v-text-field>
                <v-icon
                  @click="addSystemItemAsset"
                  v-if="this.detailState == 'ADD'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-plus-circle
                </v-icon>
                <v-icon
                  @click="confirmEditSystemItemAsset"
                  v-if="this.detailState == 'EDIT'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-pencil-box
                </v-icon>
              </v-layout>
            </v-flex>

            <v-flex
              lg2
              xl2
              offset-xl3
              offset-lg3
              class="custom-space"
              v-if="this.itTypeAsset == 'DEVICE' || this.itTypeAsset == 'COMPUTER'"
            >
              <v-text-field
                solo
                label="รุ่น"
                v-model="myuser"
                hide-details
                background-color="#f4f4f4"
                class="inner-card-file"
                flat
                maxlength="20"
              ></v-text-field>
            </v-flex>
            <v-flex
              lg2
              xl2
              v-if="this.itTypeAsset == 'DEVICE' || this.itTypeAsset == 'COMPUTER'"
              class="custom-space"
            >
              <v-text-field
                solo
                label="Serial No"
                v-model="mypass"
                hide-details
                background-color="#f4f4f4"
                class="inner-card-file"
                flat
                maxlength="20"
              ></v-text-field>
            </v-flex>
            <v-flex
              lg3
              xl3
              v-if="this.itTypeAsset == 'DEVICE' || this.itTypeAsset == 'COMPUTER'"
              class="custom-space"
            >
              <v-layout>
                <v-text-field
                  solo
                  label="หมายเหตุ"
                  v-model="myremark"
                  hide-details
                  maxlength="40"
                  background-color="#f4f4f4"
                  class="inner-card-file"
                  flat
                ></v-text-field>
                <v-icon
                  @click="addDeviceItemAsset"
                  v-if="this.detailState == 'ADD'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-plus-circle
                </v-icon>
                <v-icon
                  @click="confirmEditDeviceItemAsset"
                  v-if="this.detailState == 'EDIT'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-pencil-box
                </v-icon>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-data-table :headers="headerSystemAsset" :items="systemAssetDetail">
            <template v-slot:items="props">
              <tr>
                <td class="text-left">{{ props.item.item_LineNo }}</td>
                <td class="text-left">{{ props.item.list_Description }}</td>
                <td class="text-left">{{ props.item.item_Detail1 }}</td>
                <td class="text-left">{{ props.item.item_Detail2 }}</td>
                <td class="text-left">{{ props.item.item_Remark }}</td>
                <td class="text-left">{{ props.item.item_Type }}</td>
                <td v-if="showAdd == 'ADMIN'">
                  <v-icon
                    class="custom-icon-edit"
                    size="18"
                    color="white"
                    @click="editSystemItemAsset(props)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon
                    class="custom-icon-delete"
                    size="18"
                    color="white"
                    v-if="detailState != 'EDIT'"
                    @click="
                      deleteITItemAsset(
                        props.index,
                        props.item.item_Type,
                        props.item.item_LineNo
                      )
                    "
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-data-table :headers="headerDeviceAsset" :items="deviceAssetDetail">
            <template v-slot:items="props">
              <tr>
                <td class="text-left">{{ props.item.item_LineNo }}</td>
                <td class="text-left">{{ props.item.list_Description }}</td>
                <td class="text-left">{{ props.item.item_Detail1 }}</td>
                <td class="text-left">{{ props.item.item_Detail2 }}</td>
                <td class="text-left">{{ props.item.item_Remark }}</td>
                <td class="text-left">{{ props.item.item_Type }}</td>
                <td v-if="showAdd == 'ADMIN'">
                  <v-icon
                    class="custom-icon-edit"
                    size="18"
                    color="white"
                    @click="editDeviceItemAsset(props)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon
                    class="custom-icon-delete"
                    size="18"
                    color="white"
                    v-if="detailState != 'EDIT'"
                    @click="
                      deleteITItemAsset(
                        props.index,
                        props.item.item_Type,
                        props.item.item_LineNo
                      )
                    "
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </template>
          </v-data-table>

          <v-layout>
            <v-btn
              @click="setReturnDate"
              v-if="this.assetFormStatus == 'ONBOARDING'"
              :disabled="!this.infoLogin.ADgroup.includes('Admin_Career')"
              color="#007fc4"
              dark
              >ยืนยันรับทรัพย์สินคืน</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              color="#f8c849"
              @click="addAssetEmployee"
              :disabled="!this.infoLogin.ADgroup.includes('Admin_Career')"
              >บันทึก</v-btn
            >
            <v-btn
              :disabled="!this.infoLogin.ADgroup.includes('Admin_Career')"
              v-show="checkADsUser == 'N'"
              color="success"
              @click="createADs"
              >สร้าง AD</v-btn
            >
          </v-layout>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-layout row wrap class="mb-3">
            <v-flex lg2 xl2 class="custom-space">
              <v-select
                :items="filteredAdminItemLists"
                item-text="list_Description"
                v-model="adminAsset"
                solo
                background-color="#f4f4f4"
                class="inner-card-file"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('User_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                :readonly="this.detailState == 'EDIT'"
                hide-details
                label="รายการทรัพย์สิน"
              ></v-select>
            </v-flex>
            <v-flex
              lg2
              xl2
              offset-xl3
              offset-lg3
              v-if="this.adminAsset == 'Layout'"
              class="custom-space"
            >
              <v-text-field
                solo
                label="สถานที่"
                v-model="myplace"
                hide-details
                background-color="#f4f4f4"
                class="inner-card-file"
                flat
                maxlength="20"
              ></v-text-field>
            </v-flex>
            <v-flex lg2 xl2 v-if="this.adminAsset == 'Layout'" class="custom-space">
              <v-text-field
                solo
                label="ชั้น"
                v-model="mynumber"
                hide-details
                background-color="#f4f4f4"
                class="inner-card-file"
                flat
                maxlength="2"
              ></v-text-field>
            </v-flex>
            <v-flex lg3 xl3 v-if="this.adminAsset == 'Layout'" class="custom-space">
              <v-layout>
                <v-text-field
                  solo
                  label="หมายเหตุ"
                  v-model="myremark"
                  hide-details
                  maxlength="40"
                  background-color="#f4f4f4"
                  class="inner-card-file"
                  flat
                >
                </v-text-field>
                <v-icon
                  @click="addAdminItemAsset"
                  v-if="this.detailState == 'ADD'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-plus-circle
                </v-icon>
                <v-icon
                  @click="confirmEditAdminItemAsset"
                  v-if="this.detailState == 'EDIT'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-pencil-box
                </v-icon>
              </v-layout>
            </v-flex>

            <v-flex
              lg2
              xl2
              offset-xl3
              offset-lg3
              v-if="this.adminAsset == 'Fleet Card'"
              class="custom-space"
            >
              <v-text-field
                solo
                label="ทะเบียน"
                v-model="myplace"
                hide-details
                background-color="#f4f4f4"
                maxlength="8"
                class="inner-card-file"
                flat
              ></v-text-field>
            </v-flex>
            <v-flex lg2 xl2 v-if="this.adminAsset == 'Fleet Card'" class="custom-space">
              <v-text-field
                solo
                label="จำนวนลิตร"
                v-model="mynumber"
                hide-details
                maxlength="4"
                background-color="#f4f4f4"
                class="inner-card-file"
                flat
              ></v-text-field>
            </v-flex>
            <v-flex lg3 xl3 v-if="this.adminAsset == 'Fleet Card'" class="custom-space">
              <v-layout>
                <v-text-field
                  solo
                  label="หมายเหตุ"
                  v-model="myremark"
                  hide-details
                  maxlength="40"
                  background-color="#f4f4f4"
                  class="inner-card-file"
                  flat
                >
                </v-text-field>
                <v-icon
                  @click="addAdminItemAsset"
                  v-if="this.detailState == 'ADD'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-plus-circle
                </v-icon>
                <v-icon
                  @click="confirmEditAdminItemAsset"
                  v-if="this.detailState == 'EDIT'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-pencil-box
                </v-icon>
              </v-layout>
            </v-flex>

            <v-flex
              lg2
              xl2
              offset-xl3
              offset-lg3
              v-if="this.adminAsset == 'Uniform'"
              class="custom-space"
            >
              <v-text-field
                solo
                label="ขนาด"
                v-model="myplace"
                hide-details
                background-color="#f4f4f4"
                maxlength="5"
                class="inner-card-file"
                flat
              ></v-text-field>
            </v-flex>
            <v-flex lg2 xl2 v-if="this.adminAsset == 'Uniform'" class="custom-space">
              <v-text-field
                solo
                label="จำนวน"
                v-model="mynumber"
                hide-details
                background-color="#f4f4f4"
                maxlength="3"
                class="inner-card-file"
                flat
              ></v-text-field>
            </v-flex>
            <v-flex lg3 xl3 v-if="this.adminAsset == 'Uniform'" class="custom-space">
              <v-layout>
                <v-text-field
                  solo
                  label="หมายเหตุ"
                  v-model="myremark"
                  hide-details
                  maxlength="40"
                  background-color="#f4f4f4"
                  class="inner-card-file"
                  flat
                >
                </v-text-field>
                <v-icon
                  @click="addAdminItemAsset"
                  v-if="this.detailState == 'ADD'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-plus-circle
                </v-icon>
                <v-icon
                  @click="confirmEditAdminItemAsset"
                  v-if="this.detailState == 'EDIT'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-pencil-box
                </v-icon>
              </v-layout>
            </v-flex>

            <v-flex
              lg2
              xl2
              offset-xl3
              offset-lg3
              v-if="this.adminAsset == 'Key'"
              class="custom-space"
            >
              <v-text-field
                solo
                label="สถานที่"
                v-model="myplace"
                hide-details
                background-color="#f4f4f4"
                maxlength="20"
                class="inner-card-file"
                flat
              ></v-text-field>
            </v-flex>
            <v-flex lg2 xl2 v-if="this.adminAsset == 'Key'" class="custom-space">
              <v-text-field
                solo
                label="จำนวน"
                v-model="mynumber"
                hide-details
                background-color="#f4f4f4"
                maxlength="2"
                class="inner-card-file"
                flat
              ></v-text-field>
            </v-flex>
            <v-flex lg3 xl3 v-if="this.adminAsset == 'Key'" class="custom-space">
              <v-layout>
                <v-text-field
                  solo
                  label="หมายเหตุ"
                  v-model="myremark"
                  hide-details
                  maxlength="40"
                  background-color="#f4f4f4"
                  class="inner-card-file"
                  flat
                >
                </v-text-field>
                <v-icon
                  @click="addAdminItemAsset"
                  v-if="this.detailState == 'ADD'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-plus-circle
                </v-icon>
                <v-icon
                  @click="confirmEditAdminItemAsset"
                  v-if="this.detailState == 'EDIT'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-pencil-box
                </v-icon>
              </v-layout>
            </v-flex>

            <v-flex
              lg2
              xl2
              offset-xl5
              offset-lg5
              hide-details
              class="custom-space"
              v-if="
                this.adminAsset !== 'Layout' &&
                this.adminAsset !== 'Key' &&
                this.adminAsset !== 'Fleet Card' &&
                this.adminAsset !== 'Uniform' &&
                this.adminAsset !== ''
              "
            >
              <v-text-field
                solo
                label="หมายเลข"
                v-model="mynumber"
                hide-details
                maxlength="10"
                background-color="#f4f4f4"
                class="inner-card-file"
                flat
              ></v-text-field>
            </v-flex>
            <v-flex
              lg3
              xl3
              class="custom-space"
              v-if="
                this.adminAsset !== 'Layout' &&
                this.adminAsset !== 'Key' &&
                this.adminAsset !== 'Fleet Card' &&
                this.adminAsset !== 'Uniform' &&
                this.adminAsset !== ''
              "
            >
              <v-layout>
                <v-text-field
                  solo
                  label="หมายเหตุ"
                  v-model="myremark"
                  hide-details
                  maxlength="40"
                  background-color="#f4f4f4"
                  class="inner-card-file"
                  flat
                >
                </v-text-field>
                <v-icon
                  @click="addAdminItemAsset"
                  v-if="this.detailState == 'ADD'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-plus-circle
                </v-icon>
                <v-icon
                  @click="confirmEditAdminItemAsset"
                  v-if="this.detailState == 'EDIT'"
                  :size="30"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-pencil-box
                </v-icon>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-data-table :headers="headerAdminAsset" :items="adminAssetDetail">
            <template v-slot:items="props">
              <tr>
                <td class="text-left">{{ props.item.item_LineNo }}</td>
                <td class="text-left">{{ props.item.list_Description }}</td>
                <td class="text-left">{{ props.item.item_Detail1 }}</td>
                <td class="text-left">{{ props.item.item_Detail2 }}</td>
                <td class="text-left">{{ props.item.item_Remark }}</td>
                <td class="text-left">{{ props.item.item_Type }}</td>
                <td v-if="showAdd == 'USER' || showAdd == 'ADMIN'">
                  <v-icon
                    class="custom-icon-edit"
                    size="18"
                    color="white"
                    @click="editAdminItemAsset(props)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon
                    class="custom-icon-delete"
                    size="18"
                    color="white"
                    v-if="detailState != 'EDIT'"
                    @click="deleteAdminItemAsset(props.index, props.item.item_LineNo)"
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </template>
          </v-data-table>

          <v-layout>
            <v-btn
              @click="setReturnDate"
              v-if="this.assetFormStatus == 'ONBOARDING'"
              :disabled="
                !this.infoLogin.ADgroup.includes('User_Career') &&
                !this.infoLogin.ADgroup.includes('Admin_Career')
              "
              color="#007fc4"
              dark
              >ยืนยันรับทรัพย์สินคืน</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              color="#f8c849"
              @click="addAssetEmployee"
              :disabled="
                !this.infoLogin.ADgroup.includes('User_Career') &&
                !this.infoLogin.ADgroup.includes('Admin_Career')
              "
              >บันทึก</v-btn
            >
          </v-layout>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-layout row align-center>
            <v-flex lg1 xl1>
              <v-btn
                fab
                depressed
                small
                color="#f8c849"
                @click="requireItemDialog = true"
              >
                <v-icon color="white">mdi-clipboard-search</v-icon>
              </v-btn>
            </v-flex>
            <v-flex lg2 xl2>
              <v-checkbox
                label="อีเมลบริษัท"
                :true-value="'Y'"
                v-model="requireEmail"
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                hide-details
                :false-value="'N'"
                style="margin-top: 0px"
              ></v-checkbox>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="mb-3">
            <v-flex lg3 xl2 class="custom-space">
              <v-select
                :items="filteredHRItemLists"
                item-text="list_Description"
                v-model="hrAsset"
                hide-details
                solo
                background-color="#f4f4f4"
                class="inner-card-file"
                flat
                label="รายการทรัพย์สิน"
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
              ></v-select>
            </v-flex>
            <v-flex
              lg2
              xl2
              offset-xl5
              offset-lg4
              v-if="this.hrAsset != ''"
              class="custom-space"
            >
              <v-text-field
                solo
                label="หมายเลข"
                v-model="insurance"
                hide-details
                background-color="#f4f4f4"
                class="inner-card-file"
                flat
              >
              </v-text-field>
            </v-flex>
            <v-flex lg3 xl3 v-if="this.hrAsset != ''" class="custom-space">
              <v-layout>
                <v-text-field
                  solo
                  label="หมายเหตุ"
                  v-model="myremark"
                  hide-details
                  background-color="#f4f4f4"
                  class="inner-card-file"
                  flat
                >
                </v-text-field>
                <v-icon
                  @click="addHRItemAsset"
                  v-if="this.detailState == 'ADD'"
                  :size="35"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-plus-circle
                </v-icon>
                <v-icon
                  @click="confirmEditHRItemAsset"
                  v-if="this.detailState == 'EDIT'"
                  :size="35"
                  color="#fabe20"
                  class="ml-1"
                >
                  mdi-pencil-box
                </v-icon>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-data-table :headers="headerHRAsset" :items="hrAssetDetail">
            <template v-slot:items="props">
              <tr>
                <td class="text-left">{{ props.item.item_LineNo }}</td>
                <td class="text-left">{{ props.item.list_Description }}</td>
                <td class="text-left">{{ props.item.item_Detail1 }}</td>
                <td class="text-left">{{ props.item.item_Remark }}</td>
                <td class="text-left">{{ props.item.item_Type }}</td>
                <td v-if="showAdd == 'HR' || showAdd == 'ADMIN'">
                  <v-icon
                    class="custom-icon-edit"
                    size="18"
                    color="white"
                    @click="editHRItemAsset(props)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon
                    class="custom-icon-delete"
                    size="18"
                    color="white"
                    v-if="detailState != 'EDIT'"
                    @click="deleteHRItemAsset(props.index, props.item.item_LineNo)"
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </template>
          </v-data-table>
          <hr />
          <v-chip
            text-color="black"
            color="#f8c849"
            v-if="this.infoLogin.ADgroup.includes('HR_Career')"
          >
            ข้อมูลการจ้างงาน
          </v-chip>

          <v-layout
            row
            wrap
            v-if="this.infoLogin.ADgroup.includes('HR_Career')"
            align-end
          >
            <v-flex xs6 lg3 xl3 class="custom-space">
              <v-layout>
                <div class="mr-2">
                  <div style="padding-left: 32px">รหัสพนักงาน</div>
                  <v-layout>
                    <v-icon>mdi-office-building-plus</v-icon>
                    <v-text-field
                      hide-details
                      v-model="empIDPeoplePlus"
                      readonly
                      solo
                      background-color="#f5fafd"
                      flat
                      class="inner-card-blue ml-2"
                    ></v-text-field>
                  </v-layout>
                </div>
                <div class="ml-3">
                  <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    :disabled="
                      !this.infoLogin.ADgroup.includes('HR_Career') &&
                      !this.infoLogin.ADgroup.includes('Admin_Career')
                    "
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <div>วันที่เริ่มงาน</div>
                      <v-text-field
                        v-model="customOnboardDate"
                        readonly
                        hide-details
                        v-on="on"
                        solo
                        background-color="#f5fafd"
                        flat
                        class="inner-card-blue"
                        >></v-text-field
                      >
                    </template>
                    <v-date-picker
                      v-model="onboardDate"
                      no-title
                      scrollable
                      @input="formatSelectedDate"
                    >
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="menu2 = false">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </div>
              </v-layout>
            </v-flex>

            <v-flex xs12 lg3 xl3 class="custom-space">
              <!-- {{ assetFormPosition }} -->
              <div>ตำแหน่ง</div>
              <v-autocomplete
                label="ตำแหน่ง"
                prefix="*"
                class="inner-card-blue prefix"
                :items="AllPosition"
                solo
                background-color="#f5fafd"
                flat
                item-text="position_TH"
                item-value="position_Code"
                hide-details
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                v-model="assetFormPosition"
                return-object
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 lg6 xl5 class="custom-space">
              <v-layout>
                <v-checkbox
                  v-model="replacePosition"
                  label="ตำแหน่งทดแทน"
                  :true-value="'Y'"
                  :disabled="
                    !this.infoLogin.ADgroup.includes('HR_Career') &&
                    !this.infoLogin.ADgroup.includes('Admin_Career')
                  "
                  hide-details
                  :false-value="'N'"
                ></v-checkbox>
                <v-autocomplete
                  v-if="replacePosition == 'Y'"
                  hide-details
                  solo
                  flat
                  background-color="#f5fafd"
                  prefix="ตำแหน่งทดแทน :"
                  class="inner-card-blue font-weight-bold"
                  :items="UserList"
                  item-text="displayName"
                  :disabled="
                    !this.infoLogin.ADgroup.includes('HR_Career') &&
                    !this.infoLogin.ADgroup.includes('Admin_Career')
                  "
                  item-value="displayName"
                  v-model="replaceEmployee"
                ></v-autocomplete>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout row wrap v-if="this.infoLogin.ADgroup.includes('HR_Career')">
            <v-flex lg6 xl3 class="custom-space">
              <div style="padding-left: 32px">หน่วยงาน</div>
              <v-layout>
                <v-icon>mdi-office-building-plus</v-icon>
                <v-autocomplete
                  prefix="*"
                  class="inner-card-blue prefix ml-2"
                  solo
                  background-color="#f5fafd"
                  flat
                  hide-details
                  :items="AllCompanyCodeList"
                  item-text="department_Name"
                  item-value="department_Name"
                  :disabled="
                    !this.infoLogin.ADgroup.includes('HR_Career') &&
                    !this.infoLogin.ADgroup.includes('Admin_Career')
                  "
                  v-model="selectDepartment"
                ></v-autocomplete>
              </v-layout>
            </v-flex>
            <v-flex lg6 xl3 class="custom-space">
              <div>กลุ่มงาน</div>
              <v-text-field
                prefix="*"
                class="inner-card-blue prefix"
                hide-details
                v-model="workUnit"
                solo
                background-color="#f5fafd"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
              ></v-text-field>
            </v-flex>
            <v-flex lg6 xl3 class="custom-space">
              <div class="fake-icon">
                <div>ฝ่าย</div>
                <v-text-field
                  prefix="*"
                  class="prefix inner-card-blue"
                  v-model="subTeam"
                  solo
                  background-color="#f5fafd"
                  flat
                  :disabled="
                    !this.infoLogin.ADgroup.includes('HR_Career') &&
                    !this.infoLogin.ADgroup.includes('Admin_Career')
                  "
                  hide-details
                ></v-text-field>
              </div>
            </v-flex>
            <v-flex lg6 xl3 class="custom-space">
              <div>Company Code</div>
              <v-text-field
                hide-details
                v-model="companyCode"
                class="inner-card-blue"
                solo
                background-color="#f5fafd"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap v-if="this.infoLogin.ADgroup.includes('HR_Career')">
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div style="padding-left: 32px">สถานภาพพนักงาน</div>
              <v-layout>
                <v-icon>mdi-book-account</v-icon>
                <v-autocomplete
                  prefix="*"
                  class="prefix inner-card-blue ml-2"
                  hide-details
                  solo
                  background-color="#f5fafd"
                  flat
                  :disabled="
                    !this.infoLogin.ADgroup.includes('HR_Career') &&
                    !this.infoLogin.ADgroup.includes('Admin_Career')
                  "
                  :items="EmployeeStatusList"
                  item-text="employeeStatus_Desc"
                  v-model="assetEmployeeStatus"
                  item-value="employeeStatus_Code"
                ></v-autocomplete>
              </v-layout>
            </v-flex>
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div>สถานที่ทำงาน</div>
              <v-autocomplete
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                :items="LocationList"
                item-text="location_TH"
                item-value="location_Code"
                v-model="assetLocation"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div>รหัส GL</div>
              <v-autocomplete
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                :items="GLAccountList"
                item-text="gL_Desc"
                item-value="gL_AccountCode"
                v-model="assetGLAccount"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div>ประเภทพนักงาน</div>
              <v-select
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                :items="GroupEmployeeList"
                item-text="groupEmployee_Desc"
                v-model="assetGroupEmployee"
                item-value="groupEmployee_Code"
              ></v-select>
            </v-flex>
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div>กลุ่มจ่ายเงินเดือน</div>
              <v-autocomplete
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                :items="PayrollTypeList"
                item-text="payrollType_Desc"
                v-model="assetPayrollType"
                item-value="payrollType_Code"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div>บันทึกเวลา</div>
              <v-select
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                :items="RecordTimeList"
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                item-text="recordTime_Desc"
                item-value="recordTime_Code"
                v-model="assetRecordTime"
              ></v-select>
            </v-flex>
          </v-layout>

          <v-layout row wrap v-if="this.infoLogin.ADgroup.includes('HR_Career')">
            <v-flex lg4 xl4 class="custom-space">
              <div style="padding-left: 32px">ลักษณะงาน</div>
              <v-layout>
                <!-- {{ assetJobType }} -->
                <v-icon>mdi-clipboard-account</v-icon>
                <v-autocomplete
                  prefix="*"
                  class="prefix inner-card-blue ml-2"
                  hide-details
                  solo
                  background-color="#f5fafd"
                  flat
                  :disabled="
                    !this.infoLogin.ADgroup.includes('HR_Career') &&
                    !this.infoLogin.ADgroup.includes('Admin_Career')
                  "
                  v-model="assetJobType"
                  :items="JobTypeList"
                  item-text="jobType_TH"
                  item-value="jobType_Code"
                  return-object
                ></v-autocomplete>
              </v-layout>
            </v-flex>
            <v-flex xs6 lg1 xl1 class="custom-space">
              <div>ระดับ</div>
              <v-text-field
                @input="autoJobGrade"
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                v-model="assetJobLevel"
                maxlength="2"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 lg1 xl1 class="custom-space">
              <div>Job Grade</div>
              <v-text-field
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                readonly
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                v-model="assetJobGrade"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 lg3 xl3 class="custom-space">
              <div>ประเภทการจ้างงาน</div>
              <v-autocomplete
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                v-model="assetEmploymentType"
                :items="EmploymentTypeList"
                item-text="employmentType_Desc"
                item-value="employmentType_Code"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs6 lg3 xl3 class="custom-space">
              <div>กลุ่มพนักงาน</div>
              <v-autocomplete
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                :items="GroupWorkList"
                item-text="groupWork_Desc"
                item-value="groupWork_Code"
                v-model="assetGroupWork"
              ></v-autocomplete>
            </v-flex>
          </v-layout>

          <v-layout row wrap v-if="this.infoLogin.ADgroup.includes('HR_Career')">
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div style="padding-left: 32px">ธนาคาร</div>
              <v-layout>
                <v-icon>mdi-bank</v-icon>
                <v-autocomplete
                  prefix="*"
                  class="prefix inner-card-blue ml-2"
                  hide-details
                  solo
                  background-color="#f5fafd"
                  flat
                  :disabled="
                    !this.infoLogin.ADgroup.includes('HR_Career') &&
                    !this.infoLogin.ADgroup.includes('Admin_Career')
                  "
                  :items="BankAccountList"
                  item-text="bankName_TH"
                  item-value="bankCode"
                  v-model="assetBankAccount"
                ></v-autocomplete>
              </v-layout>
            </v-flex>
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div>เลขที่บัญชี</div>
              <v-text-field
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                maxlength="12"
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
                @input="formatBankAccount"
                v-model="assetAccountNumber"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div>เงินเดือน</div>
              <v-text-field
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                maxlength="8"
                @keydown.native="keyFilter($event, 'number')"
                type="password"
                :append-icon="showSalary ? 'visibility' : 'visibility_off'"
                :type="showSalary ? 'text' : 'password'"
                @click:append="showSalary = !showSalary"
                :disabled="
                  (!this.infoLogin.ADgroup.includes('HR_Career') &&
                    !this.infoLogin.ADgroup.includes('Admin_Career')) ||
                  empIDPeoplePlus != ''
                "
                v-model="assetSalary"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div>ค่าสึกหรอ</div>
              <v-text-field
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                maxlength="8"
                @keydown.native="keyFilter($event, 'number')"
                v-model="assetDepreciation"
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
              ></v-text-field>
            </v-flex>
            <v-flex xs6 lg2 xl2 class="custom-space">
              <div>Payslip</div>
              <v-autocomplete
                prefix="*"
                class="prefix inner-card-blue"
                hide-details
                solo
                background-color="#f5fafd"
                flat
                :items="PayslipList"
                item-text="payslip_Type"
                v-model="assetPayslip"
                item-value="payslip_Code"
                :disabled="
                  !this.infoLogin.ADgroup.includes('HR_Career') &&
                  !this.infoLogin.ADgroup.includes('Admin_Career')
                "
              ></v-autocomplete>
            </v-flex>
          </v-layout>

          <v-layout>
            <v-btn
              @click="setReturnDate"
              v-if="this.assetFormStatus == 'ONBOARDING'"
              :disabled="
                !this.infoLogin.ADgroup.includes('HR_Career') &&
                !this.infoLogin.ADgroup.includes('Admin_Career')
              "
              color="#007fc4"
              dark
              >ยืนยันรับทรัพย์สินคืน</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              color="#f8c849"
              @click="addAssetEmployee"
              :disabled="
                !this.infoLogin.ADgroup.includes('HR_Career') &&
                !this.infoLogin.ADgroup.includes('Admin_Career')
              "
              >บันทึก</v-btn
            >
            <v-btn
              color="success"
              @click="approveAssetForm()"
              v-if="
                this.assetFormStatus == 'IN PROCESS' &&
                this.infoLogin.ADgroup.includes('HR_Career')
              "
              :disabled="
                !this.infoLogin.ADgroup.includes('HR_Career') &&
                !this.infoLogin.ADgroup.includes('Admin_Career')
              "
              >อนุมัติ</v-btn
            >
          </v-layout>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <div v-if="this.assetFormStatus == 'ONBOARDING' && this.signatureImage == ''">
      <v-chip text-color="black" color="#f8c849" class="my-3">ลงชื่อผู้รับ</v-chip>
      <vue-signature ref="signaturePad" class="custom-signature mb-2"></vue-signature>

      <v-layout justify-space-between>
        <div>
          <v-checkbox hide-details v-model="checkSignature">
            <template v-slot:label>
              <div style="font-size: 15px">
                ท่านได้อ่านรายละเอียดการรับอุปกรณ์ไอทีของบริษัท ฯ
                และเข้าใจเป็นอันดีแล้วก่อนกดยอมรับ
                <a @click="priceDialog = true" class="policy-link"
                  >รายละเอียดการรับอุปกรณ์ไอที</a
                >
              </div>
            </template>
          </v-checkbox>
          <v-checkbox
            hide-details
            v-model="checkObjective"
            @change="showObjectiveDialog"
            v-if="this.consentStatus == 'N'"
          >
            <template v-slot:label>
              <div style="font-size: 15px">
                ท่านได้อ่านวัตถุประสงค์การใช้ข้อมูลส่วนบุคคลเพื่อการสมัครงานของบริษัท ฯ
                และเข้าใจเป็นอันดีแล้วก่อนให้คำยินยอม
              </div>
            </template>
          </v-checkbox>
          <v-checkbox hide-details v-model="checkPolicy" v-if="this.consentStatus == 'N'">
            <template v-slot:label>
              <div style="font-size: 15px">
                ท่านได้อ่านคำประกาศการใช้ข้อมูลส่วนบุคคลของบริษัท ฯ
                และเข้าใจเป็นอันดีแล้วก่อนกดยอมรับ
                <a @click="policyDialog = true" class="policy-link">นโยบายของบริษัท ฯ</a>
              </div>
            </template>
          </v-checkbox>
        </div>
        <div>
          <v-btn @click="uploadSignature" color="#007fc4" dark>บันทึกลายเซ็น</v-btn>
          <v-btn @click="clearSignature" color="#f8c849">ลบลายเซ็น</v-btn>
        </div>
      </v-layout>
    </div>

    <div v-if="this.assetFormStatus == 'ONBOARDING' && this.signatureImage !== ''">
      <v-chip text-color="black" color="#f8c849" class="my-3">ลายเซ็นรับทรัพย์สิน</v-chip>
      <v-img
        v-if="signatureImage"
        style="border: 1px solid black"
        :src="signatureImage"
        alt="Signature"
      ></v-img>
    </div>

    <div v-if="loadingDialog">
      <Loading :value="loadingDialog" />
    </div>

    <v-dialog v-model="priceDialog" width="80%" persistent>
      <v-card>
        <v-card-title
          style="background: linear-gradient(to right, #007ec3, #0065a4); color: white"
        >
          <v-icon color="white">mdi-text-box</v-icon>&nbsp; รายละเอียดการรับอุปกรณ์ไอที
        </v-card-title>
        <v-card-text v-if="priceDialog" style="">
          <pdf
            src="https://webapps.ip-one.com/IP1Career/pdf/IT_Device.pdf"
            class="pdf-container"
          ></pdf>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="priceDialog = false">ยอมรับ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="assetDetailSnackbar" multi-line color="#f8c849" class="snackbar">
      <div style="color: black">
        {{ snackbarMessage }}
      </div>
      <v-btn flat @click="assetDetailSnackbar = false" color="black" class="btn-snackbar"
        >ปิด</v-btn
      >
    </v-snackbar>

    <v-dialog v-model="loginDialog" persistent width="30%">
      <v-card>
        <v-card-title
          style="background: linear-gradient(to right, #007ec3, #0065a4); color: white"
        >
          แจ้งอนุมัติรายการทรัพย์สินพนักงานใหม่
        </v-card-title>
        <v-card-text>
          <p>ชื่อผู้ใช้</p>
          <v-text-field
            solo
            flat
            label="ชื่อผู้ใช้ของระบบ PeoplePlus"
            background-color="#f4f4f4"
            hide-details
            class="inner-card-item"
            prepend-inner-icon="mdi-account-circle"
            v-model="peoplePlusUsername"
          ></v-text-field>
          <p class="mt-3">รหัสผ่าน</p>
          <v-text-field
            solo
            flat
            label="รหัสผ่านของระบบ PeoplePlus"
            background-color="#f4f4f4"
            hide-details
            class="inner-card-item"
            :append-icon="showPassword ? 'visibility' : 'visibility_off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            prepend-inner-icon="mdi-lock"
            v-model="peoplePlusPassword"
            @keyup.enter="confirmApproveAssetForm('ONBOARDING')"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" @click="confirmApproveAssetForm('ONBOARDING')" dark
            >ยืนยัน</v-btn
          >
          <v-btn color="#f8c849" @click="loginDialog = false">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="requireItemDialog" width="80%" persistent>
      <v-card>
        <v-card-title
          style="background: linear-gradient(to right, #007ec3, #0065a4); color: white"
        >
          <v-icon color="white">mdi-text-box</v-icon>&nbsp;
          รายการทรัพย์สินที่จำเป็นสำหรับพนักงานใหม่
        </v-card-title>
        <v-card-text>
          <v-layout>
            <v-flex xl6 lg6>
              <v-select
                :items="ChecklistItem"
                item-text="checklist_Name"
                item-value="checklist_Name"
                @input="setRequireItem"
                hide-details
                class="inner-card-file"
                solo
                flat
              >
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xl4>
              <div v-for="item1 in ITItemLists" :key="item1.list_ID">
                <v-checkbox
                  :label="item1.list_Description"
                  :value="item1.list_Description"
                  hide-details
                  v-model="requireItem"
                ></v-checkbox>
              </div>
            </v-flex>
            <v-flex xl4>
              <div v-for="item2 in AdminItemLists" :key="item2.list_ID">
                <v-checkbox
                  :label="item2.list_Description"
                  :value="item2.list_Description"
                  hide-details
                  v-model="requireItem"
                ></v-checkbox>
              </div>
            </v-flex>
            <v-flex xl4>
              <div v-for="item3 in HRItemLists" :key="item3.list_ID">
                <v-checkbox
                  :label="item3.list_Description"
                  :value="item3.list_Description"
                  hide-details
                  v-model="requireItem"
                ></v-checkbox>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#007fc4" @click="addRequireItem" dark>ยืนยัน</v-btn>
          <v-btn color="#f8c849" @click="requireItemDialog = false">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="objectiveDialog" width="80%" persistent>
      <v-card>
        <v-card-title
          style="
            background: linear-gradient(to right, #007ec3, #0065a4);
            color: white;
            font-weight: bold;
          "
        >
          <v-icon color="white">mdi-text-box</v-icon>&nbsp; {{ objective.title }}
        </v-card-title>
        <v-card-text>&nbsp; &nbsp; &nbsp; &nbsp;{{ objective.item1 }}</v-card-text>
        <v-card-text>{{ objective.item2 }}</v-card-text>
        <v-card-text style="font-weight: bold">{{ objective.item3 }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="objectiveDialog = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="policyDialog" width="80%" persistent>
      <Policy></Policy>
    </v-dialog>
  </div>
</template>

<script>
import Loading from "../components/core/Loading";
import apiService from "@/services/apiService";
import apiMasterData from "../services/apiMasterData";
import { sync } from "vuex-pathify";
import Swal from "sweetalert2";
import EmployeeInfo from "./PeoplePlus/EmployeeInfo.vue";
import Policy from "../pages/core/Policy.vue";
import VueSignature from "vue-signature";
import pdf from "vue-pdf";
import axios from "axios";
import keyFilter from "@/plugins/keyFilter";
import objectiveJson from "../i18n/data.json";

export default {
  components: {
    Loading,
    EmployeeInfo,
    VueSignature,
    pdf,
    Policy,
  },

  data() {
    return {
      keyFilter,
      systemAssetDetail: [],
      deviceAssetDetail: [],
      adminAssetDetail: [],
      hrAssetDetail: [],
      headerSystemAsset: [
        { text: "ลำดับ", value: "item_LineNo" },
        { text: "ชื่อรายการ", value: "list_Description" },
        { text: "Username", value: "item_Detail1" },
        { text: "Password", value: "item_Detail2" },
        { text: "หมายเหตุ", value: "item_Remark" },
        { text: "ประเภท", value: "item_Type" },
      ],
      headerDeviceAsset: [
        { text: "ลำดับ", value: "item_LineNo" },
        { text: "ชื่อรายการ", value: "list_Description" },
        { text: "รุ่น", value: "item_Detail1" },
        { text: "Serial No", value: "item_Detail2" },
        { text: "หมายเหตุ", value: "item_Remark" },
        { text: "ประเภท", value: "item_Type" },
      ],
      headerAdminAsset: [
        { text: "ลำดับ", value: "item_LineNo" },
        { text: "ชื่อรายการ", value: "list_Description" },
        { text: "สถานที่/ทะเบียน", value: "item_Detail1" },
        { text: "หมายเลข/จำนวน", value: "item_Detail2" },
        { text: "หมายเหตุ", value: "item_Remark" },
        { text: "ประเภท", value: "item_Type" },
      ],
      headerHRAsset: [
        { text: "ลำดับ", value: "item_LineNo" },
        { text: "ชื่อรายการ", value: "list_Description" },
        { text: "หมายเลขบัตร", value: "item_Detail1" },
        { text: "หมายเหตุ", value: "item_Remark" },
        { text: "ประเภท", value: "item_Type" },
      ],
      signatureImage: "",
      myuser: "",
      mypass: "",
      myplace: "",
      mynumber: "",
      myremark: "",
      e1: 1, // ตัวแปรสำหรับควบคุม step ปัจจุบัน
      pageCount: 3, // จำนวนของ steps ที่มีอยู่
      effectiveStatus: false,
      onboardDate: "",
      customOnboardDate: "",
      effectiveDate: "",
      customEffectiveDate: "",
      menu2: false,
      menu3: false,
      currentDate: "",
      createUser: "",
      replacePosition: "N",
      UserList: [],
      AllPosition: [],
      AllCompanyCodeList: [],
      CompanyCodeList: [],
      ItemLists: [], // master item list
      ITItemLists: [], // it item list
      itAsset: "", // v-model ที่เลือกอยู่
      itTypeAsset: "",
      AdminItemLists: [], // admin item list
      adminAsset: "", // v-model ที่เลือกอยู่
      HRItemLists: [],
      hrAsset: "",
      replaceEmployee: "",
      selectDepartment: "",
      workUnit: "",
      subTeam: "",
      companyCode: "",
      assetFormPosition: "",
      assetEmploymentID: "",
      assetEmployeeStatus: "",
      assetLocation: "",
      assetGLAccount: "",
      assetGroupEmployee: "",
      assetGroupWork: "",
      assetRecordTime: "",
      assetJobType: "",
      assetJobGrade: "",
      assetJobLevel: "",
      assetEmploymentType: "",
      assetPayrollType: "",
      assetBankAccount: "",
      assetAccountNumber: "",
      assetSalary: "",
      assetFormStatus: "",
      EmployeeStatusList: [],
      LocationList: [],
      GLAccountList: [],
      GroupEmployeeList: [],
      GroupWorkList: [],
      RecordTimeList: [],
      JobTypeList: [],
      JobGradeList: [],
      EmploymentTypeList: [],
      PayrollTypeList: [],
      BankAccountList: [],
      RequireItemList: [],
      loadingDialog: false,
      priceDialog: false,
      assetDetailSnackbar: false,
      snackbarMessage: "",
      showAdd: "",
      detailState: "ADD",
      checkSignature: false,
      checkObjective: false,
      checkPolicy: false,
      usernameADs: "",
      passwordADs: "",
      descriptionADs: "",
      emailADs: "",
      employeeCardIDADs: "",
      phoneADs: "",
      ppToken: "",
      jobName: "",
      locationName: "",
      decodeEmpID: "",
      loginDialog: false,
      peoplePlusUsername: "",
      peoplePlusPassword: "",
      missingItems: [], // เพื่อเก็บรายการที่ขาดหาย
      showPassword: false,
      showSalary: false,
      requireItemDialog: false,
      requireItem: [],
      textRequireItem: "",
      ChecklistItem: [],
      selectGroup: [],
      objectiveDialog: false,
      objective: objectiveJson,
      PayslipList: [],
      assetPayslip: "",
      assetDepreciation: "",
      requireEmail: "N",
      checkADsUser: "",
      noReplaceJobtype: false,
    };
  },

  computed: {
    ...sync("*"),
    filteredITItemLists() {
      return this.ITItemLists.filter((item) => {
        if (this.detailState === "EDIT") {
          return true;
        }

        return (
          !this.systemAssetDetail.some(
            (detail) => detail.list_Description === item.list_Description
          ) &&
          !this.deviceAssetDetail.some(
            (detail) => detail.list_Description === item.list_Description
          )
        );
      });
    },
    filteredAdminItemLists() {
      return this.AdminItemLists.filter((item) => {
        if (this.detailState === "EDIT") {
          return true;
        }

        return !this.adminAssetDetail.some(
          (detail) => detail.list_Description === item.list_Description
        );
      });
    },
    filteredHRItemLists() {
      return this.HRItemLists.filter((item) => {
        if (this.detailState === "EDIT") {
          return true;
        }
        return !this.hrAssetDetail.some(
          (detail) => detail.list_Description === item.list_Description
        );
      });
    },
  },

  created() {
    this.fetchItemLists();
    this.fetchUserAll();
    this.fetchAllPosition();
    this.fetchCompanyCode();
    this.fetchEmployeeStatus();
    this.fetchLocation();
    this.fetchGLAccount();
    this.fetchGroupEmployee();
    this.fetchGroupWork();
    this.fetchRecordTime();
    this.fetchJobType();
    this.fetchJobGrade();
    this.fetchEmploymentType();
    this.fetchPayrollType();
    this.fetchBankAccount();
    this.fetchRequireItemList();
    this.fetchPayslip();

    setTimeout(() => {
      if (this.showAdd == "") {
        this.checkRoleHeader();
      } else {
        console.log("Already have role");
      }
    }, 1500);

    if (this.$route.query.EmployeeID) {
      this.decodeEmpID = atob(this.$route.query.EmployeeID);
      this.getAssetID();
    }

    if (this.$route.path != "/EmploymentAsset") {
      setTimeout(() => {
        this.getAssetForm();
        this.getAssetFormDetail();
      }, 1000);
    }

    this.fetchChecklistItem();
  },

  watch: {
    selectDepartment: {
      handler: "filterCompany",
      immediate: true,
    },
    itAsset: {
      handler: "filterType",
    },
    assetAccountNumber: {
      handler: "formatBankAccount",
    },
    adminAsset: {
      handler: "clearInput",
    },
    hrAsset: {
      handler: "clearInputHR",
    },
    effectiveStatus: {
      handler: "clearDate",
    },
    assetSalary: {
      handler: "formatSalary",
    },
    assetFormPosition(val) {
      if (val.length == 0 || (this.noReplaceJobtype && this.assetJobType != undefined))
        return (this.noReplaceJobtype = false);
      const mItemJobtype = this.JobTypeList.filter(
        (type) => type.jobType_Code == val.department_Desc
      );
      if (mItemJobtype.length == 1) {
        this.assetJobType = mItemJobtype[0];
      } else {
        this.assetJobType = "";
      }
    },
  },

  methods: {
    clearDate() {
      if (this.effectiveStatus == false) {
        this.customEffectiveDate = "";
      }
    },
    checkRoleHeader() {
      if (this.infoLogin.ADgroup.includes("Admin_Career")) {
        this.showAdd = "ADMIN";
        this.headerSystemAsset.push({ text: "Action", sortable: false });
        this.headerDeviceAsset.push({ text: "Action", sortable: false });
        this.headerAdminAsset.push({ text: "Action", sortable: false });
        this.headerHRAsset.push({ text: "Action", sortable: false });
      } else if (this.infoLogin.ADgroup.includes("HR_Career")) {
        this.showAdd = "HR";
        this.headerHRAsset.push({ text: "Action", sortable: false });
      } else if (this.infoLogin.ADgroup.includes("User_Career")) {
        this.showAdd = "USER";
        this.headerAdminAsset.push({ text: "Action", sortable: false });
      } else {
        this.showAdd = "XXX";
      }
    },
    formatBankAccount() {
      let cleaned = ("" + this.assetAccountNumber).replace(/\D/g, "");

      if (cleaned.length <= 3) {
        this.assetAccountNumber = cleaned;
      } else if (cleaned.length <= 4) {
        this.assetAccountNumber = cleaned.slice(0, 3) + "-" + cleaned.slice(3);
      } else if (cleaned.length <= 9) {
        this.assetAccountNumber =
          cleaned.slice(0, 3) + "-" + cleaned.slice(3, 4) + "-" + cleaned.slice(4, 9);
      } else {
        this.assetAccountNumber =
          cleaned.slice(0, 3) +
          "-" +
          cleaned.slice(3, 4) +
          "-" +
          cleaned.slice(4, 9) +
          "-" +
          cleaned.slice(9);
      }
    },
    formatSelectedDate(date) {
      const [year, month, day] = date.split("-");
      this.customOnboardDate = `${day}/${month}/${year}`; // จัดรูปแบบวันที่เป็น dd/MM/yyyy
      this.menu = false; // ปิดเมนูหลังจากเลือกวันที่
    },
    formatSelectedDate2(date) {
      const [year, month, day] = date.split("-");
      this.customEffectiveDate = `${day}/${month}/${year}`; // จัดรูปแบบวันที่เป็น dd/MM/yyyy
      this.menu = false; // ปิดเมนูหลังจากเลือกวันที่
    },
    getNextItemNumber() {
      return this.systemAssetDetail.length + this.deviceAssetDetail.length + 1;
    },
    formatSalary() {
      let value = this.assetSalary.replace(/,/g, "");
      this.assetSalary = new Intl.NumberFormat().format(value);
    },
    autoJobGrade() {
      this.assetJobGrade = "0";
      this.assetJobGrade = (parseInt(this.assetJobLevel, 10) + 6)
        .toString()
        .padStart(2, "0");
    },
    showObjectiveDialog() {
      if (this.checkObjective == true) {
        this.objectiveDialog = true;
      } else {
        this.objectiveDialog = false;
      }
    },

    setRequireItem(group) {
      this.selectGroup = this.ChecklistItem.filter(
        (type) => type.checklist_Name == group
      );

      this.requireItem = [];

      this.selectGroup.forEach((item) => {
        const itItems = item.checklist_IT.split(",");
        this.requireItem.push(...itItems);
        const adminItems = item.checklist_Admin.split(",");
        this.requireItem.push(...adminItems);
        const hrItems = item.checklist_HR.split(",");
        this.requireItem.push(...hrItems);
      });
    },

    addSystemItemAsset() {
      if (this.myuser == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ต้องกรอกข้อมูลให้ครบ";
        return;
      }
      if (this.mypass == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ต้องกรอกข้อมูลให้ครบ";
        return;
      }
      const itemDescription = {
        item_LineNo: this.getNextItemNumber(),
        item_ID: this.ITItemLists.find((item) => item.list_Description === this.itAsset)
          .list_ID,
        list_Description: this.itAsset,
        item_Detail1: this.myuser,
        item_Detail2: this.mypass,
        item_Remark: this.myremark,
        item_Type: this.ITItemLists.find((item) => item.list_Description === this.itAsset)
          .list_Type,
        item_Quantity: "1",
      };
      this.systemAssetDetail.push(itemDescription);
      this.itAsset = "";
      this.myuser = "";
      this.mypass = "";
      this.myremark = "";
    },
    addDeviceItemAsset() {
      if (this.myuser == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ต้องกรอกข้อมูลให้ครบ";
        return;
      }
      if (this.mypass == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ต้องกรอกข้อมูลให้ครบ";
        return;
      }
      const itemDescription = {
        item_LineNo: this.getNextItemNumber(),
        item_ID: this.ITItemLists.find((item) => item.list_Description === this.itAsset)
          .list_ID,
        list_Description: this.itAsset,
        item_Detail1: this.myuser,
        item_Detail2: this.mypass,
        item_Remark: this.myremark,
        item_Type: this.ITItemLists.find((item) => item.list_Description === this.itAsset)
          .list_Type,
        item_Quantity: "1",
      };
      this.deviceAssetDetail.push(itemDescription);
      this.itAsset = "";
      this.myuser = "";
      this.mypass = "";
      this.myremark = "";
    },
    addAdminItemAsset() {
      if (
        this.adminAsset == "Layout" ||
        this.adminAsset == "Fleet Card" ||
        this.adminAsset == "Uniform" ||
        this.adminAsset == "Key"
      ) {
        if (this.myplace == "") {
          this.assetDetailSnackbar = true;
          this.snackbarMessage = "ต้องกรอกข้อมูลให้ครบ";
          return;
        }
        if (this.mynumber == "") {
          this.assetDetailSnackbar = true;
          this.snackbarMessage = "ต้องกรอกข้อมูลให้ครบ";
          return;
        }
      } else {
        if (this.mynumber == "") {
          this.assetDetailSnackbar = true;
          this.snackbarMessage = "ต้องกรอกข้อมูลให้ครบ";
          return;
        }
      }
      const itemDescription = {
        item_LineNo: this.adminAssetDetail.length + 1,
        item_ID: this.AdminItemLists.find(
          (item) => item.list_Description === this.adminAsset
        ).list_ID,
        list_Description: this.adminAsset,
        item_Detail1: this.myplace,
        item_Detail2: this.mynumber,
        item_Remark: this.myremark,
        item_Type: this.AdminItemLists.find(
          (item) => item.list_Description === this.adminAsset
        ).list_Type,
        item_Quantity: "1",
      };
      this.adminAssetDetail.push(itemDescription);
      this.adminAsset = "";
      this.myplace = "";
      this.mynumber = "";
      this.myremark = "";
    },
    addHRItemAsset() {
      if (this.insurance == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ต้องกรอกข้อมูลให้ครบ";
        return;
      }
      const itemDescription = {
        item_LineNo: this.hrAssetDetail.length + 1,
        item_ID: this.HRItemLists.find((item) => item.list_Description === this.hrAsset)
          .list_ID,
        list_Description: this.hrAsset,
        item_Detail1: this.insurance,
        item_Detail2: "",
        item_Remark: this.myremark,
        item_Type: this.HRItemLists.find((item) => item.list_Description === this.hrAsset)
          .list_Type,
        item_Quantity: "1",
      };
      this.hrAssetDetail.push(itemDescription);
      this.hrAsset = "";
      this.myplace = "";
      this.insurance = "";
      this.myremark = "";
    },

    editSystemItemAsset(data) {
      this.detailState = "EDIT";
      this.editingIndex = this.systemAssetDetail.findIndex(
        (item) => item.item_LineNo === data.item.item_LineNo
      );
      this.itAsset = data.item.list_Description;
      this.myuser = "";
      this.myuser = data.item.item_Detail1;
      this.mypass = "";
      this.mypass = data.item.item_Detail2;
      this.myremark = "";
      this.myremark = data.item.item_Remark;
    },
    editDeviceItemAsset(data) {
      this.detailState = "EDIT";
      this.editingIndex2 = this.deviceAssetDetail.findIndex(
        (item) => item.item_LineNo === data.item.item_LineNo
      );
      this.itAsset = data.item.list_Description;
      this.myuser = "";
      this.myuser = data.item.item_Detail1;
      this.mypass = "";
      this.mypass = data.item.item_Detail2;
      this.myremark = "";
      this.myremark = data.item.item_Remark;
    },
    editAdminItemAsset(data) {
      this.detailState = "EDIT";
      this.editingIndex3 = this.adminAssetDetail.findIndex(
        (item) => item.item_LineNo === data.item.item_LineNo
      );
      this.adminAsset = data.item.list_Description;
      this.myplace = "";
      this.myplace = data.item.item_Detail1;
      this.mynumber = "";
      this.mynumber = data.item.item_Detail2;
      this.myremark = "";
      this.myremark = data.item.item_Remark;
    },
    editHRItemAsset(data) {
      this.detailState = "EDIT";
      this.editingIndex4 = this.hrAssetDetail.findIndex(
        (item) => item.item_LineNo === data.item.item_LineNo
      );
      this.hrAsset = data.item.list_Description;
      this.insurance = "";
      this.insurance = data.item.item_Detail1;
      this.myremark = "";
      this.myremark = data.item.item_Remark;
    },
    confirmEditSystemItemAsset() {
      this.systemAssetDetail[this.editingIndex].item_Detail1 = this.myuser;
      this.systemAssetDetail[this.editingIndex].item_Detail2 = this.mypass;
      this.systemAssetDetail[this.editingIndex].item_Remark = this.myremark;
      this.detailState = "ADD";
      this.itAsset = "";
      this.myuser = "";
      this.mypass = "";
      this.myremark = "";
    },
    confirmEditDeviceItemAsset() {
      this.deviceAssetDetail[this.editingIndex2].item_Detail1 = this.myuser;
      this.deviceAssetDetail[this.editingIndex2].item_Detail2 = this.mypass;
      this.deviceAssetDetail[this.editingIndex2].item_Remark = this.myremark;
      this.detailState = "ADD";
      this.itAsset = "";
      this.myuser = "";
      this.mypass = "";
      this.myremark = "";
    },
    confirmEditAdminItemAsset() {
      this.adminAssetDetail[this.editingIndex3].item_Detail1 = this.myplace;
      this.adminAssetDetail[this.editingIndex3].item_Detail2 = this.mynumber;
      this.adminAssetDetail[this.editingIndex3].item_Remark = this.myremark;
      this.detailState = "ADD";
      this.adminAsset = "";
      this.myuser = "";
      this.mypass = "";
      this.myremark = "";
    },
    confirmEditHRItemAsset() {
      this.hrAssetDetail[this.editingIndex4].item_Detail1 = this.insurance;
      this.hrAssetDetail[this.editingIndex4].item_Remark = this.myremark;
      this.detailState = "ADD";
      this.hrAsset = "";
      this.insurance = "";
      this.myremark = "";
    },

    deleteITItemAsset(index, type, cNo) {
      if (type === "SYSTEMS") {
        this.systemAssetDetail.splice(index, 1); // ลบข้อมูลจาก system
      } else if (type === "DEVICE" || type === "COMPUTER") {
        this.deviceAssetDetail.splice(index, 1); // ลบข้อมูลจาก device
      }

      this.systemAssetDetail.forEach((item) => {
        if (item.item_LineNo > cNo) {
          item.item_LineNo = item.item_LineNo - 1;
        }
      });

      this.deviceAssetDetail.forEach((item) => {
        if (item.item_LineNo > cNo) {
          item.item_LineNo = item.item_LineNo - 1;
        }
      });
    },
    deleteAdminItemAsset(index, cNo) {
      this.adminAssetDetail.splice(index, 1);

      this.adminAssetDetail.forEach((item) => {
        if (item.item_LineNo > cNo) {
          item.item_LineNo = item.item_LineNo - 1;
        }
      });
    },
    deleteHRItemAsset(index, cNo) {
      this.hrAssetDetail.splice(index, 1);

      this.hrAssetDetail.forEach((item) => {
        if (item.item_LineNo > cNo) {
          item.item_LineNo = item.item_LineNo - 1;
        }
      });
    },

    filterCompany() {
      this.CompanyCodeList = this.AllCompanyCodeList.filter(
        (type) => type.department_Name === this.selectDepartment
      );
      if (this.CompanyCodeList.length > 0) {
        this.workUnit = this.CompanyCodeList[0].workUnitName;
        this.subTeam = this.CompanyCodeList[0].subteamName;
        this.companyCode = this.CompanyCodeList[0].company_Code;
      }
    },
    filterType() {
      if (this.itAsset != "") {
        this.itTypeAsset = this.ITItemLists.find(
          (item) => item.list_Description === this.itAsset
        ).list_Type;
      } else {
        this.itTypeAsset = "";
      }

      if (this.detailState == "EDIT") {
        return;
      } else {
        this.myuser = "";
        this.mypass = "";
        this.myremark = "";
      }
    },
    clearInput() {
      if (this.detailState == "EDIT") {
        return;
      } else {
        this.mynumber = "";
        this.myplace = "";
        this.myremark = "";
      }
    },
    clearInputHR() {
      if (this.detailState == "EDIT") {
        return;
      } else {
        this.insurance = "";
        this.myremark = "";
      }
    },

    nextPage() {
      if (this.e1 < this.pageCount) {
        this.e1++; // เลื่อนไป step ถัดไป
      }
    },
    prevPage() {
      if (this.e1 > 1) {
        this.e1--; // เลื่อนไป step ก่อนหน้า
      }
    },

    async fetchItemLists() {
      try {
        const response = await apiMasterData.getItemList();
        this.ItemLists = response.data;
        this.ITItemLists = this.ItemLists.filter(
          (type) => type.list_OwnerDepartment === "IT"
        );
        this.AdminItemLists = this.ItemLists.filter(
          (type) => type.list_OwnerDepartment === "Admin"
        );
        this.HRItemLists = this.ItemLists.filter(
          (type) => type.list_OwnerDepartment === "HRBP"
        );
      } catch (error) {
        console.error(error);
      }
    },
    async fetchUserAll() {
      try {
        const response = await apiService.getAdsUserList();
        this.UserList = response.data.results;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAllPosition() {
      this.loadingDialog = true;
      try {
        const response = await apiMasterData.getAllPosition();
        this.loadingDialog = false; // แสดง Loader
        this.AllPosition = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchCompanyCode() {
      try {
        const response = await apiMasterData.getCompanyCode();
        this.AllCompanyCodeList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchEmployeeStatus() {
      try {
        const response = await apiMasterData.getEmployeeStatus();
        this.EmployeeStatusList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchLocation() {
      try {
        const response = await apiMasterData.getLocation();
        this.LocationList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchGLAccount() {
      try {
        const response = await apiMasterData.getGLAccount();
        this.GLAccountList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchGroupEmployee() {
      try {
        const response = await apiMasterData.getGroupEmployee();
        this.GroupEmployeeList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchGroupWork() {
      try {
        const response = await apiMasterData.getGroupWork();
        this.GroupWorkList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchRecordTime() {
      try {
        const response = await apiMasterData.getRecordTime();
        this.RecordTimeList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchJobType() {
      try {
        const response = await apiMasterData.getJobType();
        this.JobTypeList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchJobGrade() {
      try {
        const response = await apiMasterData.getJobGrade();
        this.JobGradeList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchEmploymentType() {
      try {
        const response = await apiMasterData.getEmploymentType();
        this.EmploymentTypeList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPayrollType() {
      try {
        const response = await apiMasterData.getPayrollType();
        this.PayrollTypeList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchBankAccount() {
      try {
        const response = await apiMasterData.getBankAccount();
        this.BankAccountList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchRequireItemList() {
      try {
        const response = await apiMasterData.getRequireItemList();
        this.RequireItemList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchChecklistItem() {
      try {
        const response = await apiMasterData.getChecklistItem();
        this.ChecklistItem = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPayslip() {
      try {
        const response = await apiMasterData.getPayslip();
        this.PayslipList = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getAssetForm() {
      const id =
        this.$route.query.EmployeeID !== undefined
          ? { EmployeeAsset_ID: this.myAssetID[0].employeeAsset_ID }
          : { EmployeeAsset_ID: localStorage.getItem("selectAsset") };
      try {
        const response = await apiService.getEmploymentAssetByID(id);
        this.assetEmploymentID = response.data.employment_ID;
        this.customOnboardDate = response.data.onboardDate;
        this.currentDate = response.data.createDate;
        this.createUser = response.data.createByFullName;
        this.empIDPeoplePlus = response.data.employee_ID;
        this.textRequireItem = response.data.requireItem;
        if (this.textRequireItem != "") {
          this.textRequireItem.split(",").forEach((item) => {
            this.requireItem.push(item.trim());
          });
        }
        this.requireEmail = response.data.requireEmail;
        this.checkADsUser = response.data.aDsUser;
        this.selectDepartment = response.data.department_Desc;
        this.replacePosition = response.data.replaceStatus;
        this.replaceEmployee = response.data.replaceEmployeeID;

        const mItemPosition = this.AllPosition.filter(
          (type) => type.position_Code == response.data.position_Desc
        );
        this.noReplaceJobtype = true;
        this.assetFormPosition = mItemPosition[0];

        const mItemJobtype = this.JobTypeList.filter(
          (type) => type.jobType_Code == response.data.jobType
        );
        this.assetJobType = mItemJobtype[0];

        if (response.data.employeeStatus != "") {
          this.assetEmployeeStatus = response.data.employeeStatus;
        } else {
          this.assetEmployeeStatus = "0";
        }
        this.assetLocation = response.data.location;
        this.assetGLAccount = response.data.gL_Account;
        this.assetGroupEmployee = response.data.groupEmployee;
        this.assetPayrollType = response.data.payrollType;
        this.assetRecordTime = response.data.recordTime;

        this.assetJobGrade = response.data.jobGrade;
        this.assetJobLevel = response.data.jobLevel;
        this.assetEmploymentType = response.data.employmentType;
        this.assetGroupWork = response.data.groupWork;
        if (response.data.bankAccount != "") {
          this.assetBankAccount = response.data.bankAccount;
        } else {
          this.assetBankAccount = "0004";
        }
        this.assetAccountNumber = response.data.accountNumber;
        this.assetSalary = response.data.salary;
        this.assetDepreciation = response.data.depreciation;
        this.assetPayslip = response.data.payslip;
        this.signatureImage = response.data.signature;
        this.assetFormStatus = response.data.formStatus;
        if (response.data.effectiveDate != "") {
          this.effectiveStatus = true;
          this.customEffectiveDate = response.data.effectiveDate;
        }
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async getAssetFormDetail() {
      const id =
        this.$route.query.EmployeeID !== undefined
          ? { EmployeeAsset_ID: this.myAssetID[0].employeeAsset_ID }
          : { EmployeeAsset_ID: localStorage.getItem("selectAsset") };
      try {
        const response = await apiService.getEmploymentAssetDetailByID(id);
        this.deviceAssetDetail = response.data.filter(
          (type) => type.item_Type === "COMPUTER" || type.item_Type === "DEVICE"
        );
        this.systemAssetDetail = response.data.filter(
          (type) => type.item_Type === "SYSTEMS"
        );
        this.adminAssetDetail = response.data.filter(
          (type) => type.list_OwnerDepartment === "Admin"
        );
        this.hrAssetDetail = response.data.filter(
          (type) => type.list_OwnerDepartment === "HRBP"
        );
      } catch (error) {
        console.error(error);
      }
    },

    async addAssetEmployee() {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่ว่าต้องการบันทึกข้อมูล ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmAddAssetEmployee(false);
        }
      });
    },
    async confirmAddAssetEmployee(flagShow) {
      const data = {
        EmployeeAsset_ID:
          this.selectAssetID !== ""
            ? this.selectAssetID
            : localStorage.getItem("selectAsset"),
        Employment_ID: this.assetEmploymentID,
        RequireEmail: this.requireEmail,
        CompanyCode: this.companyCode,
        Department_Desc: this.selectDepartment,
        WorkUnit_Desc: this.workUnit,
        SubTeam_Desc: this.subTeam,
        Position_Desc: this.assetFormPosition.position_Code,
        ReplaceStatus: this.replacePosition,
        ReplaceEmployeeID: this.replaceEmployee,
        OnboardDate: this.customOnboardDate,
        UpdateBy: this.infoLogin.ADempId
          ? this.infoLogin.ADempId
          : localStorage.getItem("currentEmpID"),
        EmployeeStatus: this.assetEmployeeStatus,
        Location: this.assetLocation,
        GL_Account: this.assetGLAccount,
        GroupEmployee: this.assetGroupEmployee,
        GroupWork: this.assetGroupWork,
        RecordTime: this.assetRecordTime,
        JobType: this.assetJobType.jobType_Code,
        JobGrade: this.assetJobGrade,
        JobLevel: this.assetJobLevel,
        EmploymentType: this.assetEmploymentType,
        PayrollType: this.assetPayrollType,
        BankAccount: this.assetBankAccount,
        AccountNumber: this.assetAccountNumber.replace(/-/g, ""),
        Salary: flagShow ? '0' : this.assetSalary,
        Depreciation: this.assetDepreciation,
        Payslip: this.assetPayslip,
        EffectiveDate: this.customEffectiveDate,
        EmployeeDeviceAssetDetail: this.deviceAssetDetail,
        EmployeeSystemAssetDetail: this.systemAssetDetail,
        EmployeeAdminAssetDetail: this.adminAssetDetail,
        EmployeeHRAssetDetail: this.hrAssetDetail,
      };

      try {
        await apiService.postEmployeeAsset(data);
        if (!flagShow) {
          Swal.fire({
            title: "สำเร็จ!",
            text: "บันทึกข้อมูลสำเร็จ",
            icon: "success",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async setReturnDate() {
      Swal.fire({
        title: `คุณแน่ใจหรือไม่ว่าต้องการยืนยันการรับคืนทรัพย์สินนี้?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmSetReturnDate();
        }
      });
    },
    async confirmSetReturnDate() {
      const data = {
        EmployeeAsset_ID:
          this.selectAssetID !== ""
            ? this.selectAssetID
            : localStorage.getItem("selectAsset"),
        approveBy: this.infoLogin.ADempId
          ? this.infoLogin.ADempId
          : localStorage.getItem("currentEmpID"),
      };
      try {
        const response = await apiService.updateReturnDate(data);
        console.log("Response:", response.data);
        Swal.fire({
          title: "สำเร็จ!",
          text: "ได้รับทรัพย์สินคืนเรียบร้อย",
          icon: "success",
          confirmButtonText: "ตกลง",
          allowOutsideClick: false,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async addRequireItem() {
      this.textRequireItem = this.requireItem.join(",");
      Swal.fire({
        title: `คุณแน่ใจหรือไม่ว่าต้องการบันทึกข้อมูล?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmAddRequireItem();
        }
      });
    },
    async confirmAddRequireItem() {
      this.loadingDialog = true;
      const data = {
        EmployeeAsset_ID:
          this.selectAssetID !== ""
            ? this.selectAssetID
            : localStorage.getItem("selectAsset"),
        RequireItem: this.textRequireItem,
      };
      try {
        const response = await apiService.updateRequireItem(data);
        console.log("Response:", response.data);
        this.loadingDialog = false;
        this.requireItemDialog = false;
        Swal.fire({
          title: "สำเร็จ!",
          text: "บันทึกข้อมูลสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
          allowOutsideClick: false,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    },

    dataURLToBlob(dataURL) {
      const byteString = atob(dataURL.split(",")[1]);
      const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    async uploadSignature() {
      const dataURL = this.$refs.signaturePad.save();

      const blob = this.dataURLToBlob(dataURL);

      const employeeAssetID =
        this.myAssetID[0] && this.myAssetID[0].employeeAsset_ID
          ? this.myAssetID[0].employeeAsset_ID
          : localStorage.getItem("selectAsset");

      const formData = new FormData();
      formData.append("EmployeeAsset_ID", employeeAssetID);
      formData.append("signature", blob, "signature.png");
      formData.append("ReceiveEmpID", this.empIDPeoplePlus);
      formData.append("ReceiveBy", this.firstnameADs + " " + this.surnameADs);

      if (this.consentStatus == "Y") {
        this.checkObjective = true;
        this.checkPolicy = true;
      }
      if (this.checkSignature == true && this.checkObjective && this.checkPolicy) {
        try {
          const response = await apiService.postEmployeeSignature(formData);
          console.log("Response:", response.data);
          Swal.fire({
            title: "สำเร็จ!",
            text: "คุณได้เซ็นรับทรัพย์สินของบริษัทเรียบร้อย",
            icon: "success",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
          this.getAssetForm();
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        Swal.fire({
          title: "การยืนยัน!",
          text: "กรุณายอมรับเงื่อนไขทั้งหมดก่อนส่งข้อมูล",
          icon: "warning",
          confirmButtonText: "ตกลง",
          allowOutsideClick: false,
          confirmButtonColor: "#3085d6",
        });
      }
    },
    clearSignature() {
      this.$refs.signaturePad.clear();
    },

    validateForm(val) {
      if (val.employee_NickName == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณากรอกชื่อเล่น";
        return true;
      } else if (val.employee_Weight == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณากรอกน้ำหนัก";
        return true;
      } else if (val.employee_High == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณากรอกส่วนสูง";
        return true;
      } else if (val.employee_Sex == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณากรอกเพศ";
        return true;
      } else if (val.employee_IDNumber == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณากรอกเลขบัตรประชาชน";
        return true;
      } else if (val.employee_Birthday == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกวันเกิด";
        return true;
      } else if (val.employee_BloodGroup == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกกรุ๊ปเลือด";
        return true;
      } else if (val.employee_Ethnicity == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกเชื้อชาติ";
        return true;
      } else if (val.employee_Nationality == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกสัญชาติ";
        return true;
      } else if (val.employee_PersonalStatus == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกสถานภาพ";
        return true;
      } else if (val.employee_Stamilit == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกสถานะทหาร";
        return true;
      } else if (val.employee_Address == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณากรอกข้อมูลที่อยู่";
        return true;
      } else if (val.employee_Province == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกจังหวัด";
        return true;
      } else if (val.employee_District == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกเขต/อำเภอ";
        return true;
      } else if (val.employee_SubDistrict == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกแขวง/ตำบล";
        return true;
      } else if (val.employee_ZipCode == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณากรอกรหัสไปรษณีย์";
        return true;
      } else if (val.employee_Country == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกประเทศ";
        return true;
      } else if (val.employee_Academy == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกสถานศึกษา";
        return true;
      } else if (val.employee_Educational == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกวุฒิการศึกษา";
        return true;
      } else if (this.customOnboardDate == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกวันที่เริ่มงาน";
        return true;
      } else if (this.selectDepartment == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกหน่วยงาน";
        return true;
      } else if (this.assetGLAccount == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกรหัส GL";
        return true;
      } else if (this.assetGroupEmployee == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกประเภทพนักงาน";
        return true;
      } else if (this.assetPayrollType == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกกลุ่มจ่ายเงินเดือน";
        return true;
      } else if (this.assetJobType == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกลักษณะงาน";
        return true;
      } else if (this.assetJobLevel == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือก Job Level";
        return true;
      } else if (this.assetEmploymentType == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกประเภทการจ้างงาน";
        return true;
      } else if (this.assetGroupWork == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาเลือกกลุ่มพนักงาน";
        return true;
      } else if (this.assetAccountNumber == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณากรอกเลขที่บัญชี";
        return true;
      } else if (this.assetSalary == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณากรอกเงินเดือน";
        return true;
      }
      return false;
    },
    approveAssetForm() {
      if (this.validateForm(this.groupPeoplePlus)) return; // เพิ่มวันที่ 21.11.2024

      const job = this.AllPosition.filter(
        (type) => type.position_Code == this.assetFormPosition.position_Code
      );
      if (job.length > 0) {
        this.jobName = job[0].position_TH; // เพิ่มวันที่ 02.01.2025
      } else {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ยังไม่ได้เลือกตำแหน่งงาน";
        return;
      }

      const location = this.LocationList.filter(
        (type) => type.location_Code == this.assetLocation
      );
      if (location.length > 0) {
        this.locationName = location[0].location_EN;
      } else {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ยังไม่ได้เลือกสถานที่ทำงาน";
        return;
      }
      if (this.assetDepreciation == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาระบุค่าสึกหรอ";
        return;
      }
      if (this.assetPayslip == "") {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "กรุณาระบุ payslip";
        return;
      }

      this.loginDialog = true;
    },
    async confirmApproveAssetForm(sta) {
      this.loadingDialog = true;
      try {
        const peoplePlusLogin = {
          username: this.peoplePlusUsername,
          password: this.peoplePlusPassword,
          client_id: 4,
          client_secret: "aPz128qWFn02SRuvlQYPykCuZnQc9wkjn19oAPdI",
          grant_type: "password",
          scope: "*",
        };
        const loginResponse = await axios.post(
          "https://api.ipo.peopleplushcm.com/v1/oauth/token",
          peoplePlusLogin
        );
        this.ppToken = loginResponse.data.access_token;

        const responseCheckIdNumber = await axios.get(
          `https://api.ipo.peopleplushcm.com/api/hrpmc2e/msgWarning?numoffid=${this.groupPeoplePlus.employee_IDNumber}&codnatnl=&dteempdb=&numbank=&numbank2=&codempid=`,
          {
            headers: {
              Authorization: `Bearer ${this.ppToken}`,
            },
          }
        );
        if (responseCheckIdNumber.data.errorno != "") {
          this.loadingDialog = false;
          return Swal.fire({
            title: `แจ้งเตือน`,
            text: `${responseCheckIdNumber.data.msg_warning}`,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }

        const responseCheckBank = await axios.get(
          `https://api.ipo.peopleplushcm.com/api/hrpmc2e/msgWarning?numoffid=&codnatnl=&dteempdb=&numbank=${this.assetAccountNumber.replace(
            /-/g,
            ""
          )}&numbank2=&codempid=`,
          {
            headers: {
              Authorization: `Bearer ${this.ppToken}`,
            },
          }
        );
        if (responseCheckBank.data.errorno != "") {
          this.loadingDialog = false;
          return Swal.fire({
            title: `แจ้งเตือน`,
            text: `${responseCheckBank.data.msg_warning}`,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            allowOutsideClick: false,
          });
        }

        if (this.empIDPeoplePlus == "") {
          let emailPeople = "";
          const office365Email = this.systemAssetDetail.filter(
            (chk) => chk.list_Description == "Office365 (Email)"
          );
          if (office365Email.length > 0) {
            emailPeople = office365Email[0].item_Detail1;
          }
          // แปลงวันที่จาก String เป็น Date object
          const [day, month, year] = this.customOnboardDate.split("/").map(Number);
          const date = new Date(year, month - 1, day);

          // เพิ่มวันที่ 118 วัน
          date.setDate(date.getDate() + 118);

          // แปลงวันที่กลับไปเป็นรูปแบบ String
          const dateDteduepr = date.toLocaleDateString("en-GB");

          const dataNewEmp = {
            p_codempid_query: "",
            flgwarning: "S",
            param_json: {
              personal: {
                codempid: "",
                image: "",
                path_image: "",
                signature: "",
                path_sign: "",
                codtitle: this.groupPeoplePlus.employee_Title,
                namfirst: this.groupPeoplePlus.employee_Name,
                namfirste: this.groupPeoplePlus.employee_NameEN,
                namfirstt: this.groupPeoplePlus.employee_Name,
                namfirst3: "",
                namfirst4: "",
                namfirst5: "",
                namlast: this.groupPeoplePlus.employee_Surname,
                namlaste: this.groupPeoplePlus.employee_SurnameEN,
                namlastt: this.groupPeoplePlus.employee_Surname,
                namlast3: "",
                namlast4: "",
                namlast5: "",
                nicknam: this.groupPeoplePlus.employee_NickName,
                nickname: this.groupPeoplePlus.employee_NickName,
                nicknamt: this.groupPeoplePlus.employee_NickName,
                nicknam3: "",
                nicknam4: "",
                nicknam5: "",
                numtelec: this.groupPeoplePlus.mobilePhone,
                nummobile: "",
                lineid: "",
                numoffid: this.groupPeoplePlus.employee_IDNumber,
                dteoffid: "",
                adrissue: "",
                codprovi: "",
                codclnsc: "",
                numpasid: "",
                dtepasid: "",
                numvisa: "",
                dtevisaexp: "",
                numlicid: "",
                dtelicid: "",
                dteempdb: this.groupPeoplePlus.employee_Birthday,
                coddomcl: "",
                age_year: "",
                age_month: "",
                codsex: this.groupPeoplePlus.employee_Sex,
                weight: this.groupPeoplePlus.employee_Weight,
                high: this.groupPeoplePlus.employee_High,
                codblood: this.groupPeoplePlus.employee_BloodGroup,
                codorgin: this.groupPeoplePlus.employee_Ethnicity,
                codnatnl: this.groupPeoplePlus.employee_Nationality,
                codrelgn: this.groupPeoplePlus.employee_Religion,
                stamarry: this.groupPeoplePlus.employee_PersonalStatus,
                stamilit: this.groupPeoplePlus.employee_Stamilit,
                numprmid: "",
                dteprmst: "",
                dteprmen: "",
                numappl: "",
                dteretire: "",
                ageretrm: "",
                ageretrf: "",
                flg: "add",
              },
              address: {
                codempid: "",
                adrreg: this.groupPeoplePlus.employee_Address,
                adrrege: this.groupPeoplePlus.employee_Address,
                adrregt: this.groupPeoplePlus.employee_Address,
                adrreg3: "",
                adrreg4: "",
                adrreg5: "",
                codprovr: this.groupPeoplePlus.employee_Province,
                coddistr: this.groupPeoplePlus.employee_District,
                codsubdistr: this.groupPeoplePlus.employee_SubDistrict,
                codcntyr: this.groupPeoplePlus.employee_Country,
                codpostr: this.groupPeoplePlus.employee_ZipCode,
                adrcont: this.groupPeoplePlus.employee_Address,
                adrconte: this.groupPeoplePlus.employee_Address,
                adrcontt: this.groupPeoplePlus.employee_Address,
                adrcont3: "",
                adrcont4: "",
                adrcont5: "",
                codprovc: this.groupPeoplePlus.employee_Province,
                coddistc: this.groupPeoplePlus.employee_District,
                codsubdistc: this.groupPeoplePlus.employee_SubDistrict,
                codcntyc: this.groupPeoplePlus.employee_Country,
                codpostc: this.groupPeoplePlus.employee_ZipCode,
              },
              work: {
                codempid: "",
                dteempmt: this.customOnboardDate,
                svyryre: 0,
                svyrmth: 0,
                staemp: "0",
                dteeffex: "",
                codcomp: this.companyCode,
                desc_codcomp: "",
                codpos: this.assetFormPosition.position_Code,
                namabb: "",
                dteefpos: this.customOnboardDate,
                numlvl: this.assetJobLevel,
                dteeflvl: this.customOnboardDate,
                codbrlc: this.assetLocation,
                codempmt: this.assetEmploymentType,
                typpayroll: this.assetPayrollType,
                typemp: this.assetGroupEmployee,
                codcalen: this.assetGroupWork,
                flgatten: "Y",
                codjob: this.assetJobType.jobType_Code,
                jobgrade: this.assetJobGrade,
                dteefstep: this.customOnboardDate,
                codgrpgl: this.assetGLAccount,
                codempidh: "",
                codcomph: "",
                codposh: "",
                stapost: "",
                desc_stapost: "",
                stadisb: "N",
                numdisab: "",
                dtedisb: "",
                dtedisen: "",
                typdisp: "",
                desdisp: "",
                qtyduepr: "119",
                dteduepr: dateDteduepr,
                yredatrq: "",
                mthdatrq: "",
                dteoccup: "",
                numtelof: "",
                email:
                  this.requireEmail == "Y" ? emailPeople : this.groupPeoplePlus.email,
                numreqst: "",
                param_numreqst: "",
                param_codpos: "",
                ocodempid: "",
                dtereemp: "",
                qtyredue: "",
                dteredue: "",
                qtywkday: "",
                lock_edit: "",
                lock_staemp: "",
                dteupd: "",
                coduser: "",
                last_empimg: "",
                default_qtyduepr: "119",
                flgpdpa: "Y",
                dtepdpa: this.customOnboardDate,
                numlvlmin: 0,
                numlvlmax: 99,
              },
              travel: {
                codempid: "",
                typtrav: "",
                carlicen: "",
                typfuel: "",
                qtylength: "",
                codbusno: "",
                codbusrt: "",
              },
              income: {
                detail: {
                  codempid: "",
                  codcurr: "BAHT",
                  afpro: "",
                  amtothr: "",
                  amtday: "",
                  sumincom: this.assetSalary,
                  lock_edit: "N",
                  dteupd: "",
                  coduser: "",
                  last_empimg: "",
                  disp_sal: "Y",
                },
                table: {
                  rows: [
                    {
                      codincom: "01",
                      desincom: "เงินเดือน/ค่าแรง",
                      desunit: "ต่อเดือน",
                      amtmax: 1500000,
                      amtincom: this.assetSalary,
                      rowID: 1,
                      flgEdit: true,
                      amtincomOld: "",
                    },
                    {
                      codincom: "03",
                      desincom: "ค่าสึกหรอ",
                      desunit: "ต่อเดือน",
                      amtmax: "",
                      amtincom: this.assetDepreciation,
                      rowID: 2,
                      flgEdit: false,
                      amtincomOld: this.assetDepreciation,
                    },
                    {
                      codincom: "05",
                      desincom: "ค่าตำแหน่ง",
                      desunit: "ต่อเดือน",
                      amtmax: "",
                      amtincom: "",
                      rowID: 3,
                      flgEdit: false,
                      amtincomOld: "",
                    } /*,
                    {
                      codincom: "93",
                      desincom: "รายได้ประจำอื่นๆ",
                      desunit: "ต่อเดือน",
                      amtmax: "",
                      amtincom: "",
                      rowID: 4,
                      flgEdit: false,
                      amtincomOld: "",
                    },*/,
                  ],
                },
              },
              tax: {
                tax_detail: {
                  codempid: "",
                  numtaxid: this.groupPeoplePlus.employee_IDNumber,
                  numsaid: this.groupPeoplePlus.employee_IDNumber,
                  frsmemb: "",
                  flgtax: "1",
                  typtax: "1",
                  typincom: "1",
                  dteyrrelf: "",
                  dteyrrelt: "",
                  amtrelas: "",
                  amttaxrel: "",
                  codbank: this.assetBankAccount,
                  numbank: this.assetAccountNumber.replace(/-/g, ""),
                  numbrnch: "",
                  amtbank: "100",
                  amttranb: "",
                  codbank2: "",
                  numbank2: "",
                  numbrnch2: "",
                  qtychldb: "",
                  qtychlda: "",
                  qtychldd: "",
                  coddedchil: "D004",
                  amtchldb: "30000.00",
                  amtchlda: "60000.00",
                  amtchldd: "30000.00",
                  coddeduct2: "D014",
                  amtchldi: "60000",
                  qtychldi: "",
                  flgslip: this.assetPayslip,
                },
                over_income: {
                  codempid: "",
                  dtebf: "",
                  amtincbf: "",
                  amttaxbf: "",
                  amtpf: "123",
                  amtsaid: "750",
                },
                tax_exemption: {
                  rows: [],
                },
                tax_allowance: {
                  rows: [],
                },
                others_deduct: {
                  rows: [],
                },
              },
              spouse: {
                sp_over_income: {
                  codempid: "",
                  numtaxid: "",
                  dtebfsp: "",
                  amtincsp: "",
                  amttaxsp: "",
                  amtsasp: "",
                  amtpfsp: "",
                },
                sp_tax_exemption: {
                  rows: [],
                },
                sp_tax_deduct: {
                  rows: [],
                },
                sp_others_deduct: {
                  rows: [],
                },
              },
              hisname: {
                rows: [],
              },
              document: {
                rows: [],
              },
            },
          };
          const response = await axios.post(
            "https://api.ipo.peopleplushcm.com/api/hrpmc2e/savePersonalTax",
            dataNewEmp,
            {
              headers: {
                Authorization: `Bearer ${this.ppToken}`,
              },
            }
          );

          console.log("API Response:", response.data);
          if (response.data.codempid == "") {
            this.loadingDialog = false;
            return Swal.fire({
              title: "ไม่สำเร็จ!",
              html: "ไม่สามารถส่งข้อมูลได้เนื่องจาก : " + response.data.response, // แสดงข้อความจาก response
              icon: "error",
              confirmButtonText: "ตกลง",
              allowOutsideClick: false,
            });
          }
          this.empIDPeoplePlus = response.data.codempid;
        }

        const updateNewEmp = {
          p_codempid_query: this.empIDPeoplePlus,
          param_json: {
            education: {
              total: 1,
              rows: [
                {
                  numseq: 1,
                  codedlv: this.groupPeoplePlus.employee_Educational,
                  desc_codedlv: this.educationName,
                  flgeduc: "1",
                  coddglv: this.groupPeoplePlus.employee_EducationalQualification, // เพิ่มวันที่ 03.01.2025
                  desc_coddglv: "",
                  codmajsb: this.groupPeoplePlus.employee_LanguageCourse, // เพิ่มวันที่ 03.01.2025
                  desc_codmajsb: "",
                  codminsb: "",
                  desc_codminsb: "",
                  codinst: this.groupPeoplePlus.employee_Academy,
                  desc_codinst: this.academyName,
                  codcount: "",
                  desc_codcount: "",
                  numgpa: "",
                  stayear: "",
                  dtegyear: "",
                  rowID: 1,
                  flgEdit: true,
                  flgAdd: true,
                  flgDelete: false,
                  flgDeleteHide: false,
                  flgrow: "",
                },
              ],
            },
            work_exp: {
              rows: [],
            },
            training: {
              rows: [],
            },
            internal_training: {
              rows: [],
            },
          },
        };
        const responseUpdateEmp = await axios.post(
          `https://api.ipo.peopleplushcm.com/api/hrpmc2e2/saveEduWork/${this.empIDPeoplePlus}`,
          updateNewEmp,
          {
            headers: {
              Authorization: `Bearer ${this.ppToken}`,
            },
          }
        );
        console.log("API Response:", responseUpdateEmp.data);

        const dataID = {
          EmployeeAsset_ID:
            this.selectAssetID !== ""
              ? this.selectAssetID
              : localStorage.getItem("selectAsset"),
          EmployeeID: this.empIDPeoplePlus,
        };
        const responseUpdateID = await apiService.updateEmployeeID(dataID);
        await this.confirmAddAssetEmployee(true);

        const data = {
          EmployeeAsset_ID:
            this.selectAssetID !== ""
              ? this.selectAssetID
              : localStorage.getItem("selectAsset"),
          approveBy: this.infoLogin.ADempId
            ? this.infoLogin.ADempId
            : localStorage.getItem("currentEmpID"),
          Status: sta,
        };
        const responseUpdate = await apiService.updateAssetFormStatus(data);
        console.log("Update Status Response:", responseUpdate.data);

        this.loadingDialog = false;
        this.loginDialog = false;

        Swal.fire({
          title: "สำเร็จ!",
          text: "บันทึกข้อมูลสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAssetID();
            this.getAssetForm();
            this.getAssetFormDetail();
          }
        });
      } catch (error) {
        console.error("Error:", error);
        this.loadingDialog = false;
        Swal.fire({
          title: "ไม่สำเร็จ!",
          html: "ไม่สามารถส่งข้อมูลได้เนื่องจาก : " + error.response.data.message, // แสดงข้อความจาก response
          icon: "error",
          confirmButtonText: "ตกลง",
          allowOutsideClick: false,
        });
      }
    },
    async createADs() {
      let checkPhone = false;
      let checkCardSet = false;
      const userAD = this.systemAssetDetail.filter(
        (chk) => chk.list_Description == "User AD"
      );
      if (userAD.length > 0) {
        this.usernameADs = userAD[0].item_Detail1;
        this.passwordADs = userAD[0].item_Detail2;
        this.descriptionADs = userAD[0].item_Remark;
      } else {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ยังไม่ได้เพิ่มข้อมูล User ADs";
        return;
      }

      const office365Email = this.systemAssetDetail.filter(
        (chk) => chk.list_Description == "Office365 (Email)"
      );
      if (office365Email.length > 0) {
        this.emailADs = office365Email[0].item_Detail1;
      } else {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ยังไม่ได้เพิ่มข้อมูลอีเมลบริษัท";
        return;
      }

      const phone = this.adminAssetDetail.filter(
        (chk) => chk.list_Description == "Phone"
      );
      if (phone.length > 0) {
        this.phoneADs = phone[0].item_Detail2;
      } else {
        checkPhone = true;
      }

      const employeeCard = this.hrAssetDetail.filter(
        (chk) => chk.list_Description == "Employee Card Set"
      );
      if (employeeCard.length > 0) {
        this.employeeCardIDADs = employeeCard[0].item_Detail1;
      } else {
        checkCardSet = true;
      }

      const job = this.AllPosition.filter(
        (type) => type.position_Code == this.assetFormPosition.position_Code
      );
      if (job.length > 0) {
        this.jobName = job[0].position_TH;
      } else {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ยังไม่ได้เลือกตำแหน่งงาน";
        return;
      }

      const location = this.LocationList.filter(
        (type) => type.location_Code == this.assetLocation
      );
      if (location.length > 0) {
        this.locationName = location[0].location_EN;
      } else {
        this.assetDetailSnackbar = true;
        this.snackbarMessage = "ยังไม่ได้เลือกสถานที่ทำงาน";
        return;
      }

      const dataNewADs = {
        username: this.usernameADs,
        email: this.emailADs,
        password: this.passwordADs,
        first_name: this.firstnameADs,
        last_name: this.surnameADs,
        employeeID: this.empIDPeoplePlus,
        employeeCardID: checkCardSet ? "" : this.employeeCardIDADs,
        mobilePhone: this.mobileADs,
        description: this.descriptionADs,
        telephoneNumber: checkPhone ? "" : this.phoneADs,
        jobTitle: this.jobName,
        department: this.selectDepartment,
        company: this.locationName,
      };

      try {
        await apiService.newAdsUser(dataNewADs);
        Swal.fire({
          text: "Successfully",
          icon: "success",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await apiService.updateFlagADsUser({
              employeeID: localStorage.getItem("selectAsset"),
            });
          }
        });
      } catch (error) {
        // แสดงข้อความเมื่อเกิดข้อผิดพลาด
        Swal.fire({
          html: `${error}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },

    async getAssetID() {
      const myID = {
        EmployeeID: this.decodeEmpID,
      };
      try {
        const response = await apiService.getAssetIDFromEmpID(myID);
        this.myAssetID = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.inner-card-file {
  padding: 1rem;
  border: 1px solid #c9c3c3;
  border-radius: 4px;
}

.inner-card-item {
  padding: 1rem;
  border: 1px solid #c4c4c4;
  border-radius: 3px;
}

.gonext {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prefix {
  text-align: right;
  padding-right: 4px;
  color: red;
}

.custom-icon-delete {
  background-color: #ef5350;
  border-radius: 50%;
  padding: 5px;
  margin: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.custom-icon-edit {
  background-color: #fabe20;
  border-radius: 50%;
  padding: 5px;
  margin: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.inner-card2 {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.inner-card-blue {
  background-color: #f4f4f4;
  border: 1px solid #98cbe7;
  border-radius: 2px;
}

.custom-signature {
  border: 1px solid rgb(122, 122, 122);
}

.v-expansion-panel__header {
  background-color: #f4f4f4;
}

.canvas {
  width: 100%;
  height: 200px !important;
}

.snackbar {
  font-size: 17px;
}

.btn-snackbar {
  font-weight: bold;
  font-size: 17px;
  align-items: center;
}

.custom-space {
  margin: 7.5px 0px;
}

.custom-chip {
  background-color: #f8c849;
  border-radius: 15px;
  padding: 5px 12.5px 5px 12.5px;
  display: flex;
  align-items: center;
}

.fake-icon {
  padding-left: 0px;
}

.theme--light.v-table thead th {
  background-image: -webkit-gradient(
    linear,
    right top,
    left top,
    from(rgba(51, 148, 225, 0.18)),
    to(transparent)
  );
  background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
  background-color: #007fc4 !important;
  font-size: 15px !important;
  color: #ffffff !important;
  /* background-color: #222d32;
    background-color: #007fc4;
    background-color: #000000;
    background-color: #ffffff; */
}

.theme--light.v-datatable thead th.column.sortable.active,
.theme--light.v-datatable thead th.column.sortable.active .v-icon,
.theme--light.v-datatable thead th.column.sortable:hover {
  color: #ffffff !important;
}

@media (max-width: 600px) {
  .custom-space {
    margin: 7.5px 0px;
  }
}

@media (max-width: 1904px) {
  .fake-icon {
    padding-left: 30px;
  }
}
</style>
