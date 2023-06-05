import { Route, Routes } from "react-router";
import { useLocation } from "react-router-dom";
import { ItemPage } from "./pages/ItemPage";
import { MainPage } from "./pages/MainPage";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { AdminPage } from "./pages/AdminPage";
import { OrdersPage } from "./pages/OrdersPage";
import { TitlePage } from "./pages/TitlePage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { check } from "./http/userAPI";
import { Context } from "./index";
import { fetchBrands, fetchTypes } from "./http/itemAPI";
import { AuthProvider } from "./components/AuthProvider";

const App = observer(() => {
  const { user: userContext, item } = useContext(Context);

  useEffect(() => {
    check().then((data) => {
      userContext.setIsAuth(true);
      userContext.setRole(data.role);
    });
    fetchTypes().then((data) => item.setTypes(data));
    fetchBrands().then((data) => item.setBrands(data));
    localStorage.getItem("basket") == null &&
      localStorage.setItem("basket", "[]");
  }, []);

  const location = useLocation();

  return (
    <div
      className={`App ${
        location.pathname === "/admin" ||
        location.pathname === "/orders" ||
        location.pathname === "/catalog" ||
        location.pathname.includes("/item")
          ? "backgrounded"
          : ""
      }`}
    >
      <Header userContext={userContext} itemContext={item} />

      <div className="main">
        <AuthProvider userContext={userContext} />
        <Routes>
          <Route path="/" element={<TitlePage />} />
          <Route path="/catalog" element={<MainPage />} />
          <Route
            path="/item/:id"
            element={<ItemPage isAdmin={userContext?.role === "ADMIN"} />}
          />
          {userContext.role === "ADMIN" && (
            <Route path="/admin" element={<AdminPage />} />
          )}
          {userContext.role === "MANAGER" && (
            <Route path="/orders" element={<OrdersPage />} />
          )}
        </Routes>
      </div>

      <Footer />
    </div>
  );
});

export default App;
