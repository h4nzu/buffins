import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const PRICES = {
  classic: 20,
  chocChip: 25,
  creamCheese: 28,
  box6: {
    classic: 110,
    chocChip: 140,
    creamCheese: 160,
  },
};

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      customerName,
      contactNo,
      socialHandle,
      orderType, // 'Box of 4' | 'Box of 6' | 'Assorted'
      classicQty = 0,
      chocChipQty = 0,
      creamCheeseQty = 0,
      deliveryAddress,
      timeSlot,
      paymentMethod,
    } = body;

    const cQty = Number(classicQty) || 0;
    const chQty = Number(chocChipQty) || 0;
    const ccQty = Number(creamCheeseQty) || 0;
    const totalItems = cQty + chQty + ccQty;

    // Enforce business rule: no solo orders (< 4 pcs)
    if (totalItems < 4) {
      return NextResponse.json(
        { error: 'Minimum order is 4 pieces (Box of 4, Box of 6, or Assorted).' },
        { status: 400 }
      );
    }

    if (!customerName || !contactNo || !deliveryAddress) {
      return NextResponse.json(
        { error: 'Please complete your name, contact number, and delivery address.' },
        { status: 400 }
      );
    }

    // Server-side price calculation matching your menu
    let totalAmount = 0;
    if (orderType === 'Box of 6' && cQty === 6 && chQty === 0 && ccQty === 0) {
      totalAmount = PRICES.box6.classic;
    } else if (orderType === 'Box of 6' && chQty === 6 && cQty === 0 && ccQty === 0) {
      totalAmount = PRICES.box6.chocChip;
    } else if (orderType === 'Box of 6' && ccQty === 6 && cQty === 0 && chQty === 0) {
      totalAmount = PRICES.box6.creamCheese;
    } else {
      // Box of 4 and Assorted per piece use exact piece rates (₱20 / ₱25 / ₱28)
      totalAmount =
        cQty * PRICES.classic +
        chQty * PRICES.chocChip +
        ccQty * PRICES.creamCheese;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const orderId = `BM-${Date.now().toString().slice(-5)}`;
    const timestamp = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Orders!A:O',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          timestamp,
          orderId,
          customerName,
          contactNo,
          socialHandle || 'N/A',
          orderType,
          cQty,
          chQty,
          ccQty,
          totalItems,
          totalAmount,
          deliveryAddress,
          timeSlot,
          paymentMethod,
          'PENDING',
        ]],
      },
    });

    return NextResponse.json({ success: true, orderId, totalAmount });
  } catch (error) {
    console.error('Order sync error:', error);
    return NextResponse.json(
      { error: 'Failed to submit order. Please try again.' },
      { status: 500 }
    );
  }
}