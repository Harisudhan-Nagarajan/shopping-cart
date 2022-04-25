import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { API, cartCtx, currencyFormatter } from "./App";

export function PhoneList() {
  const [mobiles, setMobiles] = useState([]);

  useEffect(() => {
    fetch(`${API}/mobiles`)
      .then((data) => data.json())
      .then((mbs) => setMobiles(mbs));
  }, []);

  return (
    <div className="phone-list-container">
      {mobiles.map((mobile) => (
        <Phone key={mobile._id} mobile={mobile} />
      ))}
    </div>
  );
}

function Phone({ mobile }) {
  const [cart, updateCart] = useContext(cartCtx);
  return (
    <div className="phone-container">
      <img src={mobile.img} alt={mobile.model} className="phone-picture" />
      <h2 className="phone-name">{mobile.model}</h2>
      <p className="phone-company">{mobile.company}</p>
      <p className="phone-price">{currencyFormatter(mobile.price)}</p>
      <Button
        variant="contained"
        onClick={() => updateCart({ mobile, action: "increment" })}
      >
        Add to cart
      </Button>
    </div>
  );
}
