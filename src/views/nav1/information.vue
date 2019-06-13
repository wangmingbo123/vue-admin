<template xmlns:v-on="">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.content" placeholder="资讯内容"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getInformations">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="informations" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="content" label="资讯内容" width="200" sortable>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="200" :formatter="formatStatus" sortable>
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

                <el-form-item label="资讯内容" prop="content">
                    <el-input v-model="addForm.content" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态">
                    <el-radio-group v-model="addForm.status">
                        <el-radio class="radio" :label="1">已审核</el-radio>
                        <el-radio class="radio" :label="0">未审核</el-radio>
                    </el-radio-group>
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
                <el-form-item label="资讯内容" prop="content">
                    <el-input v-model="editForm.content" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio class="radio" :label="1">已审核</el-radio>
                        <el-radio class="radio" :label="0">未审核</el-radio>
                    </el-radio-group>
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

    import {mapActions, mapGetters} from 'vuex'

    import util from '../../common/js/util'
    import ElRadioGroup from "../../../node_modules/element-ui/packages/radio/src/radio-group";
    import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio";
    import axios from 'axios';
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
    import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";


    export default {

        components: {
            ElDialog,
            ElForm,
            ElRadio,
            ElRadioGroup
        },
        //
        data(){
            return {

                filters: {
                    content: ''
                },
                informations: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                // 新增界面
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {
                    content: '',
                    status: ''
                },
                // 编辑界面
                editFormVisible: false,
                editLoading: false,
                editForm: {
                    id: 0,
                    content: '',
                    status: ''
                }


            }
        },
        methods: {
            formatStatus: function (row, column) {
                return row.status == 1 ? '已审核' : row.status == 0 ? '未审核' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getInformations();
            },
            // 获得商品列表
            getInformations(){
                // 构造参数
                let params = {
                    page: this.page,
                    content: this.filters.content
                }
                console.log('content is ' + params.content)

                // 开始加载
                this.listLoading = true

                axios.get('/api/getInformations',
                    {
                        params: params
                    })
                    .then((response) => {

                        this.informations = response.data.informations

                        this.listLoading = false
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                var str = JSON.stringify(this.informations);
                console.log('outer informations ' + this.informations)
                console.log('outer informations str ' + str)

            },
            selsChange: function (sels) {
                var rowString = JSON.stringify(sels)
                console.log('rowString is ' + rowString)
                this.sels = sels;
            },
            handleAdd: function () {
                this.addFormVisible = true
                this.addForm = {
                    content: '',
                    status: ''
                }


            },
            handleEdit: function (index, row) {
                // 显示编辑界面
                this.editFormVisible = true
                this.editForm = Object.assign({}, row)
            },
            handleDel: function (index, row) {

                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let params = {id: row.id};

                    axios.get('/api/removeInformation',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getInformations();

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
                            let params = Object.assign({}, this.addForm);
                            axios.get('/api/addInformation',
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
                                    this.getInformations();

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

                            // get 请求参数格式
                            axios.get('/api/updateInformation',
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
                                    this.getInformations();

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

                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let params = {ids: ids};
                    console.log('params ' + params.ids)

                    axios.get('/api/batchRemoveInformation',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getInformations();

                        })
                        .catch((error) => {
                            console.log(error)
                        })


                }).catch(() => {

                });
            },
            ...mapActions('home', [
                'getHomeInfo'
            ])
        },
        mounted(){

            this.getInformations();
        }

    }


</script>