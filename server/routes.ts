import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { mpesaService } from "./services/mpesa";
import { emailService } from "./services/email";
import { 
  insertTestimonialSchema,
  insertFitnessClassSchema,
  insertMembershipPlanSchema,
  insertProductSchema,
  insertNewsletterSubscriptionSchema,
  insertContactSubmissionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Content management routes
  app.get('/api/pages', async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.get('/api/pages/:slug', async (req, res) => {
    try {
      const page = await storage.getPage(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Testimonials
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = req.query.featured 
        ? await storage.getFeaturedTestimonials()
        : await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post('/api/testimonials', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  // Fitness classes
  app.get('/api/classes', async (req, res) => {
    try {
      const classes = await storage.getFitnessClasses();
      res.json(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.get('/api/classes/:id/schedules', async (req, res) => {
    try {
      const schedules = await storage.getClassSchedules(req.params.id);
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching class schedules:", error);
      res.status(500).json({ message: "Failed to fetch class schedules" });
    }
  });

  // Membership plans
  app.get('/api/membership-plans', async (req, res) => {
    try {
      const plans = await storage.getMembershipPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching membership plans:", error);
      res.status(500).json({ message: "Failed to fetch membership plans" });
    }
  });

  app.get('/api/membership/current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const membership = await storage.getUserMembership(userId);
      res.json(membership);
    } catch (error) {
      console.error("Error fetching user membership:", error);
      res.status(500).json({ message: "Failed to fetch membership" });
    }
  });

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const products = req.query.featured 
        ? await storage.getFeaturedProducts()
        : await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getProductCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Orders
  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { items, shippingAddress, total } = req.body;

      // Create order
      const order = await storage.createOrder({
        userId,
        total,
        shippingAddress,
        status: 'pending'
      });

      // Add order items
      for (const item of items) {
        await storage.addOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Payment routes
  app.post('/api/payments/stk-push', async (req, res) => {
    try {
      const { phoneNumber, amount, orderId, membershipPlanId, accountReference } = req.body;

      if (!phoneNumber || !amount || !accountReference) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create payment record
      const payment = await storage.createPayment({
        orderId,
        membershipId: membershipPlanId,
        amount,
        phoneNumber,
        method: 'mpesa',
        status: 'pending'
      });

      // Initiate STK push
      const result = await mpesaService.initiateSTKPush({
        phoneNumber,
        amount: parseFloat(amount),
        accountReference: `PAY-${payment.id}`,
        transactionDesc: `Payment for ${accountReference}`
      });

      if (result.success) {
        res.json({
          success: true,
          paymentId: payment.id,
          checkoutRequestId: result.data?.CheckoutRequestID,
          message: "Payment initiated. Please check your phone."
        });
      } else {
        await storage.updatePaymentStatus(payment.id, 'failed');
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      res.status(500).json({ message: "Failed to initiate payment" });
    }
  });

  app.post('/api/payments/mpesa/callback', async (req, res) => {
    try {
      console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
      
      const callbackResult = mpesaService.processCallback(req.body);
      
      if (callbackResult.success) {
        // Find payment by checkout request ID or transaction reference
        // Update payment status and order/membership
        console.log('Payment successful:', callbackResult);
        
        // Here you would typically:
        // 1. Find the payment record
        // 2. Update payment status
        // 3. Update order status or activate membership
        // 4. Send confirmation email
      } else {
        console.log('Payment failed:', callbackResult.resultDesc);
      }
      
      res.json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) {
      console.error("Callback processing error:", error);
      res.status(500).json({ message: "Callback processing failed" });
    }
  });

  app.get('/api/payments/:id/status', async (req, res) => {
    try {
      const payment = await storage.getPayment(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json({ status: payment.status, payment });
    } catch (error) {
      console.error("Error fetching payment status:", error);
      res.status(500).json({ message: "Failed to fetch payment status" });
    }
  });

  // Newsletter subscription
  app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(validatedData);
      
      // Send welcome email
      await emailService.sendEmail({
        to: validatedData.email,
        subject: 'Welcome to FeminaFit Newsletter!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e91e63;">Welcome to Our Community!</h1>
            <p>Thank you for subscribing to the FeminaFit newsletter.</p>
            <p>You'll receive updates on classes, events, and wellness tips.</p>
            <p>Best regards,<br>The FeminaFit Team</p>
          </div>
        `
      });

      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Contact form
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send notification email to admin
      await emailService.sendEmail({
        to: 'feminafit59@gmail.com',
        subject: `New Contact Form Submission from ${validatedData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>New Contact Form Submission</h1>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message}</p>
          </div>
        `
      });

      res.json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact submission error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
