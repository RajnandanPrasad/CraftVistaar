# TODO: Update Navbar with Category Dropdown

## Backend Changes
- [x] Add GET /api/products/categories route in server/routes/productRoutes.js to return distinct categories from approved products.

## Client API Changes
- [x] Create client/src/api/products.js with getCategories() function to fetch categories from backend.

## Frontend Component Updates
- [x] Update client/src/components/Navbar.jsx:
  - Keep logo unchanged.
  - Replace "CraftKart" text with Category dropdown menu.
  - Fetch categories dynamically.
  - Implement hover/click dropdown with TailwindCSS styling.
  - Navigate to /category/:categoryName on category click.
  - Ensure mobile responsiveness.

## Routing Updates
- [x] Update client/src/App.jsx to add route /category/:categoryName pointing to Products component.

## Page Updates
- [x] Update client/src/pages/Products.jsx:
  - Fetch products from backend API.
  - Filter products by category if categoryName param is present.

## Testing
- [x] Test dropdown functionality, navigation, product filtering, and responsiveness.
- [x] Ensure no layout breaks, logo position unchanged, no React/Tailwind errors.
