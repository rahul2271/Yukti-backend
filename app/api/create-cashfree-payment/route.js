// ✅ BACKEND: app/api/create-cashfree-payment/route.js

export async function POST(req) {
  const headers = {
    "Access-Control-Allow-Origin": "https://www.yuktiherbs.com",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  try {
    const { name, email, phone, amount, currency } = await req.json();

    const response = await fetch("https://api.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "x-api-version": "2022-09-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: `CONSULT-${Date.now()}`,
        order_amount: amount,
        order_currency: currency,
        customer_details: {
          customer_id: phone,
          customer_email: email,
          customer_phone: phone,
        },
        order_note: `Consultation by ${name}`,
        return_url: "https://consultations.yuktiherbs.com/thank-you?order_id={order_id}"
      }),
    });

    const data = await response.json();
    console.log("🔥 CASHFREE RESPONSE:", data);

    if (data.payment_link) {
      return new Response(JSON.stringify({ success: true, link: data.payment_link }), {
        status: 200,
        headers
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: data.message || "Payment link failed" }), {
        status: 500,
        headers
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers
    });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://www.yuktiherbs.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}