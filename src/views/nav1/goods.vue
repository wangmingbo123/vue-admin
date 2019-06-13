<template xmlns:v-on="">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.goodName" placeholder="商品名称"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="filters.categoryName" placeholder="商品类别名称"></el-input>
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

            <el-table-column prop="goodCategory" label="商品类别id" width="200" sortable>
            </el-table-column>

            <el-table-column prop="categoryName" label="商品类别" width="120" sortable>
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
                <el-form-item label="商品名称" prop="goodName">
                    <el-input v-model="addForm.goodName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品价格" prop="goodPrice">
                    <el-input v-model="addForm.goodPrice" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品类别">
                    <el-select v-model="addForm.goodCategory" placeholder="请选择" @change="handlerChange">
                        <el-option v-for="item in addForm.categories"
                                   :key="item.categoryId"
                                   :label="item.categoryName"
                                   :value="item.categoryId">

                        </el-option>
                    </el-select>
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
                <el-form-item label="姓名" prop="goodName">
                    <el-input v-model="editForm.goodName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品价格" prop="goodPrice">
                    <el-input v-model="editForm.goodPrice" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品类别">
                    <el-select v-model="editForm.goodCategory" placeholder="请选择">
                        <el-option v-for="item in editForm.categories"
                                   :key="item.categoryId"
                                   :value="item.categoryId">

                        </el-option>
                    </el-select>
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
                    goodName: '',
                    categoryName: ''
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
                    goodCategory: '',
                    categories: []
                },
                // 编辑界面
                editFormVisible: false,
                editLoading: false,
                editForm: {
                    goodId: 0,
                    goodName: '',
                    goodPrice: 0.0,
                    goodCategory: '',
                    categoryName: '',
                    categories: []

                }


            }
        },
        methods: {
            formatCategory(row, column){
                // 开始加载
                var listLoading = true
                console.log('categotyId ' + row.goodCategory)
                var params = {
                    categoryId: row.goodCategory
                }

                var category = null;
                var categoryName = null;
                axios.get('/api/editCategory',
                    {
                        params: params
                    })
                    .then((response) => {
                        category = response.data.category;
                        var str = JSON.stringify(category);
                        console.log('category str ' + str)
                        if (category != null) {
                            categoryName = category.categoryName;
                            console.log('categoryName is ' + categoryName)
                        }
                        // 结束加载
                        listLoading = false;

                    })
                    .catch((error) => {
                        console.log(error)
                    })


                return categoryName;


            },
            handlerChange(key, value){
                console.log('handlerChange is invoke key ' + key)
                console.log('handlerChange is invoke value ' + value)
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getGoods();
            },
            // 获得商品列表
            getGoods(){
                // 构造参数
                let params = {
                    page: this.page,
                    goodName: this.filters.goodName,
                    categoryName: this.filters.categoryName
                }
                console.log('goodName is ' + params.goodName)
                console.log('categoryName is ' + params.categoryName)

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
                var rowString = JSON.stringify(sels)
                console.log('rowString is ' + rowString)
                this.sels = sels;
            },
            handleAdd: function () {
                var params = {categoryName: null};
                var categories = [];
                axios.get('/api/getCategorys', {
                    params: params
                }).then((response) => {
                    this.addForm.categories = response.data.categories;
                    categories = response.data.categories;

                    var str = JSON.stringify(categories);
                    console.log('type ' + typeof categories)
                    console.log('good categories in' + str)



                    this.addForm = {
                        goodName: '',
                        goodPrice: 0.0,
                        goodCategory: '',
                        categories: categories
                    }

                    this.addFormVisible = true

                }).catch((error) => {
                    console.log(error)
                })

            },
            handleEdit: function (index, row) {
                // 加载类别

                var params = {categoryName: null};
                var categories = [];
                axios.get('/api/getCategorys', {
                    params: params
                }).then((response) => {
                    this.editForm.categories = response.data.categories;
                    categories = response.data.categories;

                    var str = JSON.stringify(categories);
                    console.log('type ' + typeof categories)
                    console.log('good categories in' + str)


                    // 显示编辑界面
                    this.editFormVisible = true

                    this.editForm = {
                        goodId: row.goodId,
                        goodName: row.goodName,
                        goodPrice: row.goodPrice,
                        goodCategory: row.goodCategory,
                        categoryName: row.categoryName,
                        categories: categories
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
                    let params = {goodId: row.goodId};
                    console.log('id ' + row.id)
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
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let params = Object.assign({}, this.addForm);
                            console.log('name is ' + params.name)

                            axios.get('/api/addGood',
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
                                    this.getGoods();

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
                            axios.get('/api/updateGood',
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
                                    this.getGoods();

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

            this.getGoods()
        }

    }


</script>