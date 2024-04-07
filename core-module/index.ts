import "web-streams-polyfill/dist/polyfill.es6.js";
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import workspaceRoutes from "./routes/workspace";
import companyRoutes from "./routes/company";
import contactRoutes from "./routes/contact";
import dataModelRoutes from "./routes/dataModel";
import cors from "cors";
import { verifyIdentity } from "./functions/user"
import { UserInterface } from "./schema/User"
import { initializeDB } from "./functions/workspace"
import CommunicationController from "./controller/CommunicationController";
import oauthController from "./controller/oauthController";
import notesRoutes from "./routes/notes";
import AIRoute from "./routes/AIRoute";
import Workspace from "./schema/Workspace";
//@ts-ignore
import {SubcriptionPlan} from "./constants/constants.ts"

const app = express();
const port = process.env.CORE_BACKEND_PORT

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface
    }
  }
}

// connect to mongodb
initializeDB();

// setup cors to allow all origins
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001","https://dev.zeonhq.com", "https://zeon-finance.flutterflow.app","http://localhost:5687","https://app.zeonhq.com","http://zeon-dashboard:5687"],
  // ALLOW ALL METHODs
  methods: "*",
  // ALLOW ALL HEADERS
  allowedHeaders: "*",
  credentials: true
})); 

// set up router
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const stripe = require('stripe')('sk_test_51M0LxIB51Fz4VVlmxAPwH9MPLd8YCl2oOJSeASkkpbK8A677KfaGtidZTzOAoVIesllCLLqoIx40kFqHeRlsro430079HPXs2H');
const domainURL = process.env.DOMAIN;
// set up routes
app.use("/auth", authRoutes);
app.use("/user", verifyIdentity, userRoutes);
app.use("/workspaces", verifyIdentity,workspaceRoutes);
app.use("/companies",verifyIdentity, companyRoutes);
app.use("/contacts",verifyIdentity, contactRoutes);
app.use("/notes",verifyIdentity, notesRoutes);
app.use("/datamodel", verifyIdentity, dataModelRoutes);
app.use("/ai", verifyIdentity, AIRoute);

app.post("/internal/communication/send-email", CommunicationController.sendEmail);

app.post('/internal/slack/message', oauthController.sendMessage);


app.get("/health", (req: Request, res: Response)=>{
  console.log('core service health check');
  res.send("all ok from zeon core service health |");
});

// Fetch the Checkout Session to display the JSON result on the success page
app.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

app.post('/create-customer-portal-session', async (req, res) => {
  const { customerId } = req.body;
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${domainURL}`,
    
  });
  res.json({ url: session.url });
})

app.post("/create-checkout-session", async (req, res) => {
  
  const { priceId, workspaceId,customerId } = req.body;

  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the form
  // [automatic_tax] - to automatically calculate sales tax, VAT and GST in the checkout page
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
      success_url: `${domainURL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/payment-failed`,
      customer: customerId
      // automatic_tax: { enabled: true }
    });
    // save session id to workspace
    const workspace = await Workspace.findOne({ workspaceId });
    workspace.stripeSessionId = session.id;
    await workspace.save();
    console.log('session', session);

    return res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
});

app.post('/payment-success', async (req, res) => {
  const { sessionId } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId,{
      expand: ['line_items'],
    });
    console.log('session', session.line_items.data[0].price.id);
    // get workspace by sessionId
    const workspace = await Workspace.findOne({ stripeSessionId: sessionId });
    if (!workspace) {
      return res.status(400).json({ message: 'Workspace not found' });
    }
    // get current time
    const currentTime = new Date().getTime();
    session.subscriptionStartTime = currentTime;
    session.subscriptionEndTime = currentTime + 30 * 24 * 60 * 60 * 1000;
    session.subscribedPlan = session.line_items.data[0].price.lookup_key;
    // session.subscribedPlan = SubscriptionPlan[]
    // update subscription info
    workspace.subscriptionInfo = session
    await workspace.save();
    return res.status(200).json({ message: 'Payment successful' });
  } catch (error) {
      console.log('error', error);
      return res.status(400).json({ message: 'Payment failed', error });
  }
  
})

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    basicPrice: process.env.BASIC_PRICE_ID,
    proPrice: process.env.PRO_PRICE_ID,
  });
});

app.post('/customer-portal', async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { sessionId } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = process.env.DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});

app.post('/stripe_webhooks', express.json({type: 'application/json'}), async (request, response) => {
  const event = request.body;
  console.log('>>>>>>>>>>>>', event.type,'event', event);
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      console.log('subscription', subscription);
      const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);
      const lookup = price.lookup_key;
      const customer = subscription.customer;
      const workspace = await Workspace.findOne({ stripeCustomerId: customer });
      if (!workspace) {
        return response.status(400).json({ message: 'Workspace not found' });
      }
      // get current time
      const currentTime = new Date().getTime();
      subscription.subscriptionStartTime = currentTime;
      subscription.subscriptionEndTime = currentTime + 30 * 24 * 60 * 60 * 1000;
      subscription.subscribedPlan = lookup;
      // update subscription info
      workspace.subscriptionInfo = subscription;
      await workspace.save();
      return response.status(200).json({ message: 'Subscription updated' });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});

// run server at port 6000
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

// export verifyIdentity so that it can be imported when this package is used as a dependency

export {
  verifyIdentity
}