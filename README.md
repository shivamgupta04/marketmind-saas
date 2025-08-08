<div align="center">
  <h1><b>MarketMind: AI E-commerce Listing Generator</b></h1>
  <p>A full-stack SaaS application that leverages a Large Language Model (LLM) to autonomously generate complete e-commerce product listings from a single image.</p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
    <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  </p>
</div>
## 🚀 The Problem MarketMind Solves

In the fast-paced world of e-commerce, creating high-quality product listings is a major bottleneck. Sellers spend hours:
* ✍️ Writing catchy titles and persuasive descriptions.
* 📸 Detailing product features and specifications.
* 💰 Researching competitors to set an optimal price.

**MarketMind automates this entire workflow.** It acts as an AI co-pilot for e-commerce sellers, reducing the time to create a compelling, market-ready listing from minutes to mere seconds.

## ✨ Core Features

* **🤖 AI-Powered Content Generation:**
  * **Vision Analysis:** Upload an image, and Google's Gemini Vision model instantly identifies the product and its key attributes.
  * **LLM-Powered Copywriting:** A Large Language Model (Gemini) generates SEO-friendly titles, engaging descriptions, and concise bullet points.
  * **Smart Price Suggestion (RAG):** A practical implementation of **RAG (Retrieval-Augmented Generation)**. The system retrieves current pricing for similar items online and uses this data to inform the AI's price suggestion.

* **⚙️ Full SaaS Functionality:**
  * **Secure User Authentication:** Full registration and login system using JWT and password hashing (`bcrypt.js`).
  * **Credit-Based System:** Users get free credits on signup. Each AI generation consumes a credit, creating a real-world usage model.
  * **Payment Gateway:** Integrated with **Razorpay** to allow users to purchase more credits, making it a complete, monetizable platform for the Indian market.

* **🎨 Modern & Animated UI:**
  * A sleek, professional frontend built with **React** and styled with **Tailwind CSS**.
  * Fluid animations and page transitions powered by **Framer Motion** for a premium user experience.
  * A central user dashboard to generate listings, view credit balance, and see creation history.

## 🛠️ Technical Architecture & Workflow

This project demonstrates a robust MERN stack architecture integrated with external AI and payment services.

<div align="center">
<img src="https://www.google.com/search?q=https://via.placeholder.com/800x300.png%3Ftext%3DReact%2BFrontend%2B->+Express+Backend+->+MongoDB/Gemini/Razorpay" alt="Architecture Diagram">
</div>

**Workflow Breakdown:**

1.  **Image Upload:** The user uploads a product image from the React frontend.
2.  **Backend Processing:** The Express.js server receives the image. The user's JWT is verified by a middleware to protect the route.
3.  **Credit Check:** The system checks the user's credit balance in the MongoDB database.
4.  **LLM Vision Call:** The image is sent to the **Google Gemini API**. The LLM analyzes the image and returns a text description of the product.
5.  **RAG for Pricing:**
    * **Retrieve:** The backend uses the product description from the LLM to perform a targeted web search for similar items using `axios` and `cheerio`.
    * **Augment:** The retrieved prices are processed and aggregated.
    * **Generate:** This pricing data, along with the product description, is passed back to the **Gemini LLM** in a new prompt, asking it to generate the final listing content and a suggested price.
6.  **Database Update:** The user's credit is decremented, and the newly generated listing is saved to MongoDB, linked to the user's ID.
7.  **Response:** The final listing data is sent back to the React frontend and displayed to the user with a smooth animation.

## ⚙️ Getting Started Locally

### Prerequisites
* Node.js (v18 or higher)
* npm
* A code editor (VS Code recommended)

### Installation & Setup

1.  **Clone the Repository:**
    ```
    git clone [https://github.com/shivamgupta04/marketmind-saas.git](https://github.com/shivamgupta04/marketmind-saas.git)
    cd marketmind-saas
    ```

2.  **Setup Backend:**
    ```
    cd server
    npm install
    # Create a .env file and add your keys (see below)
    ```

3.  **Setup Frontend:**
    ```
    cd ../client
    npm install
    # Add your Razorpay Key ID in DashboardPage.js
    ```

### Environment Variables

Create a `.env` file in the `/server` directory and populate it with your credentials:

MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
JWT_SECRET=YOUR_SUPER_SECRET_RANDOM_STRING
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET


### Running the Application

You will need two terminals open.

**Terminal 1: Start Backend**

cd server
node index.js


**Terminal 2: Start Frontend**

cd client
npm start

The application will be available at `http://localhost:3000`.

## 👤 Contact

**Shivam Gupta**

* **LinkedIn:** [linkedin.com/in/shivam-gupta-7a0408292/](https://www.linkedin.com/in/shivam-gupta-7a0408292/)
* **GitHub:** [shivamgupta04](https://www.google.com/search?q=https://github.com/shivamgupta04)
* **Email:** shivam888srsj@gmail.com
