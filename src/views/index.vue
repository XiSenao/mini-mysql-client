<template>
	<div id="index">
		<topNav/>
		<!-- <Introduce/> -->
		<router-view v-if="routerAlive"></router-view>  
	</div>
</template>

<script>
	import topNav from './top.vue'
	// import Login from './Login.vue'
	// import Introduce from './Introduce.vue'
	// import fullpage from './../assets/js/fullpage.min.js'
	// import './../assets/js/scrolloverflow.js'
	// import './../assets/js/owl.carousel.min.js'
	// import './../assets/js/jquery.inview.min.js'
	// import './../assets/js/form.js'

	// $("#owl-demo").owlCarousel({
  //   navigation : true
	// });
	// import './../assets/js/custom.js'
	import './../assets/js/fullpage.min.js'
	import './../assets/js/owl.carousel.min.js'
	import './../assets/js/jquery.inview.min.js'
	import './../assets/js/form.js'
	import './../assets/js/custom.js'
	export default {
		name: 'home',
		components: {
			topNav
			// Login,
			// Introduce
		},
		mounted () {
			let Flag = this.$route.params.something
			if (Flag === "exit") {
				this.$Notice.success({
					title: 'Exit successfully'
				});
			}
		},
		data () {
			return {
				isAuthority: false,
				routerAlive: true
			}
		},
		provide(){
			return {
				routerRefresh: this.routerRefresh
			}
		},
		methods: {
			routerRefresh(){
				// this.routerAlive = false;
				// this.$nextTick(()=>{
				// 	this.routerAlive = true;
					
				// });
				location.reload();
			},
		}
	}
</script>
<style>
	.ivu-notice {
		text-align: left !important;
	}
</style>
<style>
	/* @import url('./../assets/css/fullpage.min.css');
	@import url('./../assets/css/owl.carousel.css');
	@import url('./../assets/css/animate.css'); 

	@import url('./../assets/css/templatemo-style.css');
	@import url('./../assets/css/responsive.css'); */
	@import url('./../assets/css/fullpage.min.css');
	@import url('./../assets/css/owl.carousel.css');
	@import url('./../assets/css/animate.css');

	@import url('./../assets/css/templatemo-style.css');
	@import url('./../assets/css/responsive.css');
	
</style>