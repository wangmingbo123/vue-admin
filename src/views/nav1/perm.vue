<template xmlns:v-on="">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">

                <el-form-item>
                    <el-input v-model="filters.permName" placeholder="权限名称"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" v-on:click="getSysPerms">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增权限</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleUserAdd">用户分配角色</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleRoleAdd">角色分配权限</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="sysPerms" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="permName" label="权限名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="permDescription" label="权限描述" width="120" sortable>
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
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--添加权限-->
        <el-dialog title="添加权限" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" ref="addForm">

                <el-form-item label="权限名称" prop="permName">
                    <el-input v-model="addForm.permName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="权限标识" prop="perms">
                    <el-input v-model="addForm.perms" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--角色分配权限-->
        <el-dialog title="角色分配权限" v-model="addRoleFormVisible" :close-on-click-modal="false">
            <el-form :model="addRoleForm" label-width="100px" ref="addRoleForm">
                <el-form-item label="角色名字" prop="roleName">
                    <el-select v-model="rolesDada.checked" placeholder="请选择">
                        <el-option
                                v-for="item in rolesDada.sysRoles"
                                :key="item.roleId"
                                :label="item.roleName"
                                :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="权限" prop="sysPerms">
                    <el-tree
                            :data="data"
                            :props="props"
                            :load="loadNode"
                            node-key="id"
                            :default-checked-keys="checked"
                            lazy
                            ref="tree"
                            show-checkbox
                            @check-change="handleCheckChange">
                    </el-tree>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addRoleFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addRoleSubmit" :loading="addRoleLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--用户分配角色-->
        <el-dialog title="用户分配角色" v-model="addUserFormVisible" :close-on-click-modal="false">
            <el-form :model="addUserForm" label-width="100px" ref="addUserForm">
                <el-form-item label="用户名称" prop="userName">
                    <el-select v-model="usersDada.checked" placeholder="请选择">
                        <el-option
                                v-for="item in usersDada.sysUsers"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="角色名称" prop="sysRoles">
                    <el-checkbox-group
                            v-model="addUserForm.roleIds">
                        <el-checkbox v-for="role in addUserForm.sysRoles" :label="role.roleId" :key="role.roleId">
                            {{role.roleName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addUserFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addUserSubmit" :loading="addUserLoading">提交</el-button>
            </div>
        </el-dialog>


    </section>

</template>


<script>

    import axios from 'axios';
    import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";
    import util from '../../common/js/util'
    import ElRadioGroup from "../../../node_modules/element-ui/packages/radio/src/radio-group";
    import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio";
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";

    export default {
        components: {
            ElFormItem,
            ElDialog,
            ElForm,
            ElRadio,
            ElRadioGroup
        },
        data() {
            return {

                sysPerms: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                data: [],
                filters: {
                    permName: ''
                },
                props: {
                    label: 'name',
                    children: 'zones'
                },
                count: 1,
                checked: [],

                // 新增界面
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {
                    permName: '',
                    perms: ''
                },

                // 角色分配权限
                addRoleFormVisible: false,
                addRoleLoading: false,
                addRoleForm: {
                    permName: '',
                    perms: ''
                },

                rolesDada: {
                    sysRoles: [],
                    checked: ''
                },

                // 用户分配角色
                users: [],
                addUserFormVisible: false,
                addUserLoading: false,
                addUserForm: {
                    sysRoles: [],
                    roleIds: []
                },

                usersDada: {
                    sysUsers: [],
                    checked: ''
                },


                // 编辑界面
                editFormVisible: false,
                editLoading: false,
                editForm: {
                    permName: '',
                    perms: ''
                }
            };
        },
        methods: {

            handleCurrentChange(val) {
                this.page = val;
                this.getSysPerms();
            },

            // 获得商品列表
            getSysPerms(){
                // 构造参数
                let params = {
                    page: this.page
                }


                this.listLoading = true
                axios.get('/api/getSysPerms',
                    {
                        params: params
                    })
                    .then((response) => {
                        this.sysPerms = response.data.sysPerms
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

            handleUserAdd: function () {

                axios.get('/api/getUserAndRoles',
                    {})
                    .then((response) => {
                        this.usersDada.sysUsers = response.data.users
                        this.addUserForm.sysRoles = response.data.sysRoles;
                        console.log('%%%%%%%%%%%%%%%%% ' + JSON.stringify(this.usersDada.sysUsers))
                        console.log('%%%%%%%%%%%%%%%%% ' + JSON.stringify(this.addUserForm.sysRoles))

                        this.addUserFormVisible = true
                    })
                    .catch((error) => {
                        console.log(error)
                    })


            },

            handleRoleAdd: function () {

                axios.get('/api/getSysRoles',
                    {})
                    .then((response) => {
                        this.rolesDada.sysRoles = response.data.sysRoles
                        console.log('************ ' + JSON.stringify(this.rolesDada.sysRoles))
                        this.addRoleFormVisible = true
                    })
                    .catch((error) => {
                        console.log(error)
                    })


            },
            addRoleSubmit: function () {
                var roleId = this.rolesDada.checked;
                console.log('roleId ' + roleId)
                var permIds = []
                permIds = this.$refs.tree.getCheckedKeys()
                var ids;
                for (var i = 0; i < permIds.length; i++) {
                    if (ids == undefined)
                        ids = permIds[i].toString()
                    else
                        ids = ids + ',' + permIds[i].toString()
                }
                console.log('permId ' + typeof permIds[0])
                console.log('permId ' + ids)
                var params = {
                    roleId: roleId,
                    permIds: ids
                }

                axios.get('/api/addRolePerms',
                    {
                        params
                    })
                    .then((response) => {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addRoleFormVisible = false
                            this.getSysPerms()

                        })


                    })
                    .catch((error) => {
                        console.log(error)
                    })


            },
            addUserSubmit: function () {
                // 为用户添加角色
                var userId = this.usersDada.checked;
                console.log('userId ' + userId)
                var roleIds = []
                roleIds = this.addUserForm.roleIds;
                var ids;
                for (var i = 0; i < roleIds.length; i++) {
                    if (ids == undefined)
                        ids = roleIds[i].toString()
                    else
                        ids = ids + ',' + roleIds[i].toString()
                }
                console.log('permId ' + ids)
                var params = {
                    userId: userId,
                    roleIds: ids
                }

                axios.get('/api/addUserRoles',
                    {
                        params
                    })
                    .then((response) => {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addUserFormVisible = false
                            this.getSysPerms()

                        })


                    })
                    .catch((error) => {
                        console.log(error)
                    })


            },


            handleAdd: function () {
                this.addFormVisible = true

            },
            handleEdit: function (index, row) {
                this.editFormVisible = true

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

            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            handleNodeClick(data) {
                console.log(data);
            },
            loadNode(node, resolve) {
                // 第一次显示菜单就加载
                // 加载菜单权限
                var data = node.data
                console.log('node data is ' + JSON.stringify(data))
                console.log('node ' + node.id)
                console.log('node ' + node.level)
                console.log('resolve ' + resolve)

                var h = [];
                var params = {id: node.data.id}
                axios.get('/api/getMenu', {
                    params
                }).then((response) => {
                    var sysPerms = response.data.sysPerms;
                    for (var i = 0; i < sysPerms.length; i++) {
                        var index = sysPerms[i];
                        var one = {id: index.permId, name: index.permName, parentPermId: index.parentPermId}
                        h.push(one)
                    }
                    console.log('in h ' + JSON.stringify(h))
                    resolve(h);

                }).catch((error) => {
                    console.log(error)
                })
                // 由于异步原因，导致out h先执行，in 后执行
                console.log('out h ' + JSON.stringify(h))

                function wang(resolve, reject) {
                    var timeout = Math.random() * 2;
                    console.log('set timeot is ' + timeout)
                    setTimeout(function () {
                        if (timeout < 1) {
                            console.log('call resolve method')

                            resolve('ok')
                        } else {
                            console.log('call reject method')
                            reject('wrong')
                        }
                    }, timeout * 1000)

                }

                // 构造promise对象

                var one = new Promise(wang)
                one.then((resolve) => {
                    console.log('resolve type' + typeof resolve)
                    console.log('resolve ' + resolve)
                }).catch((reject) => {
                    console.log('reject type' + typeof reject)
                    console.log('reject ' + reject)
                })


            },
            addSubmit: function () {
                this.addLoading = true

//                console.log('@@@@@ '+this.$refs.tree.getCheckedKeys());
//                console.log('checked is '+JSON.stringify(this.checked))


                var params = this.addForm
                console.log('perm params is ' + JSON.stringify(params))

                axios.get('/api/addPerm', {
                    params
                }).then((response) => {
                    this.addLoading = false;
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.$refs['addForm'].resetFields();
                    this.addFormVisible = false;
                    this.getSysPerms();

                }).catch((error) => {
                    console.log(error)
                })


                this.addLoading = false
            }


        },
        mounted(){
            console.log('###############')
            this.getSysPerms();
        },
        watch: {
            addForm: function (n, o) {
                console.log('new data ' + JSON.stringify(n))
                console.log('old data ' + JSON.stringify(o))
            }
        }


    };
</script>