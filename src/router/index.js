import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/useAuth';

const routes = [
  {
    path: '/',
    component: () => import('../layouts/UserLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('../views/user/Home.vue') },
      { path: 'products', name: 'Products', component: () => import('../views/user/ProductListing.vue') },
      { path: 'product/:slug', name: 'ProductDetail', component: () => import('../views/user/ProductDetail.vue') },
      { path: 'cart', name: 'Cart', component: () => import('../views/user/Cart.vue') },
      { path: 'checkout', name: 'Checkout', component: () => import('../views/user/Checkout.vue') },
      { path: 'wishlist', name: 'Wishlist', component: () => import('../views/user/Wishlist.vue') },
      { path: 'contact', name: 'Contact', component: () => import('../views/user/Contact.vue') },
      { path: 'admin-login', name: 'AdminLogin', component: () => import('../views/admin/Login.vue') },
    ]
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('../views/admin/Dashboard.vue') },
      { path: 'products', name: 'AdminProducts', component: () => import('../views/admin/Products.vue') },
      { path: 'categories', name: 'AdminCategories', component: () => import('../views/admin/Categories.vue') },
      { path: 'banners', name: 'AdminBanners', component: () => import('../views/admin/Banners.vue') },
      { path: 'leads', name: 'AdminLeads', component: () => import('../views/admin/Leads.vue') },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'AdminLogin' });
  } else {
    next();
  }
});

export default router;
