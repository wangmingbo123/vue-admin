<template>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">系统注册</h3>
        <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm2.name" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">注册
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                logining: false,
                ruleForm2: {
                    name: 'admin',
                    pass: '123456'
                },
                rules2: {
                    name: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    pass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ]
                },
                checked: true
            };
        },
        methods: {
            handleSubmit2(ev) {
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        this.logining = true;

                        var loginParams = {name: this.ruleForm2.name, pass: this.ruleForm2.pass};
                        var str = JSON.stringify(loginParams)
                        console.log('user str ' + str)

                        axios.get('/api/zhuce', {
                            params: loginParams
                        }).then((response) => {
                            this.logining = false;
                            let {msg, code, user} = response.data;
                            console.log('msg ' + msg)
                            console.log('code ' + code)
                            console.log('user ' + user)
                            if (code == 200) {
                                var str = JSON.stringify(user);
                                console.log('user str ' + str)
                                sessionStorage.setItem('user', user);
                                this.$router.push({path: '/user'});
                            } else {
                                this.$message({
                                    message: msg,
                                    type: 'error',
                                    duration: 3000
                                })
                            }
                        }).catch((error) => {

                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>