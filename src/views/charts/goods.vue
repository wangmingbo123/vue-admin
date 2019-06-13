<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.goodName" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getGoods">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="goods" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="goodName" label="商品名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="goodPrice" label="商品价格" width="120" sortable>
            </el-table-column>
            <el-table-column prop="goodCategory" label="商品类别" width="120" sortable>
            </el-table-column>

            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!--&lt;!&ndash;工具条&ndash;&gt;-->
        <!--<el-col :span="24" class="toolbar">-->
        <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
        <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">-->
        <!--</el-pagination>-->
        <!--</el-col>-->

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" ref="addForm">
                <el-form-item label="姓名" prop="goodName">
                    <el-input v-model="addForm.goodName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品价格" prop="goodPrice">
                    <el-input v-model="addForm.goodPrice" auto-complete="off"></el-input>
                </el-form-item>


                <el-form-item label="商品类别" prop="goodCategory">
                    <el-input v-model="addForm.goodCategory" auto-complete="off"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--编辑界面-->
        <el-dialog title="编辑" v-model='editFormVisible' :close-on-click-modal="false">
            <el-form :model='editForm' labelWidth="80px" ref="editForm">
                <el-form-item label="姓名" prop="goodName">
                    <el-input v-model="editForm.goodName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品价格" prop="goodPrice">
                    <el-input v-model="editForm.goodPrice" auto-complete="off"></el-input>
                </el-form-item>


                <el-form-item label="商品类别" prop="goodCategory">
                    <el-input v-model="editForm.goodCategory" auto-complete="off"></el-input>
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
    //    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
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
                    goodName: ''
                },
                goods: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                // 新增界面
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {
                    goodName: '',
                    goodPrice: 0.0,
                    goodCategory: ''
                },
                // 编辑界面
                editFormVisible: false,
                editLoading: false,
                editForm: {
                    goodName: '',
                    goodPrice: 0.0,
                    goodCategory: ''
                }


            }
        },
        methods: {
            // 获得商品列表
            getGoods(){
                // 构造参数
                let params = {
                    page: this.page,
                    goodName: this.filters.goodName
                }
                console.log('goodName is ' + params.goodName)

                // 开始加载
                this.listLoading = true

                // ajax请求
                // axios
                // get请求，带参数

                // get 请求参数格式
                axios.get('/api/getGoods',
                    {
                        params: params
                    })
                    .then((response) => {
                        // response 参数
                        // { } 函数体
                        console.log(response)
                        this.goods = response.data.goods
                        console.log('###')
                        console.log(this)
                        console.log('###')

                        this.listLoading = false
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                console.log('outer goods ' + this.goods)

            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleAdd: function () {
                console.log('handle add is invoke')
                this.addFormVisible = true
                this.addForm = {
                    goodName: '',
                    goodPrice: 0.0,
                    goodCategory: ''
                }


            },
            handleEdit: function (index, row) {
                // 显示编辑界面
                console.log('handle index ' + index)
                console.log('handle row ' + row.goodName)
                console.log(typeof row)
                // 解析row
                var rowString = JSON.stringify(row)
                console.log('rowString is ' + rowString)


                var js = {
                    name: 'wang',
                    sex: 'nan'
                }
                let str = JSON.stringify(js, function (key, value) {

                    // 采用递归解析
                    console.log('has parse key ' + key)
                    console.log('has parse value ' + value)
                    return value
                })

                console.log('has str ' + str)
                // es6语法

                str = JSON.stringify(js, (key, value) => {
                    // key，value 参数
                    console.log('wang key ' + key)
                    console.log('wang value ' + value)

                })


                console.log('handle str ' + str)

                //
                this.editFormVisible = true
                this.editForm = Object.assign({}, row)


            },
            handleDel: function (index, row) {

                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let params = {goodId: row.id};

                    // get 请求参数格式
                    axios.get('/api/removeGood',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false
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

            },
            addSubmit: function () {
                this.$confirm('确认提交吗', '提示', {}).then(() => {
                    // 无参数
                    // 函数体 {}

                    console.log('addForm ' + this.addForm)
                    var params = Object.assign({}, this.addForm)

                    // js 对象转化为str
                    var str = JSON.stringify(params)
                    // parse
                    // str 转化为js
                    console.log('str ' + str)

                    this.addFormVisible = false

                    this.getGoods()


                }).catch((error) => {
                    console.log(error)
                })

            },

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


                //
                this.$confirm('确认提交吗', '提示', {}).then(() => {
                    // 确认框弹出
                    this.editLoading = true

                    // 无参
                    let params = Object.assign({}, this.editForm)
                    // send axios  request
                    let str = JSON.stringify(params)
                    console.log('edit form is ' + str)

                    this.editLoading = false

                }).catch((error) => {

                })

            }


        },
        mounted(){

            this.getGoods()
        }

    }


</script>