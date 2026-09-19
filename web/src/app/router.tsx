import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { HomePage } from '../pages/HomePage';
import { TequenosPage } from '../pages/TequenosPage';
import { PizzasPage } from '../pages/PizzasPage';
import { PromocionesPage } from '../pages/PromocionesPage';
import { PastelitosPage } from '../pages/PastelitosPage';
import { BebidasPage } from '../pages/BebidasPage';
import { CremasPage } from '../pages/CremasPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { useCartStore } from '../store/cartStore';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/** /carrito abre el pedido y vuelve al inicio. */
function CartRedirect() {
  const openCart = useCartStore((s) => s.openCart);
  useEffect(() => {
    openCart();
  }, [openCart]);
  return <Navigate to="/" replace />;
}

const withLayout = (page: React.ReactNode) => <PageContainer>{page}</PageContainer>;

export const AppRouter: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={withLayout(<HomePage />)} />
        <Route path="/tequenos" element={withLayout(<TequenosPage />)} />
        <Route path="/pizzas" element={withLayout(<PizzasPage />)} />
        <Route path="/promociones" element={withLayout(<PromocionesPage />)} />
        <Route path="/pastelitos" element={withLayout(<PastelitosPage />)} />
        <Route path="/bebidas" element={withLayout(<BebidasPage />)} />
        <Route path="/cremas" element={withLayout(<CremasPage />)} />
        <Route path="/producto/:slug" element={withLayout(<ProductDetailPage />)} />
        <Route path="/carrito" element={<CartRedirect />} />
        <Route path="*" element={withLayout(<NotFoundPage />)} />
      </Routes>
    </>
  );
};
