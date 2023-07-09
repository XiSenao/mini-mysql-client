<template>
	<div id="LoginBox">
		<div class="loginLogo"></div>
		<div class="loginBox">
			<div class="loginTop">
				<h4>CONNECTION</h4>
				<div>
					<a>Remote server</a>instead?
				</div>
			</div>
			<div class="loginTee">
				<label for="id" class="similer">User</label>
				<el-input
					placeholder="请输入您的ID"
					v-model="loginInfo.id"
					id="user_id"
					clearable>
				</el-input>
				<label for="user_password" class="similer">Password</label>
				<el-input 
					placeholder="请输入您的密码" 
					v-model="loginInfo.password" 
					@keyup.enter.native="subLogin"
					id="user_password"
					show-password>
				</el-input>
				<el-tooltip class="item" effect="dark" content="Public Key Required" placement="right-start">
					<el-button
						class="loginButton"
						@keyup.enter.native="subLogin"
						@click="subLogin"
						:disabled="!publicKey"
						:loading="check">
					CONNECTION</el-button>
				</el-tooltip>
			</div>  
		</div>  
	</div>
</template>
<script> 
import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import { mapMutations } from 'vuex'

export default {
	
	data() {
		return {
			check: false,
			loginStatus: "",
			loginInfo: {
				id: localStorage.getItem('login_username') || "",
				password: localStorage.getItem('login_password') || "",
			},
			path:"ws://localhost:8080/websocket",
			socket:"",
			publicKey: ""   
		}   
	},
	mounted() {
		this.init()
		localStorage.removeItem("checkIn");
		this.loginEvent();
		localStorage.removeItem("userAccount");
		localStorage.removeItem("name");
		this.loginStatus = 'false';
		localStorage.setItem('login_status', this.loginStatus);
	},
	methods: {
		...mapMutations(['authority', 'setUserName']),
		goRegir () {
			this.$router.push('/user/regir');
		},
		subLogin () {
			this.check = !this.true;
			let _this = this;
			setTimeout(function() {
				_this.check = !_this.check;
				if (_this.loginInfo.id === "") {
					_this.warm("请核实您的账号是否正确");
					return;
				}
				if (_this.loginInfo.password === "") {
					_this.warm("请输入密码");
					return;
				}
				_this.doLogin();
			}, 600);
		},
		loginEvent () {
			if (this.loginStatus === 'false') {
				this.doLogin();
			} else {
				return;
			}   
		},
		init () {
			if(typeof(WebSocket) === "undefined"){
				this.$notify.error({
					title: 'Error',
					message: 'The browse can not get connection by socket'	
				});
			}else{
				try {
					// 实例化socket
					this.socket = new WebSocket(this.path)
					// 监听socket连接
					this.socket.onopen = this.open
					// 监听socket错误信息
					this.socket.onerror = this.error
					// 监听socket消息
					this.socket.onmessage = this.getMessage
				} catch (_) {
					this.$notify.error({
						title: 'Error',
						message: 'Connection Error By WebSocket'	
					});
				}
			}
		},
		open () {
			console.log("socket连接成功")
			this.send('hello')
		},
		error () {
			console.log("连接错误")
		},
		getMessage (msg) {
			let message = msg.data;
			if (message) {
				this.publicKey = message
				this.$notify({
					title: '200',
					message: 'Connection Server Success',
					type: 'success'
				});
			}
		},
		send (data) {
			this.socket.send(data)
		},
		close () {
			console.log("socket已经关闭")
		},
		destroyed () {
        // 销毁监听
      		this.socket.onclose = this.close
		},
		doLogin () {
			let Encrypt = new JSEncrypt();
			Encrypt.setPublicKey(this.publicKey);
			console.log(this.loginInfo);
			let account = Encrypt.encrypt(this.loginInfo.id)
			let password = Encrypt.encrypt(this.loginInfo.password)
			this.check = true	
			api.login(account, password).then(res => {
				if (res.data.status === "200") {
					this.$notify({
            title: 'Success',
            message: 'Login successfully',
            type: 'success'
					});
					this.setUserName(this.loginInfo.id)
					this.authority(true)
					setTimeout(() => {
						this.$router.push({ name: 'code' })
					}, 600)
				} else {
					this.$notify.error({
            title: 'Error',
						message: 'Wrong Password'	
          });
				}
				this.check = false
			}).catch (e => {
				this.check = false
				this.$notify.error({
					title: 'Error',
					message: 'Serve Error'	
				});
			}) 
		},
		success (mes) {
			this.$message({
				message: mes,
				type: 'success'
			});
		},
		error (mes) {
			this.$message.error(mes);
		},
		warm (mes) {
			this.$message({
				message: mes,
				type: 'warming'
			});
		},
	}
}
</script>
<style scoped>
    * {
        padding: 0;
        margin: 0;
    }
    body {
        background: #f2f2f2;
    }
    #LoginBox {
        width: 392px;
        height: 370px;
        margin: 64px auto;
        position: relative;
        background-color: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    }
    #LoginBox .loginBox {
        width: 336px;
        height: 600px;
        margin: 40px auto;
    }
    #LoginBox .loginLogo {
        position: absolute;
        top: -50px;
        left: 0;
        right: 0;
        margin: 0 auto;
        display: block;
        background: url(https://static.getpostman.com/assets/pm-logo-1.svg) no-repeat center;
        background-size: 104px 110px;
        width: 104px;
        height: 110px;
    }
    #LoginBox .loginTop {
        width: 328px;
        height: 26px;
        position: relative;
        top: 64px;
        margin-bottom: 85px;
    }
    #LoginBox .loginTop h4 {
        float: left;
        font-size: 18px;
        font-weight: bold;
        color: #282828;
    }
    #LoginBox .loginTop div {
        float: right;
        font-size: 12px;
        color: #282828;
        text-align: center;
        line-height: 26px;
    }
    #LoginBox .loginTop div a {
        text-decoration: none;
        color: #ef5b25;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        margin-right: 3px;
    }
    #LoginBox .similer {
        font-weight: 600;
        display: block;
        font-size: 12px;
        color: #282828;
        margin-top: 15px;
        padding-bottom: 8px;
        float: left;
    }
    #LoginBox .loginButton {
        width: 100%;
        height: 40px;
        margin-top: 31px;
        background-color: #f26b3a !important;
        color: #dfe4ea !important;
        cursor: pointer;
    }
</style>