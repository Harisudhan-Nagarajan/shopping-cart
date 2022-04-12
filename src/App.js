import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
} from "@mui/material";
import { createContext, useEffect, useState } from "react";
import "./App.css";
// import { API } from "./global";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Route, Routes, useNavigate } from "react-router-dom";
import { PhoneList } from "./PhoneList";
import { Cart } from "./Cart";

export const cartCtx = createContext();
export const API = "https://shopping-cart18.herokuapp.com";

export const currencyFormatter = (number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    number
  );

export default function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(`${API}/cart`)
      .then((data) => data.json())
      .then((cartItems) => setCart(cartItems));
  }, []);

  const updateCart = ({ mobile, action }) => {
    fetch(`${API}/cart?type=${action}`, {
      method: "PUT",
      body: JSON.stringify(mobile),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((latestCart) => setCart(latestCart));
  };

  const totalCartQty = cart
    .map((item) => item.qty)
    .reduce((sum, item) => sum + item, 0);

  const navigate = useNavigate();
  return (
    <div className="App">
      <cartCtx.Provider value={[cart, updateCart]}>
        <Box sx={{ flexGrow: 1, marginBottom: "5rem" }}>
          <AppBar position="fixed">
            <Toolbar>
              <Button
                onClick={() => navigate("/")}
                color="inherit"
                sx={{ marginLeft: "auto" }}
              >
                Home
              </Button>
              <Button color="inherit">Log in</Button>
              <IconButton color="inherit" onClick={() => navigate("/cart")}>
                <Badge badgeContent={totalCartQty} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            
            </Toolbar>
          </AppBar>
        </Box>

        <Routes>
          <Route path="/" element={<PhoneList />} />
          <Route path="/cart" element={<Cart setCart={setCart} />} />
        </Routes>
        {/* <PhoneList />
        <Cart /> */}
      </cartCtx.Provider>
    </div>
  );
}


