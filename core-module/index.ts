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
import Logger from "./functions/logger";
import { ZeonServices } from "./types/types";


const app = express();
const port = process.env.CORE_BACKEND_PORT
const logger = new Logger(ZeonServices.CORE);

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
  origin: ["http://localhost:3000", "http://localhost:3002", "http://localhost:3001","https://dev.zeonhq.com", "https://zeon-finance.flutterflow.app","http://localhost:5687","https://app.zeonhq.com","http://zeon-dashboard:5687"],
  // ALLOW ALL METHODs
  methods: "*",
  // ALLOW ALL HEADERS
  allowedHeaders: "*",
  credentials: true
})); 

// set up router
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const stripe = require('stripe')(process.env.STRIPE_KEY);
const domainURL = process.env.DOMAIN;
// set up routes
app.use("/auth", authRoutes);
app.use("/user", verifyIdentity, userRoutes);
app.use("/workspaces", verifyIdentity,workspaceRoutes);
app.use("/companies",verifyIdentity, companyRoutes);
app.use("/contacts",verifyIdentity, contactRoutes);
app.use("/notes",verifyIdentity, notesRoutes);
app.use("/datamodel", verifyIdentity, dataModelRoutes);
app.use("/ai",AIRoute);

app.post("/internal/communication/send-email", CommunicationController.sendEmail);

app.post('/internal/slack/message', oauthController.sendMessage);


app.get("/health", (req: Request, res: Response)=>{
  console.log('core service health check');
  res.send("all ok from zeon core service health |");
});

// Fetch the Checkout Session to display the JSON result on the success page
app.get("/checkout-session", async (req, res) => {
  try {
    const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
  } catch (error) {
    logger.error({
      message: 'Error fetching checkout session',
      error
    });
    console.log('error', error);
  }
  
});

app.post('/create-customer-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${domainURL}`,
      
    });
    res.json({ url: session.url });
  } catch (error) {
    console.log('error', error);
    logger.error({
      message: 'Error creating customer portal session',
      error
    });
  }
  
})

app.post('/create-customer-seesion', async (req, res) => {
  try {
    const { customerId } = req.body;
  const customerSession = await stripe.customerSessions.create({
    customer: customerId,
    components: {
      pricing_table: {
        enabled: true,
      },
    },
  });
  return res.json({ client_secret: customerSession.client_secret });
  } catch (error) {
    logger.error({
      message: 'Error creating customer session',
      error
    });
    console.log('error', error);
  }
  
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
    const priceInfo = await stripe.prices.retrieve(session.line_items.data[0].price.id);
    session.subscribedPlan = priceInfo.lookup_key;
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
  try {
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
  } catch (error) {
    console.log('error', error);
    logger.error({
      message: 'Error creating customer portal session',
      error
    });
  }
  
});

app.post('/stripe_webhooks', express.json({type: 'application/json'}), async (request, response) => {
  const event = request.body;
  console.log('>>>>>>>>>>>>', event.type,'event', event);
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object;
      console.log('checkoutSession', checkoutSession);
      const workspaceId = checkoutSession.client_reference_id;
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      checkoutSession.id,
      {
        expand: ['line_items'],
      }
    );
    const priceId = sessionWithLineItems.line_items.data[0].price.id;
    const priceInfo = await stripe.prices.retrieve(priceId);
    const lookupKey = priceInfo.lookup_key;
    const customerId = checkoutSession.customer;
    const workspaceInfo = await Workspace.findOne({ workspaceId, stripeCustomerId: customerId});
      
      if (!workspaceInfo) {
        return response.status(400).json({ message: 'Workspace not found' });
      }
      const newSubscription = await stripe.subscriptions.retrieve(checkoutSession.subscription);
      // get current time
      const thisTime = new Date().getTime();
      newSubscription.subscriptionStartTime = thisTime;
      newSubscription.subscriptionEndTime = thisTime + 30 * 24 * 60 * 60 * 1000;
      newSubscription.subscribedPlan = lookupKey;
      // update subscription info
      workspaceInfo.subscriptionInfo = newSubscription;
      await workspaceInfo.save();
      return response.status(200).json({ message: 'Subscription updated' });
      
      // Fulfill the purchase...
      break;
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
    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object;
      console.log('subscriptionDeleted', subscriptionDeleted);
      const priceDeleted = await stripe.prices.retrieve(subscriptionDeleted.items.data[0].price.id);
      const lookupDeleted = priceDeleted.lookup_key;
      const customerDeleted = subscriptionDeleted.customer;
      const workspaceDeleted = await Workspace.findOne({ stripeCustomerId: customerDeleted });
      if (!workspaceDeleted) {
        return response.status(400).json({ message: 'Workspace not found' });
      }
      // get current time
      const currentTimeDeleted = new Date().getTime();
      subscriptionDeleted.subscriptionStartTime = currentTimeDeleted;
      subscriptionDeleted.subscriptionEndTime = currentTimeDeleted + 30 * 24 * 60 * 60 * 1000;
      subscriptionDeleted.subscribedPlan = lookupDeleted;
      // update subscription info
      workspaceDeleted.subscriptionInfo = subscriptionDeleted;
      await workspaceDeleted.save();
      return response.status(200).json({ message: 'Subscription deleted' });
      // break;
    case 'customer.subscription.paused':
      const subscriptionPaused = event.data.object;
      console.log('subscriptionPaused', subscriptionPaused);
      const pricePaused = await stripe.prices.retrieve(subscriptionPaused.items.data[0].price.id);
      const lookupPaused = pricePaused.lookup_key;
      const customerPaused = subscriptionPaused.customer;
      const workspacePaused = await Workspace.findOne({ stripeCustomerId: customerPaused });
      if (!workspacePaused) {
        return response.status(400).json({ message: 'Workspace not found' });
      }
      // get current time
      const currentTimePaused = new Date().getTime();
      subscriptionPaused.subscriptionStartTime = currentTimePaused;
      subscriptionPaused.subscriptionEndTime = currentTimePaused + 30 * 24 * 60 * 60 * 1000;
      subscriptionPaused.subscribedPlan = lookupPaused;
      // update subscription info
      workspacePaused.subscriptionInfo = subscriptionPaused;
      await workspacePaused.save();
      return response.status(200).json({ message: 'Subscription paused' });
      // break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});

// run server at port 6000
app.listen(port, () => {
  console.log(`Server running at port ${port}, Node version: ${process.version}`);
});

// export verifyIdentity so that it can be imported when this package is used as a dependency

export {
  verifyIdentity,
  Logger
}