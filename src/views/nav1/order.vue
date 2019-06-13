<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.userId" placeholder="用户id"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getOrders">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间" width="120" :formatter="formatTime" sortable>
            </el-table-column>

            <el-table-column prop="updateTime" label="修改时间" width="120" :formatter="formatUpdateTime" sortable>
            </el-table-column>


            <el-table-column prop="userId" label="用户id" width="120" sortable>
            </el-table-column>

            <el-table-column prop="orderStatus" label="订单状态" width="120" :formatter="formatType" sortable>
            </el-table-column>

            <el-table-column prop="goodId" label="商品id" width="120" sortable>
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

                <el-form-item label="创建日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime"
                                    :disabled="true"></el-date-picker>
                </el-form-item>

                <el-form-item label="修改日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.updateTime"
                                    :disabled="true"></el-date-picker>
                </el-form-item>

                <el-form-item label="用户id" prop="userId">
                    <el-input v-model="addForm.userId" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="订单状态" prop="orderStatus">
                    <el-radio-group v-model="addForm.orderStatus">
                        <el-radio class="radio" :label="0">待付款</el-radio>
                        <el-radio class="radio" :label="1">待收货</el-radio>
                        <el-radio class="radio" :label="2">已完成</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="商品id" prop="goodId">
                    <el-input v-model="addForm.goodId" auto-complete="off"></el-input>
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


                <el-form-item label="创建日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"></el-date-picker>
                </el-form-item>

                <el-form-item label="修改日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.updateTime"
                                    :disabled="true"></el-date-picker>
                </el-form-item>

                <el-form-item label="用户id" prop="userId">
                    <el-input v-model="editForm.userId" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="订单状态" prop="orderStatus">
                    <el-radio-group v-model="editForm.orderStatus">
                        <el-radio class="radio" :label="0">待付款</el-radio>
                        <el-radio class="radio" :label="1">待收货</el-radio>
                        <el-radio class="radio" :label="2">已完成</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="商品id" prop="goodId">
                    <el-input v-model="editForm.goodId" auto-complete="off"></el-input>
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
                    userId: ''
                },
                orders: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                // 新增界面
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {
                    createTime: '',
                    updateTime: '',
                    userId: '',
                    orderStatus: '',
                    goodId: ''
                },
                // 编辑界面
                editFormVisible: false,
                editLoading: false,
                editForm: {
                    orderId: '',
                    createTime: '',
                    updateTime: '',
                    userId: '',
                    orderStatus: '',
                    goodId: ''
                }


            }
        },
        methods: {
            formatType: function (row, column) {
                return row.orderStatus == 2 ? '已完成' : row.orderStatus == 1 ? '待收货' : row.orderStatus == 0 ? '待付款' : '未知';

            },
            formatTime: function (row, column) {
                var str = JSON.stringify(column)
                console.log('column is str' + str)
                str = JSON.stringify(row);
                console.log('row is str ' + str)
                console.log('property is ' + column.property)
                var test = row[0];
                console.log('test 0' + test)
                test = row['goodId']
                console.log('test goodId' + test)
                /*
                 *{key:value}
                 * 可以通过key来获取
                 * */
                let createTime = (!row.createTime || row.createTime == '') ? '' : util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd');
                console.log('createTime ' + createTime)
                return createTime;
            },
            formatUpdateTime: function (row, column) {
                let updateTime = (!row.updateTime || row.updateTime == '') ? '' : util.formatDate.format(new Date(row.updateTime), 'yyyy-MM-dd');
                return updateTime;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getOrders();
            },
            // 获得商品列表
            getOrders(){
                // 构造参数
                let params = {
                    page: this.page,
                    userId: this.filters.userId
                }
                console.log('userId is ' + params.userId)

                // 开始加载
                this.listLoading = true

                axios.get('/api/getOrders',
                    {
                        params: params
                    })
                    .then((response) => {

                        this.orders = response.data.orders

                        this.listLoading = false
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                var str = JSON.stringify(this.orders);
                console.log('outer orders ' + this.orders)
                console.log('outer orders str ' + str)

            },
            selsChange: function (sels) {
                var rowString = JSON.stringify(sels)
                console.log('rowString is ' + rowString)
                this.sels = sels;
            },
            handleAdd: function () {
                this.addFormVisible = true
                this.addForm = {
                    createTime: '',
                    updateTime: '',
                    userId: '',
                    orderStatus: '',
                    goodId: ''
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
                    let params = {orderId: row.orderId};

                    axios.get('/api/removeOrder',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getOrders();

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
                            params.createTime = (!params.createTime || params.createTime == '') ? '' : util.formatDate.format(new Date(params.createTime), 'yyyy-MM-dd');
                            params.updateTime = (!params.updateTime || params.updateTime == '') ? '' : util.formatDate.format(new Date(params.updateTime), 'yyyy-MM-dd');
                            axios.get('/api/addOrder',
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
                                    this.getOrders();

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

                            params.createTime = (!params.createTime || params.createTime == '') ? '' : util.formatDate.format(new Date(params.createTime), 'yyyy-MM-dd');
                            params.updateTime = (!params.updateTime || params.updateTime == '') ? '' : util.formatDate.format(new Date(params.updateTime), 'yyyy-MM-dd');

                            // get 请求参数格式
                            axios.get('/api/updateOrder',
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
                                    this.getOrders();

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

                var ids = this.sels.map(item => item.orderId).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let params = {ids: ids};
                    console.log('params ' + params.ids)

                    axios.get('/api/batchRemoveOrder',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getOrders();

                        })
                        .catch((error) => {
                            console.log(error)
                        })


                }).catch(() => {

                });
            }

        },
        mounted(){

            this.getOrders();
        }

    }


</script>