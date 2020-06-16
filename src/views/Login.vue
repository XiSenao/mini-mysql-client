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
				<label for="id" class="similer">IP</label>
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
// import api from "./../api/api"
import { JSEncrypt } from 'jsencrypt/bin/jsencrypt'
import cache from './../utils/cache' 
import { mapMutations } from 'vuex'
let Base64 = require('js-base64').Base64;
// JSEncrypt.prototype.decrypt = function (ctext) {
// 	var c = parseBigInt(ctext, 16);
// 	var m = this.doPublic(c);
// 	//var m = this.doPrivate(c);
// 	if (m == null) {
// 		return null;
// 	}
// 	return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
// };
// function 	pkcs1unpad2(d, n) {
// 	var b = d.toByteArray();
// 	var i = 0;
// 	while (i < b.length && b[i] == 0) {
// 		++i;
// 	}
// 	//注释即可
// 	// if (b.length - i != n - 1 || b[i] != 2) {
// 	//     return null;
// 	// }
// 	++i;
// 	while (b[i] != 0) {
// 		if (++i >= b.length) {
// 			return null;
// 		}
// 	}
// 	var ret = "";
// 	while (++i < b.length) {
// 		var c = b[i] & 255;
// 		if (c < 128) { // utf-8 decode
// 			ret += String.fromCharCode(c);
// 		} else if ((c > 191) && (c < 224)) {
// 			ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
// 			++i;
// 		} else {
// 			ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
// 			i += 2;
// 		}
// 	}
// 	return ret;
// }
// JSEncrypt.prototype.encryptp = function () {
// 	var m = pkcs1pad3(text, this.n.bitLength() / 4);
// 	if (!m) {
// 		return null
// 	}
// 	var c = this.doPrivate(m);
// 	if (!c) {
// 		return null
// 	}
// 	var h = c.toString(16);
// 	if ((h.length & 1) == 0) {
// 		return h
// 	} else {
// 		return '0' + h;
// 	}
// }
// function pkcs1pad3 (s, n) {
// 	if (n < s.length + 22) {
// 		return null
// 	}
// 	s = asciitohex(s);
// 	var len = n - s.length - 6;
// 	var filler = "";
// 	for (let f = 0; f < len; f += 2) {
// 		filler += "ff"
// 	}
// 	var m = "0001" + filler + "00" + s;
// 	return parseBigInt(m, 16)
// }
export default {
	
	data() {
		return {
			check: false,
			loginStatus: "",
			loginInfo: {
				id: localStorage.getItem('login_username') || "",
				password: localStorage.getItem('login_password') || "",
			},
			path:"ws://121.36.56.221:8080/websocket",
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
		getInfo () {
			const url = "/api/author/getInfo";
			// const settings = qcxUtils.getSettings(url, "");
			// this.$axios(settings).then(res => {
			// 	try {
			// 		let go = res.data.status;
			// 		if (go === "200") {
			// 			go = res.data.data.Author;
			// 			localStorage.setItem('userAccount', go.authorAccount);
			// 			localStorage.setItem('name', go.authorNickname);
			// 			this.success("用户登录成功");
			// 			this.$router.push('/public/main');
			// 		} else {
			// 			this.warm("服务器维护中...");
			// 		}
			// 	} catch (e) {
			// 		this.error("服务器出现问题 无法登录");
			// 	}
			// })
		},
		init () {
			if(typeof(WebSocket) === "undefined"){
				alert("您的浏览器不支持socket")
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
			// let key ="MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALueZ50bOutYYGlA7q+rmafpyk3feL1D1prVcNvnFfLCGzfdMxRQCAPc9G9ZctOV9jNq4A8ncZ57tF+REuQr9h8CAwEAAQ==$JhuAk$ceWi8egx2gJv79iBJcK5geY7F1/7LRyejLilRR1dJrgbBzaiGYm4u1Ovei6DHBpORq13/X48nBu/Wm8iUH12CQ=="
			// 			,Encrypt = new JSEncrypt();
			// 	let pkey = 'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAu55nnRs661hgaUDur6uZp+nKTd94vUPWmtVw2+cV8sIbN90zFFAIA9z0b1ly05X2M2rgDydxnnu0X5ES5Cv2HwIDAQABAkBgepujkY4h2cdyOJ7FHUQdsb6DfwhSo2DnLB0mJ9YEh+UVIy4E4hUy33ldjde/pJ/BQXjubyX2VWe94F1fKqwhAiEA3l1zLT2sOlBhKw+c9bBDohT7iKqG9VLxzpiYf25A5c8CIQDX/31BVs9cDfMHuTXjozlLyWilzztHNYWkozb+AjhOsQIhANwaF/WCBEY8ZdHfxHeUn32B03B1ityt21epx9jq4yYVAiBxL1pNcNX8IPsnIvCQNqoBgqspp+wiJnO/kB9y/2rOIQIgcevqRLOeebjVqviORa/hjwwI0obtEPxVOWZ5c6oYwL8='
			// 	Encrypt.setPrivateKey(pkey);
			// let se = Encrypt.encrypt('dasdsa')
			// console.log(se)
			// Encrypt.setPublicKey(key);
			// console.log(Encrypt.decrypt(se))
			// console.log(msg.data)
			let message = msg.data
			// console.log(msg)
			let arr = message.split('$')
			// console.log(arr)
			var decrypt = new JSEncrypt();
			// console.log(Base64.decode(arr[0]))
			// decrypt.setPublicKey(arr[0])
			if (arr[0]) {
				this.publicKey = arr[0]
				this.$notify({
					title: '200',
					message: 'Connection Server Success',
					type: 'success'
				});
			}
			// var uncrypted = decrypt.decrypt(arr[2]);
			// console.log(uncrypted)
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