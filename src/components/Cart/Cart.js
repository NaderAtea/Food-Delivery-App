import { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";
import React from "react";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [ischeckout, setIscheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didsubmit, setDidSubmit] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };
  const CheckChangeHandler = () => {
    setIscheckout(true);
  };
  const submitOrderHandler = async (userData) => {
    setIsSubmitting(false);
    await fetch(
      "https://food-delivery-app-d5d5b-default-rtdb.europe-west1.firebasedatabase.app/orders.json",
      {
        mathod: "POST",
        body: JSON.stringify({
          users: userData,
          ordersItems: cartCtx.items,
        }),
      }
    );
    setIsSubmitting(true);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );
  const modalAction = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={CheckChangeHandler}>
          Order
        </button>
      )}
    </div>
  );
  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {ischeckout && (
        <Checkout onCancel={props.onClose} onConfirm={submitOrderHandler} />
      )}
      {!ischeckout && modalAction}
    </React.Fragment>
  );
  const isSubmittingModalContent = (
    <React.Fragment>
      <p> Sending Order Data...</p>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );
  const didSubmitModalContent = <p>Successfully Sent the Order!</p>;
  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didsubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {didsubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
