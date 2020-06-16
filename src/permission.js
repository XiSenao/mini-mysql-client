import NProgress from 'nprogress' 
import 'nprogress/nprogress.css' 
import router from './router/index'
import cache from './/utils/cache'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
    NProgress.start()
    if (to.name === 'code') {
        if (!!cache.get('userName')) {
            next()
        } else {
            next('/introduce')
        }
    } else {
        next()
    }
})
router.afterEach(() => {
    NProgress.done()
})