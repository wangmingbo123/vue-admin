<template xmlns:v-on="">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.categoryName" placeholder="商品类别名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getCategorys">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="categories" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="categoryId" label="商品类别id" width="200" sortable>
            </el-table-column>
            <el-table-column prop="categoryName" label="商品类别名称" width="200" sortable>
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

                <el-form-item label="商品类别名称" prop="categoryName">
                    <el-input v-model="addForm.categoryName" auto-complete="off"></el-input>
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
                <el-form-item label="商品类别名称" prop="categoryName">
                    <el-input v-model="editForm.categoryName" auto-complete="off"></el-input>
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
                    categoryName: ''
                },
                categories: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                // 新增界面
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {
                    categoryName: ''
                },
                // 编辑界面
                editFormVisible: false,
                editLoading: false,
                editForm: {
                    categoryId: 0,
                    categoryName: ''
                }


            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getCategorys();
            },
            // 获得商品列表
            getCategorys(){
                // 构造参数
                let params = {
                    page: this.page,
                    categoryName: this.filters.categoryName
                }
                console.log('categoryName is ' + params.categoryName)

                // 开始加载
                this.listLoading = true

                axios.get('/api/getCategorys',
                    {
                        params: params
                    })
                    .then((response) => {

                        this.categories = response.data.categories

                        this.listLoading = false
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                var str = JSON.stringify(this.categories);
                console.log('outer categories ' + this.categories)
                console.log('outer categories str ' + str)

            },
            selsChange: function (sels) {
                var rowString = JSON.stringify(sels)
                console.log('rowString is ' + rowString)
                this.sels = sels;
            },
            handleAdd: function () {
                this.addFormVisible = true
                this.addForm = {
                    categoryName: ''
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
                    let params = {categoryId: row.categoryId};

                    axios.get('/api/removeCategory',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCategorys();

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
                            axios.get('/api/addCategory',
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
                                    this.getCategorys();

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
                            axios.get('/api/updateCategory',
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
                                    this.getCategorys();

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

                var ids = this.sels.map(item => item.categoryId).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let params = {ids: ids};
                    console.log('params ' + params.ids)

                    axios.get('/api/batchRemoveCategory',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCategorys();

                        })
                        .catch((error) => {
                            console.log(error)
                        })


                }).catch(() => {

                });
            }

        },
        mounted(){

            this.getCategorys();
        }

    }


</script>