<template xmlns:v-on="">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120" sortable>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="100" sortable>
            </el-table-column>
            <el-table-column prop="type" label="用户类别" width="120" :formatter="formatType" sortable>
            </el-table-column>
            <el-table-column prop="birth" label="生日" width="120" :formatter="formatBirth" sortable>
            </el-table-column>
            <el-table-column prop="addr" label="地址" min-width="180" sortable>
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

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="用户类别">
                    <el-radio-group v-model="editForm.type">
                        <el-radio class="radio" :label="2">顾客</el-radio>
                        <el-radio class="radio" :label="1">系统管理员</el-radio>
                        <el-radio class="radio" :label="0">普通管理员</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="用户类别">
                    <el-radio-group v-model="editForm.type">
                        <el-radio class="radio" :label="2">顾客</el-radio>
                        <el-radio class="radio" :label="1">系统管理员</el-radio>
                        <el-radio class="radio" :label="0">普通管理员</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="addForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';
    import ElRadioGroup from "../../../node_modules/element-ui/packages/radio/src/radio-group";
    import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio";
    import axios from 'axios';
    import {mapActions, mapGetters} from 'vuex'

    export default {
        components: {
            ElRadio,
            ElRadioGroup
        },
        data() {
            return {
                filters: {
                    name: null
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    age: 0,
                    type: 0,
                    birth: '',
                    addr: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    /*
                     * 管理员类型
                     * */
                    type: 0,
                    birth: '',
                    addr: ''
                }

            }
        },
        computed: {
            ...mapGetters('user', [
                'vusers'
            ])
        },
        methods: {
            // vuex methods
            ...mapActions('user',
            ['getUsersByVuex']
            ),

            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            formatType: function (row, column) {
                return row.type == 2 ? '顾客' : row.sex == 1 ? '普通管理员' : row.sex == 0 ? '系统管理员' : '未知';
            },
            formatBirth: function (row, column) {
                let birth = (!row.birth || row.birth == '') ? '' : util.formatDate.format(new Date(row.birth), 'yyyy-MM-dd');
                console.log('birth ' + birth)
                return birth;
            },
            handleCurrentChange(val) {
                console.log('page is '+val)
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                let params = {
                    page: this.page,
                    name: this.filters.name
                };
                console.log('filters name ' + this.filters.name)
                this.listLoading = true;
                // para 参数
//				getUserListPage(para).then((res) => {
//					// res 返回结果
//				    this.total = res.data.total;
//					this.users = res.data.users;
//					this.listLoading = false;
//					//NProgress.done();
//				});

                // get 请求参数格式
                axios.get('/api/getUsers',
                    {
                        params: params
                    })
                    .then((response) => {
                        // response 参数
                        // { } 函数体
                        this.total = 5;
                        this.users = response.data.users

                        this.listLoading = false
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let params = {userId: row.id};
//					removeUser(para).then((res) => {
//						this.listLoading = false;
//						//NProgress.done();
//						this.$message({
//							message: '删除成功',
//							type: 'success'
//						});
//						this.getUsers();
//					});


                    // get 请求参数格式
                    axios.get('/api/removeUser',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUsers()

                        })
                        .catch((error) => {
                            console.log(error)
                        })


                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
//                console.log('index is ' + index)
//                let para = {id: row.id, name: row.name}
//                console.log('para is id ' + para.id)
//                console.log('para is name ' + para.name)
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    sex: -1,
                    age: 0,
                    type: 0,
                    birth: '',
                    addr: ''
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let params = Object.assign({}, this.editForm);
                            params.birth = (!params.birth || params.birth == '') ? '' : util.formatDate.format(new Date(params.birth), 'yyyy-MM-dd');
//                            editUser(para).then((res) => {
//                                this.editLoading = false;
//                                //NProgress.done();
//                                this.$message({
//                                    message: '提交成功',
//                                    type: 'success'
//                                });
//                                this.$refs['editForm'].resetFields();
//                                this.editFormVisible = false;
//                                this.getUsers();
//                            });


                            // get 请求参数格式
                            axios.get('/api/updateUser',
                                {
                                    params: params
                                })
                                .then((response) => {
                                    this.editLoading = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getUsers();

                                })
                                .catch((error) => {
                                    console.log(error)
                                })


                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let params = Object.assign({}, this.addForm);
                            console.log('name is ' + params.name)

                            params.birth = (!params.birth || params.birth == '') ? '' : util.formatDate.format(new Date(params.birth), 'yyyy-MM-dd');
//                            addUser(para).then((res) => {
//                                this.addLoading = false;
//                                this.$message({
//                                    message: '提交成功',
//                                    type: 'success'
//                                });
//                                this.$refs['addForm'].resetFields();
//                                this.addFormVisible = false;
//                                this.getUsers();
//                            });


                            axios.get('/api/addUser',
                                {
                                    params: params
                                })
                                .then((response) => {
                                    this.addLoading = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getUsers();

                                })
                                .catch((error) => {
                                    console.log(error)
                                })


                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let params = {ids: ids};
                    console.log('params ' + params)
//                    batchRemoveUser(para).then((res) => {
//                        this.listLoading = false;
//                        this.$message({
//                            message: '删除成功',
//                            type: 'success'
//                        });
//                        this.getUsers();
//                    });


                    axios.get('/api/batchRemoveUser',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUsers();

                        })
                        .catch((error) => {
                            console.log(error)
                        })


                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getUsers();
//            this.getUsersByVuex();
        }
    }

</script>

<style scoped>

</style>