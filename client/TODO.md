# Implementation Plan for Auth + Role System and Product CRUD

## Backend Updates
- [ ] Update server/models/User.js: Change password to passwordHash, verified to isVerified, add avatarUrl
- [ ] Update server/models/Product.js: Change name to title, image to images (array), seller to sellerId, add approved field
- [ ] Update server/routes/authRoutes.js: Add GET /me and PUT /avatar endpoints
- [ ] Create/Update server/routes/adminRoutes.js: Implement PUT /verify-seller/:sellerId and GET /sellers
- [ ] Create/Update server/routes/productRoutes.js: Implement CRUD with role-based access
- [ ] Update server/middleware/authMiddleware.js: Add roleCheck helper function
- [ ] Update server/server.js: Mount new routes (admin, product)

## Frontend Updates
- [ ] Update client/src/api/auth.js: Add register, login, fetchMe, updateAvatar functions
- [ ] Update client/src/components/Navbar.jsx: Add avatar dropdown with role-based menu
- [ ] Update client/src/components/ProtectedRoute.jsx: Add allowedRoles prop and role checking
- [ ] Create/Update client/src/pages/Auth.jsx: Merge login/signup into single page
- [ ] Create client/src/pages/ProductDetails.jsx: Dynamic product page with carousel and buy/cart
- [ ] Update client/src/pages/Products.jsx: Fetch from backend, show approved products to customers
- [ ] Update client/src/pages/SellerDashboard.jsx: Add/edit/delete products with form
- [ ] Update client/src/pages/AdminDashboard.jsx: List sellers and verify them
- [ ] Update client/src/context/CartContext.jsx: Ensure localStorage persistence for "craftkart_cart"
- [ ] Update client/src/App.jsx: Add new routes, Toaster, axios interceptor for auth header

## Testing
- [ ] Test signup as seller (isVerified=false), login, cannot add product
- [ ] Test admin verify seller, seller can add product
- [ ] Test product approval by admin, visible to customers
- [ ] Test role-based redirects and navbar dropdown
- [ ] Test cart persistence and auth token storage
