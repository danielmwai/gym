import {
  users,
  pages,
  testimonials,
  fitnessClasses,
  classSchedules,
  membershipPlans,
  memberships,
  products,
  productCategories,
  orders,
  orderItems,
  payments,
  newsletterSubscriptions,
  contactSubmissions,
  type User,
  type UpsertUser,
  type Page,
  type InsertPage,
  type Testimonial,
  type InsertTestimonial,
  type FitnessClass,
  type InsertFitnessClass,
  type ClassSchedule,
  type MembershipPlan,
  type InsertMembershipPlan,
  type Membership,
  type Product,
  type InsertProduct,
  type ProductCategory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type Payment,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type ContactSubmission,
  type InsertContactSubmission,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUserWithEmail(userData: { email: string; password: string; firstName: string; lastName: string }): Promise<User>;

  // Content management
  getPage(slug: string): Promise<Page | undefined>;
  getPages(): Promise<Page[]>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined>;

  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Classes
  getFitnessClasses(): Promise<FitnessClass[]>;
  getFitnessClass(id: string): Promise<FitnessClass | undefined>;
  getClassSchedules(classId?: string): Promise<ClassSchedule[]>;
  createFitnessClass(fitnessClass: InsertFitnessClass): Promise<FitnessClass>;

  // Membership plans
  getMembershipPlans(): Promise<MembershipPlan[]>;
  getMembershipPlan(id: string): Promise<MembershipPlan | undefined>;
  getUserMembership(userId: string): Promise<Membership | undefined>;
  createMembership(membership: any): Promise<Membership>;

  // Products and e-commerce
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductCategories(): Promise<ProductCategory[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: string, stock: number): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<void>;
  addOrderItem(orderItem: any): Promise<OrderItem>;

  // Payments
  createPayment(payment: any): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  updatePaymentStatus(id: string, status: string, transactionData?: any): Promise<void>;

  // Newsletter
  subscribeNewsletter(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;

  // Contact
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUserWithEmail(userData: { email: string; password: string; firstName: string; lastName: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        authProvider: "email",
        emailVerified: false,
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Content management
  async getPage(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(and(eq(pages.slug, slug), eq(pages.published, true)));
    return page;
  }

  async getPages(): Promise<Page[]> {
    return await db.select().from(pages).where(eq(pages.published, true)).orderBy(desc(pages.createdAt));
  }

  async createPage(page: InsertPage): Promise<Page> {
    const [newPage] = await db.insert(pages).values(page).returning();
    return newPage;
  }

  async updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined> {
    const [updatedPage] = await db
      .update(pages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updatedPage;
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.featured, true)).orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  // Classes
  async getFitnessClasses(): Promise<FitnessClass[]> {
    return await db.select().from(fitnessClasses).where(eq(fitnessClasses.active, true));
  }

  async getFitnessClass(id: string): Promise<FitnessClass | undefined> {
    const [fitnessClass] = await db.select().from(fitnessClasses).where(eq(fitnessClasses.id, id));
    return fitnessClass;
  }

  async getClassSchedules(classId?: string): Promise<ClassSchedule[]> {
    if (classId) {
      return await db.select().from(classSchedules).where(eq(classSchedules.classId, classId));
    }
    return await db.select().from(classSchedules);
  }

  async createFitnessClass(fitnessClass: InsertFitnessClass): Promise<FitnessClass> {
    const [newClass] = await db.insert(fitnessClasses).values(fitnessClass).returning();
    return newClass;
  }

  // Membership plans
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    return await db.select().from(membershipPlans).where(eq(membershipPlans.active, true));
  }

  async getMembershipPlan(id: string): Promise<MembershipPlan | undefined> {
    const [plan] = await db.select().from(membershipPlans).where(eq(membershipPlans.id, id));
    return plan;
  }

  async getUserMembership(userId: string): Promise<Membership | undefined> {
    const [membership] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, userId), eq(memberships.status, "active")))
      .orderBy(desc(memberships.createdAt));
    return membership;
  }

  async createMembership(membership: any): Promise<Membership> {
    const [newMembership] = await db.insert(memberships).values(membership).returning();
    return newMembership;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.active, true));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.featured, true), eq(products.active, true)));
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(productCategories).where(eq(productCategories.active, true));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProductStock(id: string, stock: number): Promise<void> {
    await db.update(products).set({ stock }).where(eq(products.id, id));
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
  }

  async addOrderItem(orderItem: any): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Payments
  async createPayment(payment: any): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async updatePaymentStatus(id: string, status: string, transactionData?: any): Promise<void> {
    const updateData: any = { status, updatedAt: new Date() };
    if (transactionData) {
      updateData.mpesaData = transactionData;
      if (transactionData.transactionId) {
        updateData.transactionId = transactionData.transactionId;
      }
    }
    await db.update(payments).set(updateData).where(eq(payments.id, id));
  }

  // Newsletter
  async subscribeNewsletter(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [newSubscription] = await db
      .insert(newsletterSubscriptions)
      .values(subscription)
      .onConflictDoUpdate({
        target: newsletterSubscriptions.email,
        set: { active: true },
      })
      .returning();
    return newSubscription;
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.active, true));
  }

  // Contact
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return newSubmission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
}

export const storage = new DatabaseStorage();
