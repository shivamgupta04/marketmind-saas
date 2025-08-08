import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Initialize Google Gemini
console.log('Initializing Gemini with API key:', process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to clean up Gemini's JSON response
function cleanJsonString(str) {
    // Remove markdown backticks and 'json' identifier
    return str.replace(/```json/g, '').replace(/```/g, '').trim();
}


const getPriceSuggestion = async (productName) => {
  try {
    console.log('Searching for price of:', productName);
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(productName)}&tbm=shop`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const prices = [];
    
    // Try multiple possible selectors
    const selectors = [
      '.sh-dgr__content .a8Pemb',          // Primary selector
      '.sh-dgr__content .kHxwFf',          // Alternative selector
      'span[aria-label*="₹"]',             // Price with Rupee symbol
      'span[aria-label*="Price"]',         // Generic price label
      '.YMlj7b span',                      // Another possible location
      '[data-sh-or="price"] span'          // Data attribute based selector
    ];

    for (const selector of selectors) {
      $(selector).each((i, el) => {
        if (i < 5) {
          const priceText = $(el).text().trim();
          // Remove currency symbols and non-numeric chars except decimal point
          const cleanPrice = priceText.replace(/[^0-9.]/g, "");
          
          if (cleanPrice && !isNaN(parseFloat(cleanPrice))) {
            prices.push(parseFloat(cleanPrice));
          }
        }
      });
      
      // If we found prices with this selector, no need to try others
      if (prices.length > 0) break;
    }

    console.log('Found prices:', prices);

    if (prices.length === 0) {
      console.log('No prices found for:', productName);
      // Default price ranges based on product type
      const defaultPrices = {
        'photo': 499,
        'print': 499,
        'painting': 999,
        'artwork': 999,
        'bag': 1499,
        'handbag': 1499,
        'tote': 1499,
        'default': 999
      };

      // Try to match product type with default prices
      for (const [type, price] of Object.entries(defaultPrices)) {
        if (productName.toLowerCase().includes(type)) {
          console.log(`Using default price for ${type}:`, price);
          return price;
        }
      }
      return defaultPrices.default;
    }

    // Calculate average price
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    console.log('Average price calculated:', averagePrice);
    
    // Round to nearest hundred for cleaner pricing
    const roundedPrice = Math.round(averagePrice / 100) * 100;
    console.log('Rounded price:', roundedPrice);
    
    return roundedPrice;
  } catch (error) {
    console.error("Price suggestion failed:", error.message);
    console.error("Error details:", error);
    // Return a reasonable default price based on the product name
    return 999; // Default fallback price
  }
};

export const generateListing = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded.' });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (user.credits < 1) return res.status(402).json({ message: 'Insufficient credits. Please buy more.' });

  try {
    console.log('Starting product listing generation...');
    // Use the gemini-1.5-flash model for image analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('Model initialized successfully');

    const imageBuffer = req.file.buffer;
    const imageBase64 = imageBuffer.toString("base64");

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `
      Analyze the product in this image. Based on what you see, provide a complete e-commerce product listing.
      Respond with ONLY a valid JSON object in the following format, with no extra text or markdown:
      {
        "title": "A compelling, SEO-friendly title",
        "productName": "A short, descriptive name for the product shown, e.g., 'blue leather handbag'",
        "description": "A 2-3 sentence engaging product description",
        "bulletPoints": ["An array", "of 3-4 key features", "as strings"]
      }
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse the JSON response from Gemini
    const cleanedText = cleanJsonString(text);
    const listingData = JSON.parse(cleanedText);

    const productName = listingData.productName;
    console.log('Getting price suggestion for:', productName);
    const suggestedPrice = await getPriceSuggestion(productName);
    console.log('Suggested price:', suggestedPrice);

    user.credits -= 1;
    await user.save();

    const finalProduct = {
      user: user._id,
      imageQuery: productName,
      title: listingData.title,
      description: listingData.description,
      bulletPoints: listingData.bulletPoints,
      suggestedPrice,
    };
    
    const newProduct = new Product(finalProduct);
    await newProduct.save();

    res.status(201).json({ product: newProduct, remainingCredits: user.credits });

  } catch (error) {
    console.error('Error generating listing with Gemini:', error);
    console.error('Error details:', {
      status: error.status,
      statusText: error.statusText,
      errorDetails: error.errorDetails
    });
    res.status(500).json({ 
      message: 'Failed to generate listing',
      error: error.message,
      details: error.errorDetails
    });
  }
};

export const getMyListings = async (req, res) => {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
};
