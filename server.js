const express = require("express");
const app = express();
const PORT = 3000;

const stripe = require("stripe")(
  "sk_test_51KhxNDDmqZkvExu3a7MVdNo9618V226SwbrkW0ioEr0Ql18pYu5PA4g9UIPCePSS5Od0D4b9Rlc2kCmKDOVSWFkA00BwpOeNt8"
);

const YOUR_DOMAIN = "localhost:3000";

app.use(express.static("public"));

app.post("/create-checkout-session", async (req, res) => {
  try {
    const prices = await stripe.prices.list();
    // session=客が何を買ったのか、どういう状態にあるかというのを指す
    const session = await stripe.checkout.sessions.create({
      lineitems: [{
        price: prices.data[0].id,
        quantity:1,
      }],
      mode: "subscription",
      success_url: `{YOUR_DOMAIN}/succeaa.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });
    // 成功したら303のredirectでsession.urlに飛ばす
    res.redirect(303, session.url);
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, console.log("Server was activated!"));
