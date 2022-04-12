import { Alert, Button, Snackbar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartCtx, API, currencyFormatter } from "./App";

export function Cart({ setCart }) {
  const [cart, updateCart] = useContext(cartCtx);
  const navigate = useNavigate();

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "left",
  });

  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    fetch(`${API}/cart`)
      .then((data) => data.json())
      .then((cartItems) => setCart(cartItems));
  }, []);

  const CheckOut = () => {
    fetch(`${API}/checkout`, {
      method: "POST",
      body: JSON.stringify(cart),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((latestCart) => setCart(latestCart))
      .then(() => handleClick({
        vertical: "top",
        horizontal: "right",
      })
      )
      .then(() => setTimeout(() => navigate("/"), 3000));
  };

  const total = cart
    .map((item) => item.qty * item.price)
    .reduce((sum, item) => sum + item, 0);

  return (
    <section className="cart-list">
      <h2>Purchase Items</h2>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          Order Placed Successfully !
        </Alert>
      </Snackbar>
      <div className="phone-list-container">
        {cart.map((mobile) => (
          <CartItem mobile={mobile} key={mobile._id} />
        ))}
      </div>
      <div className="cart-checkout">
        <h1>{currencyFormatter(total)}</h1>
        <Button
          variant="outlined"
          onClick={() => {
            CheckOut();
          }}
        >
          ✔ Checkout
        </Button>
      </div>
    </section>
  );
}
function CartItem({ mobile }) {
  const [cart, updateCart] = useContext(cartCtx);
  return (
    <div className="cartItem-container">
      <img src={mobile.img} alt={mobile.model} className="cartItem-picture" />
      <div>
        <h2 className="cartItem-name">{mobile.model}</h2>
        <p className="cartItem-company">{mobile.company}</p>
        <p className="cartItem-price">{currencyFormatter(mobile.price)}</p>
        <p className="cartItem-quantity">
          <Button
            variant="outlined"
            onClick={() => updateCart({ mobile, action: "decrement" })}
          >
            -
          </Button>
          {"       "} {mobile.qty} {"      "}
          <Button
            variant="outlined"
            onClick={() => updateCart({ mobile, action: "increment" })}
          >
            +
          </Button>
        </p>
      </div>
      <p className="subtotal-price">
        SubTotal : {currencyFormatter(mobile.qty * mobile.price)}
      </p>
    </div>
  );
}
