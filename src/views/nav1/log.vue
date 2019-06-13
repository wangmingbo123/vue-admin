<template xmlns:v-on="">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.userName" placeholder="操作者名字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getSysLogs">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="sysLogs" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="username" label="操作者姓名" width="120" sortable>
            </el-table-column>
            <el-table-column prop="operation" label="操作类别" width="100"  sortable>
            </el-table-column>
            <el-table-column prop="method" label="请求方法" width="100" sortable>
            </el-table-column>
            <el-table-column prop="params" label="请求参数" width="100" sortable>
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间" width="120" :formatter="formatDate" sortable>
            </el-table-column>

            <el-table-column label="操作" width="150">
                <template scope="scope">
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


    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';
    import ElRadioGroup from "../../../node_modules/element-ui/packages/radio/src/radio-group";
    import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio";
    import axios from 'axios';

    export default {
        components: {
            ElRadio,
            ElRadioGroup
        },
        data() {
            return {
                filters: {
                    userName: null
                },
                sysLogs: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
            }
        },
        methods: {


            formatDate: function (row, column) {
                let createDate = (!row.createDate || row.createDate == '') ? '' : util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd');
                return createDate;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getSysLogs();
            },
            //获取日志列表
            getSysLogs() {
                let params = {
                    page: this.page,
                    userName: this.filters.userName
                };
                this.listLoading = true;

                // get 请求参数格式
                axios.get('/api/getSysLogs',
                    {
                        params: params
                    })
                    .then((response) => {

                        this.total = 5;
                        this.sysLogs = response.data.sysLogs;

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
                    let params = {id: row.id};

                    axios.get('/api/removeSysLog',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getSysLogs();

                        })
                        .catch((error) => {
                            console.log(error)
                        })


                }).catch(() => {

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

                    axios.get('/api/batchRemoveSysLog',
                        {
                            params: params
                        })
                        .then((response) => {
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getSysLogs();

                        })
                        .catch((error) => {
                            console.log(error)
                        })


                }).catch(() => {

                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            }

        },
        mounted() {
            this.getSysLogs();
        }
    }

</script>

<style scoped>

</style>