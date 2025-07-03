export async function POST(req) {
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
        return_url: "https://yuktiherbs.com/thank-you?order_id={order_id}",
      }),
    });

    const data = await response.json();

    if (data.payment_link) {
      return Response.json({ success: true, link: data.payment_link });
    } else {
      return Response.json({ success: false, message: data.message || "Payment link failed" }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
