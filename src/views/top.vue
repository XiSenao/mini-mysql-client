<template>
	<div>
		<div class="preloader">
			<div class="preloader-bounce">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
		<header id="header">
			<div class="container-fluid">
				<div class="navbar">
					<a href="#" id="logo" title="Elegance by TemplateMo">
							MY SQL
					</a>
					<div class="navigation-row">
						<nav id="navigation">
							<button type="button" class="navbar-toggle"> <i class="fa fa-bars"></i> </button>
							<div class="nav-box navbar-collapse">
								<ul class="navigation-menu nav navbar-nav navbars" id="nav">
									<li data-menuanchor="slide01" class="active" v-if="!isAuthority"><a href="#slide01">Introduce</a></li>
									<Dropdown v-if="isAuthority">
										<li data-menuanchor="slide07" class="active"><a @click="goHome">Home</a></li>
										<Dropdown-menu slot="list">
											<!-- <Dropdown-item><a href="/index" style="color: #222">Introduce</a></Dropdown-item> -->
											<Dropdown-item><a @click="goNow" style="color: #222">Introduce</a></Dropdown-item>
											<!-- <Dropdown-item><a href="/exit?success" style="color: #222">Exit</a></Dropdown-item> -->
											<Dropdown-item><a @click="doExit" style="color: #222">Exit</a></Dropdown-item>
										</Dropdown-menu>
									</Dropdown>
								</ul>
							</div>
						</nav>
					</div>
				</div>
			</div>
		</header>
	</div>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	import cache from './../utils/cache'
	export default {
		name: 'cheader',
		inject:['routerRefresh'],
		data () {
			return {
				visible: true
			}
		},
		methods: {
			...mapMutations(['forseReload', 'authority']),
			doExit () {
				api.logout().then(res => {
					this.$Notice.success({
						title: 'Exit successfully'
					});
					this.authority(null)
					this.goNow()
				}).catch (_ => {
					this.$Notice.success({
						title: 'Server Error'
					});
				})
			},
			goHome () {
				if (this.isAuthority && !this.isCoding) {
					let routeData = this.$router.resolve({
						name: "code",
						query: {goodsId:'1111'}
					});
					window.open(routeData.href, '_blank');
					// this.$router.push('/user/code')
				} else if (!this.isCoding) {
					this.$router.push('#slide07')
				}
			},
			handleOpen () {
				this.visible = true;
			},
			handleClose () {
				this.visible = false;
			},
			goNow () {
				this.forseReload(true)
				this.$router.push({name: 'introduce'})
			}
		},
		computed: {
			...mapState(['isAuthority']),
			isCoding () {
				return false
				// return this.$route.name === 'code'
			}
		}
	}
</script>
