<template>
    <div class="login">
        <el-card class="box-card">
            <div slot="header">
                <span>登 录</span>
            </div>
            <main>
                <el-form label-position="top" :model="loginForm" :rules="loginRules" ref="loginForm">
                    <el-form-item label="账号">
                        <el-input name="username" v-model="loginForm.username" placeholder="请输入账号">
                            <el-button slot="prepend" icon="el-icon-render-user"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input name="password" v-model="loginForm.password" type="password" placeholder="请输入密码">
                            <el-button slot="prepend" icon="el-icon-render-password"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="btnWrap">
                        <el-button type="primary" style="width:100%;" :loading="loading"
                                   @click.native.prevent="onSubmit">登 录
                        </el-button>
                        <el-button type="danger" style="width:100%;margin:15px 0 0 0" @click="onReset">重 置</el-button>
                    </el-form-item>
                </el-form>
                <div class="tips">
                    <span style="margin-right:20px;">username: admin</span>
                    <span> password: admin</span>
                </div>
            </main>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            const validateUsername = (rule, value, callback) => {
                if (value !== 'admin') {
                    callback(new Error('请输入正确的用户名'))
                } else {
                    callback()
                }
            }
            const validatePass = (rule, value, callback) => {
                if (value.length < 5) {
                    callback(new Error('密码不能小于5位'))
                } else {
                    callback()
                }
            }
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    password: [{required: true, trigger: 'blur', validator: validatePass}]
                },
                loading: false,
            }
        },
        methods: {
            onSubmit() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        this.$store.dispatch('Login', this.loginForm).then(() => {
                            this.loading = false
                            this.$router.push({path: '/'})
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            onReset() {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .login {
        position: absolute;
        height: 100%;
        width: 100%;
        background: #ddd;

    .box-card {
        position: absolute;
        top: 20%;
        right: 10%;
        width: 400px;

    .btnWrap {
        margin-top: 60px;
        text-align: center;
    }

    .tips {
        text-align: center;
        font-size: 14px;
        margin: 10px;
    }

    }

    }
</style>