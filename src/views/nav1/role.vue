<template xmlns:v-on="">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.roleName" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getSysRoles">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="sysRoles" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="remark" label="描述" width="120" sortable>
            </el-table-column>

            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" ref="addForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="remark">
                    <el-input v-model="addForm.remark" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="权限名称" prop="sysPerms">
                    <el-checkbox-group
                            v-model="addForm.permIds">
                        <el-checkbox v-for="perm in addForm.sysPerms" :label="perm.permId" :key="perm.permId">
                            {{perm.permName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--编辑界面-->
        <el-dialog title="编辑" v-model='editFormVisible' :close-on-click-modal="false">
            <el-form :model='editForm' labelWidth="100px" ref="editForm">
                <el-form-item label="角色编号" prop="roleId">
                    <el-input v-model="editForm.roleId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="remark">
                    <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="权限名称" prop="sysPerms">
                    <el-checkbox-group
                            v-model="editForm.permIds">
                        <el-checkbox v-for="perm in editForm.sysPerms" :label="perm.permId" :key="perm.permId">
                            {{perm.permName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>


            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>

        </el-dialog>


    </section>

</template>

<script>

    import util from '../../common/js/util'
    import ElRadioGroup from "../../../node_modules/element-ui/packages/radio/src/radio-group";
    import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio";
    import axios from 'axios';
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
    import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";

    export default {

        components: {
            ElFormItem,
            ElDialog,
            ElForm,
            ElRadio,
            ElRadioGroup
        },
        //
        data(){
            return {

                filters: {
                    roleName: ''
                },
                sysRoles: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                // 新增界面
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {
                    roleName: '',
                    remark: '',
                    /*
                     * 多选框选择的permId
                     * */
                    permIds: [],
                    sysPerms: []
                },
                // 编辑界面
                editFormVisible: false,
                editLoading: false,
                editForm: {
                    roleName: '',
                    remark: '',
                    permIds: [],
                    sysPerms: []
                }
            }
        },
        methods: {
            handlerChange(key, value){
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getSysRoles();
            },
            // 获得商品列表
            getSysRoles(){
                // 构造参数
                let params = {
                    page: this.page,
                    roleName: this.filters.roleName,
                }


                this.listLoading = true
                axios.get('/api/getSysRoles',
                    {
                        params: params
                    })
                    .then((response) => {
                        this.sysRoles = response.data.sysRoles
                        this.listLoading = false
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            },
            selsChange: function (sels) {
                var rowString = JSON.stringify(sels)
                console.log('rowString is ' + rowString)
                this.sels = sels;
            },
            handleAdd: function () {

                var params = {permId: null};
                var sysPerms = [];
                axios.get('/api/getSysPerms', {
                    params: params
                }).then((response) => {
                    this.addForm.sysPerms = response.data.sysPerms;
                    sysPerms = response.data.sysPerms;

                    this.addFormVisible = true
                    this.addForm = {
                        roleName: '',
                        remark: '',
                        permIds: [],
                        sysPerms: sysPerms

                    }

                }).catch((error) => {
                    console.log(error)
                })

            },
            handleEdit: function (index, row) {
                // 加载类别

                var params = {roleId: row.roleId};
                axios.get('/api/editSysRole', {
                    params: params
                }).then((response) => {
                    this.editForm.categories = response.data.categories;
                    var sysRole = response.data.sysRole;
                    var sysPerms = response.data.sysPerms;

                    var str = JSON.stringify(sysRole);
                    console.log('sysRole ' + str)
                    str = JSON.stringify(sysPerms);
                    console.log('sysPerms ' + str)


                    // 显示编辑界面
                    this.editFormVisible = true
                    var permIds=[]
                    for (var i = 0; i < sysRole.permIds.length; i++) {
                        console.log('permId is '+sysRole.permIds[i])
                        var str=sysRole.permIds[i]

                        permIds.push(parseInt(str))
                    }
                    console.log('type is '+typeof permIds)
                    console.log('type is '+typeof permIds[0])


                    /*
                    * 必须是int类型
                    * */
                    this.editForm = {
                        roleId: sysRole.roleId,
                        roleName: sysRole.roleName,
                        remark: sysRole.remark,
                        permIds: permIds,
                        sysPerms: sysPerms
                    }


                }).catch((error) => {
                    console.log(error)
                })


            },
            handleDel: function (index, row) {

                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let params = {roleId: row.roleId};
                    axios.get('/api/removeSysRole',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getSysRoles();

                        })
                        .catch((error) => {
                            console.log(error)
                        })

                }).catch(() => {

                });

            },
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            var data = Object.assign({}, this.addForm);

//                            params.sysPerms=[];
//                            for(var i=0;i<params.permIds.length;i++){
//                                /*
//                                * {permId:1} xxx
//                                * */
//                                params.sysPerms.push({'permId':params.permIds[i]})
//                            }

//                            axios({
//                                method:'post',
//                                url:'/api/addSysRole',
//                                data:data
//                            }).then((res)=>{
//
//                            }).catch((error)=>{
//
//                            })

                            /*
                             *  post 不需要采用{data:data}方式
                             *  直接 data 方式
                             * */
                            axios.post('/api/addSysRole',
                                data
                            )
                                .then((response) => {
                                    this.addLoading = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getSysRoles()

                                })
                                .catch((error) => {
                                    console.log(error)
                                })


                        });
                    }
                });
            },

            // 编辑
            editSubmit: function () {

                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let params = Object.assign({}, this.editForm);
                            var str = JSON.stringify(params)
                            console.log('edit form ' + str)

                            // get 请求参数格式
                            axios.post('/api/updateSysRole',
                                params
                            )
                                .then((response) => {
                                    this.editLoading = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getSysRoles();

                                })
                                .catch((error) => {
                                    console.log(error)
                                })


                        });
                    }
                });

            },

            //批量删除
            batchRemove: function () {

                var ids = this.sels.map(item => item.goodId).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let params = {ids: ids};
                    console.log('params ' + params.ids)

                    axios.get('/api/batchRemoveGood',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getGoods()

                        })
                        .catch((error) => {
                            console.log(error)
                        })


                }).catch(() => {

                });
            }


        },
        mounted(){
            console.log('^^^^^^^^^^^^^^^')
            this.getSysRoles();
        }

    }


</script>